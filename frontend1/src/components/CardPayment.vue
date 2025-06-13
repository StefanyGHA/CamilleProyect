<template>
  <div class="payment-container">
    <div v-if="isLoading && step === 1" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando datos del pago...</p>
    </div>

    <div v-else-if="step === 1" class="payment-step">
      <h2>Resumen de tu compra</h2>
      <div class="cart-summary">
        <div v-for="item in orderData?.items || []" :key="item.producto._id" class="cart-item">
          <img :src="item.producto.imagen" :alt="item.producto.nombre" class="product-image">
          <div class="product-info">
            <h3>{{ item.producto.nombre }}</h3>
            <p>{{ item.cantidad }} x ${{ item.producto.precio.toFixed(2) }}</p>
          </div>
          <p class="product-total">${{ (item.producto.precio * item.cantidad).toFixed(2) }}</p>
        </div>
      </div>
      <div class="total-section">
        <p>Total: <span>${{ orderData?.total?.toFixed(2) || '0.00' }}</span></p>
      </div>
      <div class="action-buttons">
        <button @click="cancelPayment" class="btn btn-secondary">Cancelar</button>
        <button @click="step = 2" class="btn btn-primary">Continuar al pago</button>
      </div>
    </div>

    <div v-if="step === 2" class="payment-step">
      <h2>Método de pago</h2>
      
      <div class="card-form">
        <h3>Datos de la tarjeta</h3>
        <div class="form-group">
          <label>Número de tarjeta</label>
          <input 
            v-model="cardData.numero" 
            type="text" 
            placeholder="1234 5678 9012 3456"
            @input="formatCardNumber"
            maxlength="19"
          >
        </div>
        
        <div class="form-group">
          <label>Nombre en la tarjeta</label>
          <input 
            v-model="cardData.nombre" 
            type="text" 
            placeholder="Como aparece en la tarjeta"
          >
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Fecha de expiración</label>
            <input 
              v-model="cardData.expiracion" 
              type="text" 
              placeholder="MM/AA" 
              @input="formatExpiry"
              maxlength="5"
            >
          </div>
          <div class="form-group">
            <label>CVV</label>
            <input 
              v-model="cardData.cvv" 
              type="password" 
              placeholder="123" 
              maxlength="4"
            >
          </div>
        </div>

        <div class="form-group">
          <label>Dirección de envío</label>
          <textarea 
            v-model="direccionEnvio" 
            placeholder="Ingresa tu dirección completa"
            rows="3"
          ></textarea>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="step = 1" class="btn btn-secondary">Volver</button>
        <button 
          @click="step = 3" 
          class="btn btn-primary"
          :disabled="!isCardFormValid"
        >
          Continuar
        </button>
      </div>
    </div>
    <div v-if="step === 3" class="payment-step">
      <h2>Confirma tu pago</h2>
      <div class="payment-confirmation">
        <div class="confirmation-section">
          <h4>Resumen de la compra</h4>
          <p>{{ orderData?.items?.length || 0 }} productos</p>
          <p><strong>Total: ${{ orderData?.total?.toFixed(2) || '0.00' }}</strong></p>
        </div>
        
        <div class="confirmation-section">
          <h4>Método de pago</h4>
          <p>**** **** **** {{ cardData.numero.slice(-4) }}</p>
          <p>{{ cardData.nombre }}</p>
        </div>

        <div class="confirmation-section">
          <h4>Dirección de envío</h4>
          <p>{{ direccionEnvio || orderData?.usuario?.direccion || 'No especificada' }}</p>
        </div>
      </div>
      
      <div class="action-buttons">
        <button @click="step = 2" class="btn btn-secondary">Cambiar datos</button>
        <button 
          @click="processPayment" 
          class="btn btn-primary"
          :disabled="isProcessing"
        >
          {{ isProcessing ? 'Procesando...' : 'Pagar ahora' }}
        </button>
      </div>
    </div>
    <div v-if="step === 4" class="payment-step">
      <div v-if="paymentStatus === 'processing'" class="processing-payment">
        <div class="spinner"></div>
        <p>Procesando tu pago...</p>
        <p class="processing-note">No cierres esta ventana</p>
      </div>
      
      <div v-if="paymentStatus === 'success'" class="payment-success">
        <div class="success-icon">✅</div>
        <h2>¡Pago aprobado!</h2>
        <div class="receipt">
          <p><strong>Referencia:</strong> {{ paymentResult.referencia }}</p>
          <p><strong>Fecha:</strong> {{ new Date().toLocaleDateString() }}</p>
          <p><strong>Total:</strong> ${{ paymentResult.total?.toFixed(2) }}</p>
          <p><strong>Orden:</strong> #{{ paymentResult.ordenId }}</p>
        </div>
        <div class="action-buttons">
          <button @click="finishPayment" class="btn btn-primary">Continuar comprando</button>
        </div>
      </div>
      
      <div v-if="paymentStatus === 'error'" class="payment-error">
        <div class="error-icon">❌</div>
        <h2>Pago rechazado</h2>
        <p class="error-message">{{ errorMessage }}</p>
        <div class="action-buttons">
          <button @click="retryPayment" class="btn btn-primary">Reintentar</button>
          <button @click="step = 2" class="btn btn-secondary">Cambiar método</button>
        </div>
      </div>
    </div>

    <div v-if="error && !isLoading" class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Error al cargar</h2>
      <p>{{ error }}</p>
      <button @click="cancelPayment" class="btn btn-secondary">Volver al carrito</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()
const step = ref(1)
const paymentStatus = ref(null)
const orderData = ref(null)
const paymentResult = ref(null)
const errorMessage = ref('')
const error = ref('')
const isLoading = ref(false)
const isProcessing = ref(false)


const cardData = ref({
  numero: '',
  nombre: '',
  expiracion: '',
  cvv: ''
})

const direccionEnvio = ref('')

const isCardFormValid = computed(() => {
  return cardData.value.numero.length >= 13 &&
         cardData.value.nombre.length >= 3 &&
         cardData.value.expiracion.length === 5 &&
         cardData.value.cvv.length >= 3
})

const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
  cardData.value.numero = value
}

const formatExpiry = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  cardData.value.expiracion = value
}

const fetchPaymentData = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response = await authStore.authenticatedFetch('http://localhost:3000/api/pago/datos')
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al cargar datos de pago')
    }
    
    orderData.value = data
    direccionEnvio.value = data.usuario?.direccion || ''
    
  } catch (err) {
    error.value = err.message
    console.error('Error al cargar datos de pago:', err)
  } finally {
    isLoading.value = false
  }
}

const processPayment = async () => {
  try {
    isProcessing.value = true
    paymentStatus.value = 'processing'
    step.value = 4
    
    const paymentData = {
      carritoId: orderData.value.carritoId,
      datosTarjeta: {
        numero: cardData.value.numero.replace(/\s/g, ''),
        nombre: cardData.value.nombre,
        expiracion: cardData.value.expiracion,
        cvv: cardData.value.cvv
      },
      direccionEnvio: direccionEnvio.value
    }

    const response = await authStore.authenticatedFetch('http://localhost:3000/api/pago/procesar', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al procesar el pago')
    }
    
    paymentStatus.value = 'success'
    paymentResult.value = data
    
    await cartStore.fetchCart()
    
  } catch (err) {
    paymentStatus.value = 'error'
    errorMessage.value = err.message
    console.error('Error al procesar pago:', err)
  } finally {
    isProcessing.value = false
  }
}

const cancelPayment = () => {
  router.push('/cart')
}

const retryPayment = () => {
  paymentStatus.value = null
  errorMessage.value = ''
  step.value = 3
}

const finishPayment = () => {
  router.push('/')
}

onMounted(async () => {
  if (!cartStore.items.length) {
    await cartStore.fetchCart()
  }
  
  if (!cartStore.items.length) {
    router.push('/cart')
    return
  }
  
  await fetchPaymentData()
})
</script>

<style scoped>
.payment-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.payment-step {
  animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.cart-summary {
  margin: 1rem 0;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.product-total {
  font-weight: bold;
  color: #2c5aa0;
}

.total-section {
  text-align: right;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin: 1rem 0;
}

.total-section span {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c5aa0;
}

.card-form {
  margin: 1rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-primary {
  background: #2c5aa0;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1e3f73;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.confirmation-section {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.confirmation-section h4 {
  margin: 0 0 0.5rem 0;
  color: #2c5aa0;
}

.processing-payment {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2c5aa0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.payment-success,
.payment-error {
  text-align: center;
  padding: 2rem;
}

.success-icon,
.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.receipt {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  text-align: left;
}

.error-message {
  color: #dc3545;
  margin: 1rem 0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
}

.processing-note {
  font-size: 0.9rem;
  color: #666;
}
</style>