import { ref } from 'vue'

const notification = ref(null)
let eventSource = null

function connect() {
    eventSource = new EventSource('http://localhost:3000/events')

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