import {ref} from 'vue'
import {useAuth} from './authService'

const notification = ref(null)
let eventSource = null

function connect() {
  const {getLoggedUser} = useAuth()
  const clientId = getLoggedUser()
  eventSource = new EventSource(
    import.meta.env.VITE_APP_API_BASE_URL + "/notifications/sse/messages?clientId=" + clientId
  )

  eventSource.onmessage = (event) => {
    notification.value = JSON.parse(event.data)
  }

  eventSource.onerror = (error) => {
    console.error('SSE Error:', error)
    notification.value = null
    disconnect()
  }
}

function disconnect() {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
}

export function useNotification() {
  return {
    notification,
    connect,
    disconnect,
  }
}