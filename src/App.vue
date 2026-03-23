<script setup>
import { ref, watch } from 'vue'
import { useTiendaStore } from './stores/useTiendaStore'
import { useRoute, useRouter } from 'vue-router'

const tienda = useTiendaStore()
const mostrarCarrito = ref(false)

const route = useRoute()
const router = useRouter()

const esFavorito = (id) => {
  return tienda.favoritos.some(f => f.id === id)
}

// Detectar categoría desde URL
watch(
  () => route.params.categoria,
  (categoria) => {
    if (categoria) {
      tienda.categoriaFiltro = categoria
    } else {
      tienda.categoriaFiltro = 'todas'
    }
  },
  { immediate: true }
)

// Cambiar categoría y actualizar URL
const cambiarCategoria = (categoria) => {
  tienda.categoriaFiltro = categoria

  if (categoria === 'todas') {
    router.push('/')
  } else {
    router.push(`/categoria/${categoria}`)
  }
}
</script>

<template>
  <div class="app-container">
    <header class="header-principal">
      <div class="top-bar">
        <span>❤️ Favoritos: {{ tienda.favoritos.length }}</span>
        <button class="btn-abrir-carrito" @click="mostrarCarrito = true">
          🛒 Carrito ({{ tienda.cantidadItemsCarrito }})
        </button>
      </div>

      <div class="logo-container">
        <h1>TIENDA MARGARITA</h1>
        <p class="subtitulo">Alcohol • Snacks • Panadería</p>
      </div>
    </header>

    <div class="contenido-principal">
      <section class="panel-herramientas">

        <!-- BUSQUEDA -->
        <div class="busqueda-orden">
          <div class="input-icono">
            <span>🔍</span>
            <input 
              type="text" 
              v-model="tienda.busqueda" 
              placeholder="¿Qué estás buscando hoy?" 
              class="buscador"
            />
          </div>

          <select v-model="tienda.orden" class="selector-orden">
            <option value="defecto">Ordenar por...</option>
            <option value="menor">Precio: Menor a Mayor</option>
            <option value="mayor">Precio: Mayor a Menor</option>
          </select>
        </div>

        <!-- FILTROS CON ROUTING -->
        <div class="filtros">
          <button :class="{ activo: tienda.categoriaFiltro === 'todas' }" @click="cambiarCategoria('todas')">Todas</button>

          <button :class="{ activo: tienda.categoriaFiltro === 'alcohol' }" @click="cambiarCategoria('alcohol')">
            🥂 Alcohol
          </button>

          <button :class="{ activo: tienda.categoriaFiltro === 'snacks' }" @click="cambiarCategoria('snacks')">
            🍟 Snacks
          </button>

          <button :class="{ activo: tienda.categoriaFiltro === 'panaderia' }" @click="cambiarCategoria('panaderia')">
            🥐 Panadería
          </button>
        </div>
      </section>

      <!-- PRODUCTOS -->
      <main class="grid-productos">
        <div 
          v-if="tienda.productosFiltrados.length > 0"
          v-for="producto in tienda.productosFiltrados"
          :key="producto.id"
          class="tarjeta-producto"
        >
          <div class="imagen-contenedor">
            <img :src="producto.imagen" :alt="producto.nombre" class="imagen-producto" />
            <span class="etiqueta-categoria">{{ producto.categoria }}</span>

            <button 
              @click="tienda.alternarFavorito(producto)" 
              class="btn-favorito-flotante"
              :class="{ 'corazon-rojo': esFavorito(producto.id) }"
            >
              {{ esFavorito(producto.id) ? '❤️' : '🤍' }}
            </button>
          </div>

          <div class="info-producto">
            <h3>{{ producto.nombre }}</h3>
            <p class="precio">${{ producto.precio.toLocaleString() }}</p>

            <button 
              @click="tienda.agregarAlCarrito(producto)" 
              class="btn-agregar-carrito"
            >
              🛒 Agregar al carrito
            </button>
          </div>
        </div>

        <div v-else class="estado-vacio">
          <span class="icono-triste">🛒</span>
          <h2>¡Ups!</h2>
          <p>No encontramos nada con esa búsqueda.</p>
        </div>
      </main>
    </div>

    <!-- OVERLAY -->
    <div class="overlay-carrito" v-if="mostrarCarrito" @click="mostrarCarrito = false"></div>

    <!-- CARRITO -->
    <aside class="panel-carrito" :class="{ 'abierto': mostrarCarrito }">
      <div class="carrito-header">
        <h2>Tu Carrito 🛒</h2>
        <button class="btn-cerrar" @click="mostrarCarrito = false">❌</button>
      </div>

      <div class="carrito-body" v-if="tienda.carrito.length > 0">
        <div class="item-carrito" v-for="item in tienda.carrito" :key="item.id">
          <img :src="item.imagen" :alt="item.nombre" class="img-mini" />

          <div class="item-info">
            <h4>{{ item.nombre }}</h4>
            <p class="item-precio">${{ (item.precio * item.cantidad).toLocaleString() }}</p>

            <div class="controles-cantidad">
              <button @click="tienda.cambiarCantidad(item.id, -1)">-</button>
              <span>{{ item.cantidad }}</span>
              <button @click="tienda.cambiarCantidad(item.id, 1)">+</button>
            </div>
          </div>

          <button class="btn-eliminar" @click="tienda.eliminarDelCarrito(item.id)">🗑️</button>
        </div>
      </div>

      <div class="carrito-vacio" v-else>
        <p>Tu carrito está vacío.</p>
        <p>¡Anímate a comprar algo!</p>
      </div>

      <div class="carrito-footer" v-if="tienda.carrito.length > 0">
        <div class="total">
          <span>Total:</span>
          <span>${{ tienda.totalCarrito.toLocaleString() }}</span>
        </div>

        <button class="btn-pagar" @click="alert('Compra simulada')">
          Proceder al pago
        </button>

        <button class="btn-vaciar" @click="tienda.vaciarCarrito">
          Vaciar carrito
        </button>
      </div>
    </aside>
  </div>
</template>