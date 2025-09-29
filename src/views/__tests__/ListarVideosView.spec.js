import {beforeEach, describe, expect, it, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import {nextTick} from 'vue'
import ListarVideosView from '../ListarVideosView.vue'
import Loader from '@/components/Loader.vue'
import {baixarVideoPorId, listarArquivos} from '@/services/videoService'

// Mock dos serviços
vi.mock('@/services/videoService', () => ({
    listarArquivos: vi.fn(),
    baixarVideoPorId: vi.fn()
}))

describe('ListarVideosView', () => {
  let wrapper

  const mockArquivos = [
    {
        id: 1,
        originalFileName: 'teste1.zip',
        fileSize: 10.5,
        status: 'PROCESSED'
    },
    {
        id: 2,
        originalFileName: 'teste2.zip',
        fileSize: 15.7,
        status: 'PROCESSING'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Inicialização e carregamento', () => {
    it('deve mostrar loader enquanto carrega os dados', async () => {
      listarArquivos.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      wrapper = mount(ListarVideosView)
      expect(wrapper.findComponent(Loader).exists()).toBe(true)
    })

    it('deve carregar e exibir a lista de arquivos', async () => {
      listarArquivos.mockResolvedValue(mockArquivos)
      wrapper = mount(ListarVideosView)
        await nextTick()
      await nextTick()
      expect(wrapper.findComponent(Loader).exists()).toBe(false)
      const linhasTabela = wrapper.findAll('tbody tr')
      expect(linhasTabela).toHaveLength(2)
      // Verificar se os dados estão corretos
      expect(linhasTabela[0].find('.col-nome').text()).toBe('teste1.zip')
      expect(linhasTabela[0].find('.col-tamanho').text()).toBe('10.50')
    })

    it('deve exibir mensagem quando não houver arquivos', async () => {
      listarArquivos.mockResolvedValue([])
      wrapper = mount(ListarVideosView)
      await nextTick()
      await nextTick()
      expect(wrapper.find('.empty-list-message').exists()).toBe(true)
      expect(wrapper.find('.empty-list-message').text()).toContain('Nenhum arquivo compactado disponível ainda')
    })
  })

  describe('Status dos arquivos', () => {
    beforeEach(async () => {
      listarArquivos.mockResolvedValue(mockArquivos)
      wrapper = mount(ListarVideosView)
      await nextTick()
      await nextTick()
    })

    it('deve exibir o status correto para arquivo finalizado', () => {
      const statusFinalizado = wrapper.findAll('.status')[0]
      expect(statusFinalizado.classes()).toContain('finalizado')
        expect(statusFinalizado.find('.status-text.desktop').text()).toBe('PROCESSED')
    })

    it('deve exibir o status correto para arquivo processando', () => {
      const statusProcessando = wrapper.findAll('.status')[1]
      expect(statusProcessando.classes()).toContain('processando')
        expect(statusProcessando.find('.status-text.desktop').text()).toBe('PROCESSING')
    })
  })

  describe('Funcionalidade de download', () => {
    beforeEach(async () => {
      listarArquivos.mockResolvedValue(mockArquivos)
      wrapper = mount(ListarVideosView)
      await nextTick()
      await nextTick()
    })

    it('deve habilitar o botão de download para arquivos finalizados', () => {
      const botoesDownload = wrapper.findAll('.btn-download')
      expect(botoesDownload[0].attributes('disabled')).toBeUndefined()
    })

    it('deve desabilitar o botão de download para arquivos em processamento', () => {
      const botoesDownload = wrapper.findAll('.btn-download')
      expect(botoesDownload[1].attributes('disabled')).toBeDefined()
    })

      it('deve chamar baixarVideoPorId e abrir a URL ao clicar em download', async () => {
          const url = 'http://localhost/download/teste1.zip'
          baixarVideoPorId.mockResolvedValue(url)
          const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => {
          })
      const botaoDownload = wrapper.findAll('.btn-download')[0]
      await botaoDownload.trigger('click')
          await nextTick()
          expect(baixarVideoPorId).toHaveBeenCalledWith(1)
          expect(windowOpenSpy).toHaveBeenCalledWith(url, '_blank')
          windowOpenSpy.mockRestore()
    })
  })

  describe('Responsividade', () => {
    beforeEach(async () => {
      listarArquivos.mockResolvedValue(mockArquivos)
      wrapper = mount(ListarVideosView)
      await nextTick()
      await nextTick()
    })

    it('deve ter elementos para visualização desktop e mobile', () => {
      const statusElement = wrapper.find('.status')
      expect(statusElement.find('.status-text.desktop').exists()).toBe(true)
      expect(statusElement.find('.status-icon.mobile').exists()).toBe(true)
    })
  })
})
