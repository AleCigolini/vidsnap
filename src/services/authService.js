import { ref } from 'vue'

const isAuthenticated = ref(sessionStorage.getItem('isAuthenticated') === 'true')

function login(username, password) {
  if (username === 'admin' && password === 'admin') {
    isAuthenticated.value = true
    sessionStorage.setItem('isAuthenticated', 'true')
    return true
  }
  return false
}

function logout() {
  isAuthenticated.value = false
  sessionStorage.removeItem('isAuthenticated')
}

export function useAuth() {
  return {
    isAuthenticated,
    login,
    logout,
  }
}

