<script setup>
import {onMounted, onUnmounted} from 'vue'
import {useNotification} from '@/services/notificationService'

const {notification, connect, disconnect} = useNotification()

onMounted(() => {
  connect()
})

onUnmounted(() => {
  disconnect()
})
</script>

<template>
  <Transition name="slide-fade">
    <div v-if="notification" class="notification">
      {{ notification.message }}
    </div>
  </Transition>
</template>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  max-width: 400px;
  padding: 16px 20px;
  background-color: #1976d2;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  font-size: 1rem;
  line-height: 1.4;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

@media (max-width: 767px) {
  .notification {
    min-width: auto;
    max-width: calc(100% - 40px);
    top: 10px;
    right: 10px;
    padding: 12px 16px;
    font-size: 0.9rem;
  }
}
</style>