// composables/useApi.js
export const useApi = () => {
  const { $axios } = useNuxtApp() // Access the global axios instance

  // Function to perform GET requests
  const get = async (url, params = {}) => {
    try {
      const response = await $axios.get(url, { params })
      return response.data
    } catch (error) {
      console.error('Error during GET request:', error)
      throw error
    }
  }

  // Function to perform POST requests
  const post = async (url, data) => {
    try {
      const response = await $axios.post(url, data)
      return response.data
    } catch (error) {
      console.error('Error during POST request:', error)
      throw error
    }
  }

  return { get, post }
}
