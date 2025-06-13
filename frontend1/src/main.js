import './assets/main.css'
import './assets/styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia' // Importa Pinia
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia() // Crea instancia de Pinia

app.use(pinia) // Usa Pinia antes del router
app.use(router)

app.mount('#app')