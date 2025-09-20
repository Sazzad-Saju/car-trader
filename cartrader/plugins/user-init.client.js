export default defineNuxtPlugin(() => {
  const userStore = useUserStore()
  userStore.init()
})
