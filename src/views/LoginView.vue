<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/services/authService'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const { login, isAuthenticated } = useAuth()
const router = useRouter()

const handleLogin = () => {
  if (login(username.value, password.value)) {
    if (isAuthenticated()) {
      router.push('/')
    }
  } else {
    errorMessage.value = 'Usuário ou senha inválidos'
  }
}
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username">Usuário</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Entrar</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  padding: 2rem;
  background: none;
}

h1 {
  color: #fff;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.form-group input {
  color: #fff;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem;
  width: 100%;
}

button {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #1565c0;
}

.error-message {
  color: #ff5252;
  margin-top: 1rem;
  text-align: center;
}
</style>
