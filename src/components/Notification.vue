<script setup lang="ts">
import {computed, onMounted, onUnmounted, watch} from 'vue'
import {useNotification} from '@/services/notificationService'
import {useRoute, useRouter} from 'vue-router'

const {notification, connect, disconnect} = useNotification()
const router = useRouter()
const route = useRoute()

const notificationClass = computed(() => {
  if (!notification.value) return ''
  return notification.value.eventPayload?.status === 'ERROR'
      ? 'notification-error'
      : ''
})

const notificationMessage = computed(() => {
  if (!notification.value) return ''
  return notification.value.eventPayload?.content || notification.value.message
})

watch(notification, () => {
  if (route.path === '/listar-videos') {
    router.replace({path: '/listar-videos', query: {...route.query, reload: Date.now()}});
  } else {
    router.push({path: '/listar-videos'});
  }
})

onMounted(() => {
  connect()
})

onUnmounted(() => {
  disconnect()
})
</script>

<template>
  <Transition name="slide-fade">
    <div
        v-if="notification"
        :class="['notification', notificationClass]"
    >
      {{ notificationMessage }}
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
  background-color: #19d21c;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  font-size: 1rem;
  line-height: 1.4;
}

.notification-error {
  background-color: #d32f2f !important;
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