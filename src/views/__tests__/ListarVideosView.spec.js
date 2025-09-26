import {beforeEach, describe, expect, it, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import {nextTick} from 'vue'
import ListarVideosView from '../ListarVideosView.vue'
import {listarArquivos} from '@/services/videoService.js'
import Loader from '@/components/Loader.vue'

vi.mock('@/services/videoService', () => ({
  listarArquivosCompactados: vi.fn()
}))

describe('ListarVideosView', () => {
  let wrapper

  const mockArquivos = [
    {
      nome: 'teste1.zip',
      tamanhoMB: 10.5,
      status: 'Finalizado'
    },
    {
      nome: 'teste2.zip',
      tamanhoMB: 15.7,
      status: 'Processando'
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
      await nextTick() // Aguardar a atualização do DOM após o onMounted

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
      expect(statusFinalizado.find('.status-text').text()).toBe('Finalizado')
    })

    it('deve exibir o status correto para arquivo processando', () => {
      const statusProcessando = wrapper.findAll('.status')[1]
      expect(statusProcessando.classes()).toContain('processando')
      expect(statusProcessando.find('.status-text').text()).toBe('Processando')
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

    it('deve chamar a função de download com o nome correto do arquivo', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {
      })

      const botaoDownload = wrapper.findAll('.btn-download')[0]
      await botaoDownload.trigger('click')

      expect(alertSpy).toHaveBeenCalledWith('Download do arquivo: teste1.zip')
      alertSpy.mockRestore()
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
