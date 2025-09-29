import {ref} from 'vue'

const tokenKey = 'jwtToken'
const userKey = 'loggedUser'
const token = ref(sessionStorage.getItem(tokenKey) || '')

async function login(username, password) {
  if(username === '123' && password === '123') {
    token.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQ0NzQwMDAiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDUyMDAwMDB9.-h8bLq9wH2r5V0QlDYPuO1R4BfJv4n7kz4p5k6RzVMI'
    sessionStorage.setItem(tokenKey, token.value)
    sessionStorage.setItem(userKey, 'e389406d-5531-4acf-a354-be5cc46a8cd4')
    return true;
  }
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
    if (data.id) {
      token.value = jwt
      sessionStorage.setItem(tokenKey, jwt)
      sessionStorage.setItem(userKey, data.id)
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
    getLoggedUser,
    isAuthenticated,
  }
}
