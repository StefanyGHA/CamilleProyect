<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const quantityInputs = ref({})

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  await cartStore.fetchCart()
})

const updateItemQuantity = async (productId) => {
  const newQuantity = parseInt(quantityInputs.value[productId]) || 1
  await cartStore.updateQuantity(productId, newQuantity)
}

const proceedToCheckout = () => {
  router.push('/checkout')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Tu Carrito de Compras</h1>
      
      <div v-if="cartStore.loading" class="flex justify-center py-12">
        <svg class="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="cartStore.error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ cartStore.error }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        <div v-if="cartStore.items.length === 0" class="bg-white rounded-lg shadow p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 class="mt-4 text-lg font-medium text-gray-900">Tu carrito está vacío</h2>
          <p class="mt-1 text-gray-500">Agrega algunos productos para comenzar</p>
          <router-link to="/productos" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Ver productos
          </router-link>
        </div>

        <div v-else class="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <!-- Lista de productos -->
          <div class="lg:col-span-8">
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul class="divide-y divide-gray-200">
                <li v-for="item in cartStore.items" :key="item.producto._id" class="p-6">
                  <div class="flex flex-col sm:flex-row">
                    <div class="flex-shrink-0">
                      <img :src="item.producto.imagen || 'https://via.placeholder.com/150'" :alt="item.producto.nombre" class="w-24 h-24 rounded-md object-cover">
                    </div>
                    
                    <div class="mt-4 sm:mt-0 sm:ml-6 flex-grow">
                      <div class="flex justify-between">
                        <h3 class="text-lg font-medium text-gray-900">
                          {{ item.producto.nombre }}
                        </h3>
                        <p class="text-lg font-medium text-gray-900 ml-4">
                          ${{ (item.producto.precio * item.cantidad).toLocaleString() }}
                        </p>
                      </div>
                      
                      <p class="mt-1 text-sm text-gray-500">
                        {{ item.producto.descripcion }}
                      </p>
                      
                      <div class="mt-4 flex items-center">
                        <input 
                          v-model.number="quantityInputs[item.producto._id]" 
                          
                          type="number" 
                          min="1" 
                          class="w-16 border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                        >
                        <button 
                          @click="updateItemQuantity(item.producto._id)"
                          class="ml-2 text-sm font-medium text-purple-600 hover:text-purple-500"
                        >
                          Actualizar
                        </button>
                        
                        <button 
                          @click="cartStore.removeFromCart(item.producto._id)"
                          class="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Resumen del pedido -->
          <div class="lg:col-span-4 mt-8 lg:mt-0">
            <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h2>
              
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">${{ cartStore.totalPrice().toLocaleString() }}</span>
              </div>
              
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Envío</span>
                <span class="font-medium">$0</span>
              </div>
              
              <div class="flex justify-between py-4">
                <span class="text-lg font-medium text-gray-900">Total</span>
                <span class="text-lg font-bold">${{ cartStore.totalPrice().toLocaleString() }}</span>
              </div>
              
              <button 
                @click="proceedToCheckout"
                class="w-full bg-purple-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Proceder al pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>