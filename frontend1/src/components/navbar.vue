<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const productos = ref([]);
const carrito = ref([]);
const router = useRouter();

// Simulación: cambia esto por tu lógica real de autenticación
const isLoggedIn = ref(true);

// Cargar productos desde backend
onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/productos");
    const data = await res.json();
    productos.value = data;
  } catch (error) {
    console.error("Error al cargar los productos", error);
  }

  // Cargar carrito desde localStorage
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito.value = JSON.parse(carritoGuardado);
  }
});

// Función: Agregar al carrito
function agregarAlCarrito(producto) {
  if (!isLoggedIn.value) {
    router.push("/login");
    return;
  }

  const existente = carrito.value.find(p => p._id === producto._id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.value.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito.value));
  console.log("Agregado al carrito:", producto.nombre);
}

// Función: Comprar ahora
function comprarAhora(producto) {
  if (!isLoggedIn.value) {
    router.push("/login");
    return;
  }

  // Guardar solo este producto en carrito temporal
  localStorage.setItem('carrito', JSON.stringify([{ ...producto, cantidad: 1 }]));
  router.push("/checkout");
}
</script>



<template>
<!-- Banner-->
 <header class="bg-white-900 text-pink-600 shadow-md">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold tracking-wide">Camille</h1>
      <nav class="space-x-6">
        <a href="#" class="hover:text-purple-700 transition">Inicio</a>
        <a href="#" class="hover:text-purple-700 transition">Productos</a>
        <a href="#" class="hover:text-purple-700 transition">Contacto</a>
      </nav>
    </div>
  </header>
 <div>

    <!--Banner-->
    <section class="bg-gradient-to-r from-fuchsia-400 to-violet-500 text-white py-20 text-center">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Moda con Estilo</h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">Descubre nuestra coleccion</p>
        <router-link to="/productos"
          class="inline-block bg-white text-purple-600 hover:bg-gray-100 font-medium px-8 py-3 rounded-lg transition-colors duration-300">
          Ver Productos
        </router-link>
      </div>
    </section>
  

<!-- Productos-->
  <div class="p-2">
  <h2 class="text-2xl text-center font-bold mb-4 text-purple-800">Nuestros productos</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <div
      v-for="producto in productos"
      :key="producto._id"
      class="bg-white rounded-2xl shadow-lg p-2 hover:scale-105 transition-transform"
    >
      <img
        :src="`http://localhost:3000/uploads/${producto.imagen2}`"
        alt=""
        class="w-full h-64 object-cover rounded-2xl"
      />
      <h3 class="text-lg font-semibold text-gray-800 mt-2">
        {{ producto.nombre }}
      </h3>
      <p class="text-gray-600 text-sm">{{ producto.descripcion }}</p>
      <p class="text-gray-800 font-semibold mt-1"> {{ producto.precio }}</p>
      <p class="text-sm text-gray-500">Stock {{ producto.stock }}</p>

      <div class="mt-3 flex justify-between gap-2">
        <button @click="agregarAlCarrito(producto)"
          class="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition w-1/2">
          Agregar
        </button>
        <button @click="comprarAhora(producto)"
          class="bg-pink-500 text-white px-3 py-2 rounded-lg hover:bg-pink-600 transition w-1/2">
          Comprar
        </button>
      </div>
    </div>
  </div>
</div>
  </div>




  <footer class="bg-purple-800 text-white py-6">
    <div class="container mx-auto text-center">
      <p>&copy; 2023 Camille. Todos los derechos reservados.</p>
    </div>  
 </footer>
</template>
