// composables/useApi.js
export const useApi = () => {
  const { $axios } = useNuxtApp()

  const get = async (url, params = {}) => {
    const { data } = await $axios.get(url, { params })  // url like '/auth/user'
    return data
  }

  const post = async (url, body = {}) => {
    const { data } = await $axios.post(url, body)       // url like '/auth/logout'
    return data
  }

  return { get, post }
}
