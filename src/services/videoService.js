export function listarArquivosCompactados() {
    // Mock: simula uma chamada assíncrona ao backend
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {nome: 'video1asdadsadadasdasdasdasdasdsd.zip', tamanhoMB: 12.3, status: 'Finalizado'},
                {nome: 'video2.zip', tamanhoMB: 8.7, status: 'Em Processamento'},
                {nome: 'video3.zip', tamanhoMB: 15.1, status: 'Finalizado'},
            ])
        }, 500)
    })
}

/**
 * Envia vídeos para o backend (mock).
 * @param {FileList|File[]} arquivos Lista de arquivos de vídeo
 * @returns {Promise<{ success: boolean, message: string }>}
 *
 * Exemplo de uso real (descomente e ajuste quando tiver o endpoint):
 *
 * // import api from './api'
 * // export async function enviarVideos(arquivos) {
 * //   const formData = new FormData()
 * //   Array.from(arquivos).forEach(file => formData.append('videos', file))
 * //   const response = await api.post('/api/videos', formData)
 * //   return response.data
 * // }
 */
export function enviarVideos(arquivos) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (Math.random() > 0.2) {
                resolve({success: true, message: 'Vídeo(s) enviado(s) com sucesso!'})
            } else {
                resolve({success: false, message: 'Falha ao enviar o(s) vídeo(s). Tente novamente.'})
            }
        }, 800)
    })
}
