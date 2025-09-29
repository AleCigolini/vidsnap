import {beforeEach, describe, expect, it, vi} from 'vitest'

// Mock axios antes do import do módulo
let axiosCreateSpy, interceptorSpy
vi.mock('axios', () => {
  interceptorSpy = vi.fn()
  axiosCreateSpy = vi.fn(() => ({
    interceptors: {
      request: { use: interceptorSpy }
    },
    defaults: {}
  }))
  return { default: { create: axiosCreateSpy } }
})

describe('api.js', () => {
  let api
  let interceptor
  beforeEach(async () => {
    vi.resetModules() // Limpa o cache dos módulos
    vi.clearAllMocks()
    sessionStorage.clear()
    // Define a variável de ambiente
    if (!import.meta.env) import.meta.env = {}
    import.meta.env.VITE_APP_API_BASE_URL = 'http://fake-url/'
    // Importa o módulo após mocks e env
    api = (await import('../api')).default
    // Recupera o interceptor registrado
    interceptor = (interceptorSpy.mock.calls[0] && interceptorSpy.mock.calls[0][0]) || ((c) => c)
  })

  it('deve criar instância do axios com baseURL correta', () => {
    expect(axiosCreateSpy).toHaveBeenCalledWith({
      baseURL: 'http://fake-url/'
    })
  })

  it('deve adicionar Authorization se houver token', () => {
    const config = { headers: {} }
    sessionStorage.setItem('jwtToken', 'abc123')
    const result = interceptor(config)
    expect(result.headers.Authorization).toBe('Bearer abc123')
  })

  it('não deve adicionar Authorization se não houver token', () => {
    const config = { headers: {} }
    sessionStorage.removeItem('jwtToken')
    const result = interceptor(config)
    expect(result.headers.Authorization).toBeUndefined()
  })
})
