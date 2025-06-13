<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import navbar from './components/navbar.vue'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (!authStore.isAuthenticated && router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }
})
</script>

<template>
  <navbar v-if="authStore.isAuthenticated" />
  <router-view />
</template>