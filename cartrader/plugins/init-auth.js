// plugins/init-auth.js
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(() => {
  const store = useUserStore()
  store.initAuth()
})
