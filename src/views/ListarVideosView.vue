<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {baixarVideoPorId, listarArquivos} from '@/services/videoService'
import Loader from '@/components/Loader.vue'
import {VideoList} from "@/types/VideoList";

const arquivos = ref<VideoList[]>([])
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  arquivos.value = await listarArquivos()
  isLoading.value = false
})

async function downloadArquivo(id: number) {
  try {
    const urlArquivo = await baixarVideoPorId(id)
    if (typeof urlArquivo === 'string') {
      window.open(urlArquivo, '_blank')
    } else {
      alert('Erro ao obter a URL do arquivo.')
    }
  } catch (e) {
    alert('Erro ao baixar o arquivo.')
  }
}

</script>

<template>
  <div class="listar-videos-container">
    <h1>Listar arquivos compactados</h1>
    <Loader v-if="isLoading"/>
    <template v-else>
      <template v-if="Array.isArray(arquivos) && arquivos.length > 0">
        <div class="tabela-wrapper">
          <table class="tabela-arquivos">
            <thead>
            <tr>
              <th class="col-nome">Arquivo</th>
              <th class="col-tamanho">Tamanho (MB)</th>
              <th class="col-status">Status</th>
              <th class="col-acoes">Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(arquivo, idx) in arquivos" :key="arquivo.id">
              <td class="col-nome" :title="arquivo.originalFileName">
                {{ arquivo.originalFileName }}
              </td>
              <td class="col-tamanho">
                {{ arquivo.fileSize.toFixed(2) }}
              </td>
              <td class="col-status" :title="arquivo.status">
                  <span
                      class="status"
                      :class="arquivo.status === 'PROCESSED' ? 'finalizado' : 'processando'"
                  >
                    <span class="status-text desktop">{{ arquivo.status }}</span>
                    <span class="status-icon mobile">
                      <svg v-if="arquivo.status === 'PROCESSED'" width="20" height="20" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="9" :fill="'#1e4620'" stroke="#4caf50" stroke-width="2"/>
                        <path d="M6 10.5l2.5 2.5 5-5" stroke="#4caf50" stroke-width="2" fill="none"
                              stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" :fill="'#4a2328'" stroke="#ffb300" stroke-width="2"/>
                        <circle cx="10" cy="10" r="4" fill="#ffb300"/>
                      </svg>
                    </span>
                  </span>
              </td>
              <td class="col-acoes">
                <button
                    class="btn-download"
                    :disabled="arquivo.status !== 'PROCESSED'"
                    @click="downloadArquivo(arquivo.id)"
                >
                  <span class="btn-download-text">Download</span>
                  <svg class="btn-download-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                       viewBox="0 0 24 24" fill="none" stroke="#1976d2" stroke-width="2" stroke-linecap="round"
                       stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <div class="empty-list-message">
          <span class="empty-icon" aria-hidden="true">📦</span>
          <p>Nenhum arquivo compactado disponível ainda.<br>
            <RouterLink to="/enviar-videos" class="link-acao">Envie vídeos</RouterLink>
            para começar!
          </p>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.listar-videos-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: none;
}

h1 {
  color: #fff;
  margin-bottom: 2rem;
  text-align: center;
}

.tabela-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tabela-arquivos {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  background: none;
  color: #fff;
  font-size: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.6),
  0 4px 8px -2px rgba(0, 20, 40, 0.7),
  0 8px 24px -4px rgba(0, 120, 255, 0.25),
  0 0 0 1px rgba(90, 150, 255, 0.18),
  inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  position: relative;
}

.tabela-arquivos::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 8px;
  background: radial-gradient(circle at 70% 30%, rgba(0, 140, 255, 0.12), transparent 60%),
  radial-gradient(circle at 20% 80%, rgba(140, 0, 255, 0.10), transparent 65%);
  mix-blend-mode: screen;
  opacity: .55;
}

.tabela-arquivos th, .tabela-arquivos td {
  padding: 1rem 0.75rem;
  text-align: left;
  word-break: break-word;
}

.tabela-arquivos thead {
  background: #181c24;
}

.tabela-arquivos tbody tr {
  transition: background 0.2s;
}

.tabela-arquivos tbody tr:hover {
  background: #232a36;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.status.finalizado {
  background: none;
  color: #4caf50;
}

.status.processando {
  background: none;
  color: #ffb300;
}

.status-text.desktop {
  display: inline;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  max-width: none;
  word-break: break-word;
}

.status-icon.mobile {
  display: none;
  cursor: default;
  outline: none;
}

.col-nome {
  /* remove forced ellipsis on larger screens */
  max-width: none;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  word-break: break-word;
}

.btn-download {
  background: rgba(25, 118, 210, 0.1);
  color: #42a5f5;
  border: 1px solid #1976d2;
  border-radius: 6px;
  padding: 0.4rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.btn-download:hover:not(:disabled) {
  background: rgba(25, 118, 210, 0.2);
  border-color: #42a5f5;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

.btn-download:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}

.btn-download:disabled {
  background: rgba(187, 187, 187, 0.1);
  border-color: #555;
  color: #666;
  cursor: not-allowed;
}

.btn-download-icon {
  display: none;
  stroke: currentColor;
}

.btn-download-text {
  display: inline;
}

@media (max-width: 768px) {
  .btn-download {
    padding: 0.4rem 0.6rem;
    min-width: 36px;
    justify-content: center;
  }

  .btn-download-text {
    display: none;
  }

  .btn-download-icon {
    display: inline;
    width: 22px;
    height: 22px;
    vertical-align: middle;
  }

  .tabela-arquivos {
    min-width: auto;
  }

  .col-tamanho {
    display: none;
  }

  .col-nome {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60px;
  }

  .tabela-wrapper {
    overflow-x: hidden;
  }

  .status-text.desktop {
    display: none;
  }

  .tabela-arquivos th, .tabela-arquivos td {
    padding: 0.75rem 0.5rem;
  }

  .col-status {
    display: none;
  }
}

@media (max-width: 900px) {
  .tabela-arquivos {
    min-width: 520px;
    font-size: 0.97rem;
  }
}

@media (max-width: 600px) {
  .listar-videos-container {
    padding: 1rem 0.2rem;
  }

  .tabela-wrapper {
    margin: 0 -8px;
  }

  .tabela-arquivos {
    min-width: 420px;
    font-size: 0.93rem;
  }

  .tabela-arquivos th, .tabela-arquivos td {
    padding: 0.6rem 0.3rem;
  }

  .empty-list-message {
    padding: 1.5rem 0.5rem;
    font-size: 1rem;
  }
}

@media (min-width: 1200px) {
  .listar-videos-container {
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
</style>