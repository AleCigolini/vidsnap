<script setup lang="ts">
import {ref} from 'vue'
import {enviarVideos} from '@/services/videoService'

const files = ref<FileList | null>(null)
const message = ref('')
const messageType = ref<'success' | 'error' | ''>('')
const isSending = ref(false)

function limparMensagem() {
  message.value = ''
  messageType.value = ''
}

function exibirMensagem(texto: string, tipo: 'success' | 'error') {
  message.value = texto
  messageType.value = tipo
  setTimeout(() => {
    limparMensagem()
  }, 5000)
}

function limparInputArquivo() {
  files.value = null
  const input = document.querySelector('input[type="file"]') as HTMLInputElement | null
  if (input) input.value = ''
}

function validarArquivosSelecionados(): boolean {
  if (!files.value || files.value.length === 0) {
    exibirMensagem('Selecione pelo menos um vídeo para enviar.', 'error')
    return false
  }
  return true
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  files.value = target.files
  message.value = ''
  messageType.value = ''
}

async function handleSubmit() {
  if (!validarArquivosSelecionados()) return
  isSending.value = true
  const resultado = await enviarVideos(files.value)
  exibirMensagem(resultado.message, resultado.success ? 'success' : 'error')
  limparInputArquivo()
  isSending.value = false
}
</script>

<template>
  <div class="enviar-videos-container">
    <h1>Enviar vídeos</h1>
    <p class="descricao">
      Ao enviar um ou mais vídeos, eles serão processados para extração dos frames. Um arquivo compactado com as imagens
      será gerado e poderá ser baixado na página
      <RouterLink to="/listar-videos" class="link-acao">Listar arquivos</RouterLink>
      .
    </p>
    <form class="upload-form" @submit.prevent="handleSubmit">
      <input
          type="file"
          accept="video/*"
          multiple
          @change="handleFileChange"
          :disabled="isSending"
      />
      <button type="submit" :disabled="isSending">
        <span v-if="isSending">Enviando...</span>
        <span v-else>Enviar</span>
      </button>
    </form>
    <div v-if="message" :class="['mensagem', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.enviar-videos-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: none;
}

h1 {
  color: #fff;
  margin-bottom: 1rem;
  text-align: center;
}

.descricao {
  color: var(--color-text);
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1rem;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  align-items: center;
}

.upload-form input[type="file"] {
  color: #fff;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem;
  width: 100%;
  max-width: 320px;
}

.upload-form button {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.upload-form button:disabled {
  background: #444;
  cursor: not-allowed;
}

.mensagem {
  margin-top: 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  width: 100%;
  max-width: 320px;
}

.mensagem.success {
  background: #1e4620;
  color: #4caf50;
  border: 1px solid #4caf50;
}

.mensagem.error {
  background: #4a2328;
  color: #ff5252;
  border: 1px solid #ff5252;
}

.link-acao {
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;
}

.link-acao:hover {
  text-decoration: none;
}
</style>