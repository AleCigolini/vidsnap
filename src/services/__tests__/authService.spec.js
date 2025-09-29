import {beforeEach, describe, expect, it} from 'vitest'
import {useAuth} from '../authService'

describe('authService.js', () => {
  let auth
  beforeEach(() => {
    sessionStorage.clear()
    auth = useAuth()
    auth.logout() // garante estado limpo
  })

  it('deve salvar token no login (mock local)', async () => {
    await auth.login('123', '123')
    expect(auth.token.value).not.toBe('')
    expect(sessionStorage.getItem('jwtToken')).toBe(auth.token.value)
  })

  it('deve retornar token salvo', async () => {
    await auth.login('123', '123')
    const novoAuth = useAuth()
    expect(novoAuth.token.value).toBe(sessionStorage.getItem('jwtToken'))
  })

  it('deve remover token no logout', async () => {
    await auth.login('123', '123')
    auth.logout()
    expect(auth.token.value).toBe('')
    expect(sessionStorage.getItem('jwtToken')).toBeNull()
  })

  it('deve retornar false para isAuthenticated sem token', () => {
    expect(auth.isAuthenticated()).toBe(false)
  })

  it('deve retornar true para isAuthenticated com token', async () => {
    await auth.login('123', '123')
    expect(auth.isAuthenticated()).toBe(true)
  })
})
