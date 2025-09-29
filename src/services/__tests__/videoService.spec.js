import {beforeEach, describe, expect, it, vi} from 'vitest'
import * as videoService from '../videoService'

global.fetch = vi.fn()

describe('videoService.js', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve listar arquivos', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ id: 1 }]) })
    const result = await videoService.listarArquivos()
    expect(fetch).toHaveBeenCalled()
    expect(result).toEqual([{ id: 1 }])
  })

  it('deve lançar erro ao listar arquivos se !ok', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Erro' })
    await expect(videoService.listarArquivos()).rejects.toThrow()
  })

  it('deve baixar video por id', async () => {
    fetch.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('url-fake') })
    const url = await videoService.baixarVideoPorId(1)
    expect(fetch).toHaveBeenCalled()
    expect(typeof url).toBe('string')
    expect(url).toBe('url-fake')
  })

  it('deve lançar erro ao baixar video se !ok', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404, statusText: 'Not found' })
    await expect(videoService.baixarVideoPorId(2)).rejects.toThrow()
  })
})
