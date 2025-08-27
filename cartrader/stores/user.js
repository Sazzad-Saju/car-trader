import { defineStore } from "pinia";
import Cookies from 'js-cookie'
import axios from "axios";

export const useUserStore = defineStore('user', {

    state: () => ({
        user: null,
        api_token: '',
        isLoggedIn: false,
        isRegisterSuccess: false,
        registerMessage: '',
    }),

    actions: {
        setToken(token) {
            if (!token) return;
            Cookies.set('auth_token', token);
            this.api_token = token;
            console.log('Token set:', token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        },
        initAuth() {
            const token = Cookies.get('auth_token');
            if (token) {
                this.setToken(token);
            }
        },
        async login(email, password, session_id) {
            await axios.post('/login', {
                email: email,
                password: password,
                session_id: session_id,
            }).then(({ data }) => {
                this.setToken(data?.data?.token);
                this.user = data.data
                this.isLoggedIn = true;
            });
        },
        async register(payload) {
            const router = useRouter();
            try {
                const { data } = await axios.post('/register', payload);
                if (data.success) {
                    this.isRegisterSuccess = true
                    this.registerMessage = 'Sign up completed. Please verify your email.'
                } else {
                    this.isRegisterSuccess = false
                    this.registerMessage = ''
                    console.log(data.message);
                }
                return data; // Return the response data
            } catch ({ data }) {
                this.isRegisterSuccess = false
                this.registerMessage = ''
                console.log(data.message);
                // errors.value = error.response.data.errors
                return data; // Return the error response data
            }
        },
        async getUser() {
            await axios.get('/user').then(({ data }) => {
                if (data) {
                    this.user = data; // <-- change here
                    console.log('User fetched:', this.user);
                    this.isLoggedIn = true;
                } else {
                    this.resetState();
                }
            }).catch((err) => {
                console.log(err);
                this.resetState();
            });
        },
        async logout() {
            const router = useRouter();
            await axios.post('/logout')
            Cookies.remove('auth_token')
            this.resetState()
            await router.push('/login')
        },
        resetState() {
            this.user = null
            this.api_token = ''
            this.isLoggedIn = false
            this.isRegisterSuccess = false
            delete axios.defaults.headers.common['Authorization'];
        },
        persist: {
            paths: ['user', 'api_token', 'isLoggedIn'],
        },
    }


})