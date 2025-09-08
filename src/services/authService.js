import { ref } from 'vue'

const tokenKey = 'jwtToken'
const token = ref(sessionStorage.getItem(tokenKey) || '')

function login(username, password) {
  // Simulate API call and JWT response
  if (username === 'admin' && password === 'admin') {
    const fakeJwt = 'fake-jwt-token-for-admin' // Replace with real API call
    token.value = fakeJwt
    sessionStorage.setItem(tokenKey, fakeJwt)
    return true
  }
  return false
}

function logout() {
  token.value = ''
  sessionStorage.removeItem(tokenKey)
}

function getToken() {
  return token.value
}

function isAuthenticated() {
  return !!token.value
}

export function useAuth() {
  return {
    token,
    login,
    logout,
    getToken,
    isAuthenticated,
  }
}
