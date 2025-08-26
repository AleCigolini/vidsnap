<template>
  <div class="loader-container">
    <div class="loader"></div>
    <span class="loader-text">Carregando...</span>
  </div>
</template>

<style scoped>
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 180px;
  margin-top: 2rem;
}
.loader {
  border: 4px solid #232a36;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.loader-text {
  color: #bbb;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}
@media (max-width: 600px) {
  .loader {
    width: 36px;
    height: 36px;
  }
}
</style>

