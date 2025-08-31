// plugins/init-auth.js  (note: no .client)
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(() => {
  const store = useUserStore()
  store.initAuth()
})
