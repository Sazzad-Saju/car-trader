// composables/useAuth.js
export const useAuth = () => {
  const user = useState('user', () => null)
  const token = useCookie('auth_token')
  const { get, post } = useApi()

  const fetchUser = async () => {
    if (!token.value) { user.value = null; return null }
    try {
      const me = await get('/auth/user') // -> GET http://127.0.0.1:8000/api/auth/user
      user.value = me
      return me
    } catch (e) {
      user.value = null
      throw e
    }
  }

  const logout = async () => {
    try { await post('/auth/logout') } catch (_) {}
    token.value = null
    user.value = null
    await navigateTo('/login')
  }

  return {
    user,
    isLoggedIn: computed(() => !!user.value),
    fetchUser,
    logout,
  }
}
