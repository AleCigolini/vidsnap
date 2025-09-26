import {beforeEach, describe, expect, it, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import {createRouter, createWebHistory} from 'vue-router'
import {nextTick} from 'vue'
import LoginView from '../LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', name: 'home'},
    {path: '/login', name: 'login'}
  ]
})

const routerPushSpy = vi.spyOn(router, 'push')

const loginMock = vi.fn((username, password) => username === 'admin' && password === 'admin')
vi.mock('@/services/authService', () => ({
  useAuth: vi.fn(() => ({
    login: loginMock,
    isAuthenticated: {value: false}
  }))
}))

describe('LoginView', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    router.push('/login')

    wrapper = mount(LoginView, {
      global: {
        plugins: [router]
      }
    })
  })

  describe('Renderização', () => {
    it('deve renderizar o formulário de login corretamente', () => {
      expect(wrapper.find('h1').text()).toBe('Login')
      expect(wrapper.find('#username').exists()).toBe(true)
      expect(wrapper.find('#password').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').text()).toBe('Entrar')
    })

    it('não deve mostrar mensagem de erro inicialmente', () => {
      expect(wrapper.find('.error-message').exists()).toBe(false)
    })
  })

  describe('Interação com o formulário', () => {
    it('deve atualizar o v-model quando o usuário digita', async () => {
      const usernameInput = wrapper.find('#username')
      const passwordInput = wrapper.find('#password')

      await usernameInput.setValue('admin')
      await passwordInput.setValue('admin')

      expect(wrapper.vm.username).toBe('admin')
      expect(wrapper.vm.password).toBe('admin')
    })
  })

  describe('Processo de login', () => {
    it('deve fazer login com sucesso e redirecionar para home', async () => {
      const usernameInput = wrapper.find('#username')
      const passwordInput = wrapper.find('#password')

      await usernameInput.setValue('admin')
      await passwordInput.setValue('admin')

      await wrapper.find('form').trigger('submit')

      expect(loginMock).toHaveBeenCalledWith('admin', 'admin')

      await nextTick()

      expect(routerPushSpy).toHaveBeenCalledWith('/')
    })

    it('deve mostrar erro com credenciais inválidas', async () => {
      const usernameInput = wrapper.find('#username')
      const passwordInput = wrapper.find('#password')

      await usernameInput.setValue('usuario_errado')
      await passwordInput.setValue('senha_errada')

      await wrapper.find('form').trigger('submit')

      expect(wrapper.find('.error-message').text()).toBe('Usuário ou senha inválidos')
      expect(router.currentRoute.value.path).toBe('/login')
    })

    it('deve requerer preenchimento dos campos', async () => {
      await wrapper.find('form').trigger('submit')

      const usernameInput = wrapper.find('#username')
      const passwordInput = wrapper.find('#password')

      expect(usernameInput.attributes('required')).toBeDefined()
      expect(passwordInput.attributes('required')).toBeDefined()
    })
  })

  describe('Segurança', () => {
    it('deve usar tipo password para o campo senha', () => {
      const passwordInput = wrapper.find('#password')
      expect(passwordInput.attributes('type')).toBe('password')
    })
  })
})
