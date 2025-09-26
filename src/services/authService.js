import {ref} from 'vue'

const tokenKey = 'jwtToken'
const userKey = 'loggedUser'
const token = ref(sessionStorage.getItem(tokenKey) || '')

async function login(username, password) {
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_API_BASE_URL + '/usuario/identificacao',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: username,
          senha: password,
        }),
      }
    )
    if (!response.ok) return false

    const jwt = response.headers.get('Authorization')
    const data = await response.json()
    if (jwt && data.login) {
      token.value = jwt
      sessionStorage.setItem(tokenKey, jwt)
      sessionStorage.setItem(userKey, data.login)
      return true
    }
    return false
  } catch (e) {
    return false
  }
}

function logout() {
  token.value = ''
  sessionStorage.removeItem(tokenKey)
  sessionStorage.removeItem(userKey)
}

function getToken() {
  return token.value
}

function getLoggedUser() {
  return sessionStorage.getItem(userKey) || ''
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
    getLoggedUser,
    isAuthenticated,
  }
}
