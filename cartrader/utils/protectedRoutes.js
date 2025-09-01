// utils/protectedRoutes.js
export const PROTECTED_PREFIXES = ['/profile', '/cart', '/checkout']

export function isProtectedPath(path = '') {
  return PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix))
}
