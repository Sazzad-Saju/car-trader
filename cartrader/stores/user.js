import { defineStore } from 'pinia';
import { useCookie } from '#app';  // Nuxt's `useCookie` to handle cookies
import axios from 'axios';

export const useUserStore = defineStore('user', {

  state: () => ({
    user: null,
    api_token: '',       // Store token if needed for other purposes
    isLoggedIn: false,
    isRegisterSuccess: false,
    registerMessage: '',
  }),

  actions: {
    // Set token to both state and cookie
    setToken(token) {
      if (!token) return;
      
      // Use Nuxt's `useCookie` to set the token
      const authToken = useCookie('auth_token', { path: '/' });
      authToken.value = token;

      this.api_token = token;
      console.log('Token set:', token);

      // Set the token globally for Axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    // Initialize authentication and set token if available
    initAuth() {
      const authToken = useCookie('auth_token', { path: '/' }).value;
      if (authToken) {
        this.setToken(authToken); // Set token if it exists in the cookie
      }
    },

    // Login action, POST request to authenticate
    async login(email, password, session_id) {
      try {
        const { data } = await axios.post('/login', { email, password, session_id });

        if (data?.data?.token) {
          this.setToken(data.data.token);  // Set token after successful login
          this.user = data.data;
          this.isLoggedIn = true;
        }

      } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed');
      }
    },

    // Register action, POST request to register a new user
    async register(payload) {
      try {
        const { data } = await axios.post('/register', payload);

        if (data.success) {
          this.isRegisterSuccess = true;
          this.registerMessage = 'Sign up completed. Please verify your email.';
        } else {
          this.isRegisterSuccess = false;
          this.registerMessage = '';
          console.log(data.message);
        }
        return data;  // Return the response data
      } catch (error) {
        console.error('Registration failed:', error);
        this.isRegisterSuccess = false;
        this.registerMessage = '';
        return error.response.data; // Return the error response data
      }
    },

    // Fetch user data, requires authentication
    async getUser() {
      try {
        const { data } = await axios.get('/user');
        if (data) {
          this.user = data;
          this.isLoggedIn = true;
          console.log('User fetched:', this.user);
        } else {
          this.resetState();  // Reset if no data
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        this.resetState();  // Reset if there is an error
      }
    },

    // Logout action
    async logout() {
      try {
        await axios.post('/logout');
        this.resetState();  // Reset store state after logout
        const authToken = useCookie('auth_token', { path: '/' });
        authToken.value = null;  // Remove token from cookie
        await this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },

    // Reset user state
    resetState() {
      this.user = null;
      this.api_token = '';
      this.isLoggedIn = false;
      this.isRegisterSuccess = false;
      this.registerMessage = '';
      
      // Remove token from axios header globally
      delete axios.defaults.headers.common['Authorization'];
    },
  },

  persist: {
    paths: ['user', 'api_token', 'isLoggedIn'],
  },
});
