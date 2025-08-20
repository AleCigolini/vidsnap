<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <nav class="nav-bar">
      <RouterLink to="/enviar-videos" class="nav-link">Enviar vídeos</RouterLink>
      <RouterLink to="/listar-videos" class="nav-link">Listar arquivos</RouterLink>
    </nav>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.nav-bar {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 25vh;
  min-height: 64px;
  max-height: 40vh;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  position: relative;
  background: inherit;
}

.nav-link {
  font-size: 1.2rem;
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  transition: background 0.2s, color 0.2s;
}

.nav-link.router-link-active {
  background: #1976d2;
  color: #fff;
}

.nav-link:hover {
  background: darkblue;
}

.main-content {
  flex: 1 1 0;
  width: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 0;
  box-sizing: border-box;
}

@media (max-width: 767px) {
  .nav-bar {
    flex-direction: row;
    gap: 0.5rem;
    height: 25vh;
    min-height: 56px;
    max-height: 40vh;
    justify-content: center;
    padding: 0 0.5rem;
  }
  .main-content {
    padding: 0;
  }
}
</style>
