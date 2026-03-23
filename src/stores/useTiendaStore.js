import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useTiendaStore = defineStore('tienda', () => {

  const productos = ref([
    { id: 1, nombre: 'Cerveza Artesanal IPA', precio: 8500, categoria: 'alcohol', imagen: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?q=80&w=400&auto=format&fit=crop' },
    { id: 2, nombre: 'Tequila Don Julio', precio: 120000, categoria: 'alcohol', imagen: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?q=80&w=400&auto=format&fit=crop' },

    { id: 3, nombre: 'Papas Margarita', precio: 5000, categoria: 'snacks', imagen: 'https://mecato.shop/cdn/shop/products/pollofamiliar_720x.jpg?v=1669216380' },
    { id: 4, nombre: 'Chocolatina', precio: 3000, categoria: 'snacks', imagen: 'https://vaquitaexpress.com.co/media/catalog/product/cache/e89ece728e3939ca368b457071d3c0be/7/7/7702007042276_32.jpg' },

    { id: 5, nombre: 'Postre de Tres Leches', precio: 12000, categoria: 'panaderia', imagen: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=400&auto=format&fit=crop' },
    { id: 6, nombre: 'Croissant de Almendras', precio: 6000, categoria: 'panaderia', imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop' }
  ])

  const categorias = ref([
    { slug: 'alcohol', nombre: '🥂 Alcohol' },
    { slug: 'snacks', nombre: '🥨 Snacks y Paquetes' },
    { slug: 'panaderia', nombre: '🥐 Panadería' }
  ])

  const favoritosGuardados = localStorage.getItem('tienda_favoritos')
  const favoritos = ref(favoritosGuardados ? JSON.parse(favoritosGuardados) : [])

  const carritoGuardado = localStorage.getItem('tienda_carrito')
  const carrito = ref(carritoGuardado ? JSON.parse(carritoGuardado) : [])

  const busqueda = ref('')
  const categoriaFiltro = ref('todas')
  const orden = ref('defecto')

  const productosFiltrados = computed(() => {
    let resultado = [...productos.value]

    if (categoriaFiltro.value !== 'todas') {
      resultado = resultado.filter(p => p.categoria === categoriaFiltro.value)
    }

    if (busqueda.value) {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
      )
    }

    if (orden.value === 'menor') resultado.sort((a, b) => a.precio - b.precio)
    else if (orden.value === 'mayor') resultado.sort((a, b) => b.precio - a.precio)

    return resultado
  })

  const totalCarrito = computed(() =>
    carrito.value.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  )

  const cantidadItemsCarrito = computed(() =>
    carrito.value.reduce((total, item) => total + item.cantidad, 0)
  )

  const alternarFavorito = (producto) => {
    const index = favoritos.value.findIndex(f => f.id === producto.id)
    if (index === -1) favoritos.value.push(producto)
    else favoritos.value.splice(index, 1)
  }

  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.value.find(item => item.id === producto.id)
    if (itemExistente) itemExistente.cantidad++
    else carrito.value.push({ ...producto, cantidad: 1 })
  }

  const cambiarCantidad = (id, cantidad) => {
    const item = carrito.value.find(item => item.id === id)
    if (item) {
      item.cantidad += cantidad
      if (item.cantidad <= 0) eliminarDelCarrito(id)
    }
  }

  const eliminarDelCarrito = (id) => {
    carrito.value = carrito.value.filter(item => item.id !== id)
  }

  const vaciarCarrito = () => {
    carrito.value = []
  }

  watch(favoritos, (n) => localStorage.setItem('tienda_favoritos', JSON.stringify(n)), { deep: true })
  watch(carrito, (n) => localStorage.setItem('tienda_carrito', JSON.stringify(n)), { deep: true })

  return {
    productos,
    categorias,
    favoritos,
    carrito,
    busqueda,
    categoriaFiltro,
    orden,
    productosFiltrados,
    totalCarrito,
    cantidadItemsCarrito,
    alternarFavorito,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito
  }
})