import {beforeEach, describe, expect, it} from 'vitest'
import {useNotification} from '../notificationService'

// Mock do EventSource global
class MockEventSource {
  constructor(url) {
    this.url = url
    this.onmessage = null
    this.onerror = null
    global.lastEventSourceInstance = this
  }
  close() {
    this.closed = true
  }
}

global.EventSource = MockEventSource

describe('notificationService.js', () => {
  let notification, connect, disconnect
  beforeEach(() => {
    // Limpa notification antes de cada teste
    ;({notification, connect, disconnect} = useNotification())
    notification.value = null
    global.lastEventSourceInstance = undefined
  })

  it('deve conectar e atualizar notification ao receber mensagem', () => {
    connect()
    const eventSource = global.lastEventSourceInstance
    const fakeData = { foo: 'bar' }
    eventSource.onmessage({ data: JSON.stringify(fakeData) })
    expect(notification.value).toEqual(fakeData)
  })

  it('deve limpar notification e desconectar em erro', () => {
    connect()
    const eventSource = global.lastEventSourceInstance
    eventSource.onerror('erro')
    expect(notification.value).toBeNull()
    expect(eventSource.closed).toBe(true)
  })

  it('deve fechar EventSource ao chamar disconnect', () => {
    connect()
    const eventSource = global.lastEventSourceInstance
    disconnect()
    expect(eventSource.closed).toBe(true)
  })
})
