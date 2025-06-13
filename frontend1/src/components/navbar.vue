<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const productos = ref([]);
const imageError = ref({});
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/productos");
    const data = await res.json();
    productos.value = data;
  } catch (error) {
    console.error("Error al cargar los productos", error);
  }
});

const handleImageError = (productoId) => {
  imageError.value[productoId] = true;
};

const addToCart = async (productoId) => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  try {
    await cartStore.addToCart(productoId);
    // Opcional: Mostrar notificación de éxito
    alert('Producto agregado al carrito');
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    alert('Error al agregar el producto al carrito');
  }
};
</script>

<template>
  <!-- Header mejorado -->
  <header class="bg-white sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-pink-600">Camille</h1>
        </div>
        <nav class="hidden md:flex space-x-8">
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-purple-600 border-b-2 border-purple-600"
          >
            Inicio
          </router-link>
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-purple-600 border-b-2 border-purple-600"
          >
            Productos
          </router-link>
          <router-link 
            to="/carrito" 
            class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-purple-600 border-b-2 border-purple-600"
          >
            Carrito
          </router-link>
          <router-link 
            to="/perfil" 
            class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-purple-600 border-b-2 border-purple-600"
          >
            Mi Perfil
          </router-link>
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-purple-600 border-b-2 border-purple-600"
          >
            Contacto
          </router-link>
        </nav>
      </div>
    </div>
  </header>
  
  <section class="relative bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white py-24">
    <div class="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1887&auto=format&fit=crop')] bg-cover bg-center"></div>
    <div class="container mx-auto px-4 relative z-10">
      <div class="max-w-2xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">Moda con Estilo y Elegancia</h1>
        <p class="text-xl mb-8 opacity-90">Descubre nuestra exclusiva colección primavera-verano 2025</p>
        <router-link 
          to="/productos"
          class="inline-block bg-white text-purple-600 hover:bg-gray-50 font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Ver Colección
        </router-link>
      </div>
    </div>
  </section>

  <main class="py-12 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Nuestros Productos Destacados</h2>
        <div class="w-20 h-1 bg-purple-500 mx-auto"></div>
      </div>

       <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    <div
      v-for="producto in productos"
      :key="producto._id"
      class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
    >
      <!-- ... (imagen y detalles del producto) ... -->
      <div class="p-5">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ producto.nombre }}</h3>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ producto.descripcion }}</p>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold text-purple-600">${{ producto.precio.toFixed(2) }}</span>
          <button 
            @click="addToCart(producto._id)"
            class="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  </div>
    </div>
  </main>

  <footer class="bg-gray-900 text-white pt-12 pb-6">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">Camille</h3>
          <p class="text-gray-400">Tu tienda de moda favorita con las últimas tendencias.</p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Enlaces</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-white transition">Inicio</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition">Productos</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition">Novedades</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Contacto</h4>
          <address class="text-gray-400 not-italic">
            <p>Av. Moda 123</p>
            <p>Barcelona, España</p>
            <p class="mt-2">info@camille.com</p>
            <p>+34 123 456 789</p>
          </address>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Newsletter</h4>
          <p class="text-gray-400 mb-4">Suscríbete para recibir nuestras ofertas.</p>
          <div class="flex">
            <input type="email" placeholder="Tu email" class="px-4 py-2 rounded-l-md w-full text-gray-900">
            <button class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-md transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 text-sm">&copy; 2025 Camille. Todos los derechos reservados.</p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a href="#" class="text-gray-400 hover:text-white transition">
            <span class="sr-only">Facebook</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
            </svg>
          </a>
          <a href="#" class="text-gray-400 hover:text-white transition">
            <span class="sr-only">Instagram</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748 1.857.344.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>