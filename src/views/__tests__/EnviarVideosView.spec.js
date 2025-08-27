import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EnviarVideosView from '../EnviarVideosView.vue'
import { enviarVideos } from '@/services/videoService'

vi.mock('@/services/videoService', () => ({
  enviarVideos: vi.fn()
}))

describe('EnviarVideosView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(EnviarVideosView)
    vi.clearAllMocks()
  })

  describe('validarArquivosSelecionados', () => {
    it('deve retornar false e exibir mensagem de erro quando nenhum arquivo for selecionado', async () => {
      const result = await wrapper.vm.validarArquivosSelecionados()

      expect(result).toBe(false)
      expect(wrapper.vm.message).toBe('Selecione pelo menos um vídeo para enviar.')
      expect(wrapper.vm.messageType).toBe('error')
    })

    it('deve retornar true quando arquivos forem selecionados', async () => {
      wrapper.vm.files = [new File([''], 'test.mp4', { type: 'video/mp4' })]

      const result = await wrapper.vm.validarArquivosSelecionados()

      expect(result).toBe(true)
    })
  })

  describe('handleFileChange', () => {
    it('deve atualizar files e limpar mensagens quando arquivos forem selecionados', () => {
      const mockFiles = [new File([''], 'test.mp4', { type: 'video/mp4' })]
      const event = {
        target: {
          files: mockFiles
        }
      }

      wrapper.vm.handleFileChange(event)

      expect(wrapper.vm.files).toStrictEqual(mockFiles)
      expect(wrapper.vm.message).toBe('')
      expect(wrapper.vm.messageType).toBe('')
    })
  })

  describe('handleSubmit', () => {
    it('deve retornar sem enviar quando validação falhar', async () => {
      wrapper.vm.files = null

      await wrapper.vm.handleSubmit()

      expect(enviarVideos).not.toHaveBeenCalled()
      expect(wrapper.vm.isSending).toBe(false)
    })

    it('deve enviar videos e exibir mensagem de sucesso', async () => {
      const mockFiles = [new File([''], 'test.mp4', { type: 'video/mp4' })]
      wrapper.vm.files = mockFiles

      enviarVideos.mockResolvedValueOnce({
        success: true,
        message: 'Vídeos enviados com sucesso'
      })

      await wrapper.vm.handleSubmit()

      expect(enviarVideos).toHaveBeenCalledWith(mockFiles)
      expect(wrapper.vm.message).toBe('Vídeos enviados com sucesso')
      expect(wrapper.vm.messageType).toBe('success')
      expect(wrapper.vm.isSending).toBe(false)
      expect(wrapper.vm.files).toBeNull()
    })

    it('deve exibir mensagem de erro quando o envio falhar', async () => {
      const mockFiles = [new File([''], 'test.mp4', { type: 'video/mp4' })]
      wrapper.vm.files = mockFiles

      enviarVideos.mockResolvedValueOnce({
        success: false,
        message: 'Erro ao enviar vídeos'
      })

      await wrapper.vm.handleSubmit()

      expect(enviarVideos).toHaveBeenCalledWith(mockFiles)
      expect(wrapper.vm.message).toBe('Erro ao enviar vídeos')
      expect(wrapper.vm.messageType).toBe('error')
      expect(wrapper.vm.isSending).toBe(false)
    })
  })

  describe('Renderização do componente', () => {
    it('deve renderizar corretamente o título', () => {
      expect(wrapper.find('h1').text()).toBe('Enviar vídeos')
    })

    it('deve desabilitar o input durante o envio', async () => {
      wrapper.vm.isSending = true
      await wrapper.vm.$nextTick()

      expect(wrapper.find('input[type="file"]').attributes('disabled')).toBeDefined()
    })
  })
})
