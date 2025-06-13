<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true
  
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard') // Redirigir después de login exitoso
  } catch (err) {
    errorMessage.value = err.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
    <!-- Header -->
    <header class="bg-white sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-purple-600">MiApp</h1>
          </div>
          <nav class="hidden md:flex space-x-8">
            <router-link 
              to="/" 
              class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-purple-600 border-b-2 border-purple-600"
            >
              Inicio
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-xl shadow-xl overflow-hidden">
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-purple-600 to-fuchsia-500 p-6 text-center">
            <h2 class="text-2xl font-bold text-white">Iniciar Sesión</h2>
            <p class="text-purple-100 mt-1">Accede a tu cuenta</p>
          </div>

          <!-- Form -->
          <div class="p-6 sm:p-8">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="tu@email.com"
                >
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="••••••••"
                >
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  >
                  <label for="remember-me" class="ml-2 block text-sm text-gray-700">Recordarme</label>
                </div>

                <router-link 
                  to="/forgot-password" 
                  class="text-sm text-purple-600 hover:text-purple-500"
                >
                  ¿Olvidaste tu contraseña?
                </router-link>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="text-red-500 text-sm text-center">
                {{ errorMessage }}
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">Iniciar Sesión</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              </button>
            </form>
          </div>

          <!-- Card Footer -->
          <div class="bg-gray-50 px-6 py-4 text-center">
            <p class="text-sm text-gray-600">
              ¿No tienes una cuenta?
              <router-link 
                to="/register" 
                class="font-medium text-purple-600 hover:text-purple-500 ml-1"
              >
                Regístrate
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-400 text-sm">&copy; 2024 MiApp. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>