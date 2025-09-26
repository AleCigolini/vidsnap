<script setup>
import {RouterLink, RouterView, useRouter} from 'vue-router'
import {useAuth} from '@/services/authService'
import Notification from "@/components/Notification.vue";
import {computed} from "vue";

const {isAuthenticated, logout} = useAuth()
const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/login')
}

const isLoggedIn = computed(() => isAuthenticated())
</script>

<template>
  <div class="app-container">
    <Notification v-if="isLoggedIn"/>
    <nav v-if="isLoggedIn" class="nav-bar">
      <RouterLink to="/" class="nav-link">Tela inicial</RouterLink>
      <RouterLink to="/enviar-videos" class="nav-link">Enviar vídeos</RouterLink>
      <RouterLink to="/listar-videos" class="nav-link">Listar arquivos</RouterLink>
      <a href="#" @click.prevent="handleLogout" class="nav-link">Sair</a>
    </nav>
    <main class="main-content" :class="{ 'full': !isLoggedIn }">
      <RouterView/>
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
  position: relative;
  background: inherit;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.nav-link {
  font-size: 1.2rem;
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  transition: background 0.2s, color 0.2s;
  outline: none;
}

.nav-link.router-link-active {
  background: #1976d2;
  color: #fff;
}

.nav-link:hover,
.nav-link:focus {
  background: rgba(25, 118, 210, 0.25);
  color: #fff;
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

/* Adicionado para o botão Sair */
.nav-bar a.nav-link {
  cursor: pointer;
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

.main-content.full {
  height: 100vh;
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
