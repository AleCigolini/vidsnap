export async function listarArquivos() {
  const response = await fetch(
    import.meta.env.VITE_APP_API_BASE_URL + '/api/v1/videos'
  )
  if (!response.ok) throw new Error('Erro ao listar vídeos')
  return await response.json()
}

/**
 * Envia vídeos para o backend.
 * @param {FileList|File[]} arquivos Lista de arquivos de vídeo
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function enviarVideos(arquivos) {
  const formData = new FormData()
  Array.from(arquivos).forEach(file => formData.append('videos', file))
  const response = await fetch(
    import.meta.env.VITE_APP_API_BASE_URL + '/api/v1/videos/upload',
    {
      method: 'POST',
      body: formData,
    }
  )
  if (!response.ok) {
    return {success: false, message: 'Falha ao enviar o(s) vídeo(s). Tente novamente.'}
  }
  return await response.json()
}
