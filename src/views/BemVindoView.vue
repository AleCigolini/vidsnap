<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="welcome-container">
    <h1>Bem-vindo ao VidSnap!</h1>
    <p class="descricao">
      Este é um app para processar vídeos e extrair imagens dos frames.<br>
      Para começar, escolha uma das opções abaixo:
    </p>
    <div class="botoes">
      <RouterLink to="/enviar-videos" class="link-acao">Enviar Vídeos</RouterLink>
      <RouterLink to="/listar-videos" class="link-acao">Listar Arquivos</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.botoes {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  justify-content: center;
  width: 100%;
}

.link-acao {
  color: #1976d2;
  background: rgba(25, 118, 210, 0.15);
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
  border: 1px solid #1976d2;
}

.link-acao:hover {
  background: #1976d2;
  color: #fff;
}
</style>

