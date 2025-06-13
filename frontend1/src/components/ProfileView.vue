<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const error = ref(null)

const userData = computed(() => ({
    nombre: authStore.user?.nombre || 'No especificado',
    email: authStore.user?.email || 'No especificado',
    miembroDesde: authStore.user?.createdAt 
        ? authStore.user.createdAt.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'No disponible'
}))

onMounted(async () => {
  try {
    loading.value = true
    await authStore.loadUserData()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="bg-white sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-pink-600">Camille</h1>
          </div>
          <nav class="hidden md:flex space-x-8">
            <router-link 
              to="/perfil" 
              class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-purple-600 border-b-2 border-purple-600"
            >
              Mi Perfil
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Encabezado del perfil -->
        <div class="bg-gradient-to-r from-purple-600 to-fuchsia-500 p-6 text-center">
          <h2 class="text-2xl font-bold text-white">Mi Perfil</h2>
          <p class="text-purple-100 mt-1">Bienvenido, {{ userData.nombre }}</p>
        </div>

        <!-- Contenido -->
        <div class="p-6 sm:p-8">
          <div v-if="authStore.isLoading || loading" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>

          <div v-else-if="error" class="text-red-500 text-center py-6">
            {{ error }}
            <button 
              @click="router.push('/login')"
              class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              Volver a iniciar sesión
            </button>
          </div>

          <div v-else class="grid md:grid-cols-3 gap-8">
            <!-- Información del usuario -->
            <div class="md:col-span-2 space-y-6">
              <h3 class="text-lg font-medium text-gray-900">Información Personal</h3>
              
              <div class="bg-gray-50 p-6 rounded-lg">
                <div class="space-y-4">
                  <div class="flex items-center">
                    <span class="w-32 text-gray-600">Nombre:</span>
                    <span class="font-medium">{{ userData.nombre }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-32 text-gray-600">Email:</span>
                    <span class="font-medium">{{ userData.email }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-32 text-gray-600">Miembro desde:</span>
                    <span class="font-medium">
                      {{ userData.miembroDesde }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="space-y-6">
              <h3 class="text-lg font-medium text-gray-900">Acciones</h3>
              <div class="bg-gray-50 p-6 rounded-lg space-y-4">
                <button
                  @click="handleLogout"
                  class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>