import axios from "axios"
import Cookies from "js-cookie";
import {useUserStore} from "~/stores/user.js";
export default defineNuxtPlugin((NuxtApp) => {
    const config = useRuntimeConfig()
    axios.defaults.baseURL = config.public.API_BASE_URL
    axios.defaults.withCredentials = false;
    axios.defaults.proxyHeaders = false;
    if(process.client){
        const store = useUserStore();
        const token = Cookies.get('auth_token');
        if(token){
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            // axios.defaults.headers.common['Accept-Encoding'] = 'gzip, compress, br, brotli';
        }
        
        // Centralized error handling for API requests
        axios.interceptors.response.use(
            (response) => response,
            async ({response}) => {
                if (response.status === 401) {
                    // Handle unauthenticated errors
                    store.resetState()
                    Cookies.remove('auth_token'); // Clear token
                    localStorage.removeItem('user')
                    // await router.push('/login'); // Redirect to login with await
                    return Promise.reject();
                }

                return Promise.reject(response); // Re-throw other errors
            }
        );
    }
    return {
        provide: {
            axios: axios
        },
    };
});