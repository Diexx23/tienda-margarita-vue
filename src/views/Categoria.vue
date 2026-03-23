<script setup>
import { useRoute } from 'vue-router'
import { useTiendaStore } from '../stores/useTiendaStore'

const route = useRoute()
const tienda = useTiendaStore()

const slug = route.params.slug

tienda.categoriaFiltro = slug
</script>

<template>
  <div>
    <h1 style="text-align:center; margin:20px 0;">
      Categoría: {{ slug }}
    </h1>

    <router-link to="/">
      <button style="margin-bottom:20px;">⬅ Volver</button>
    </router-link>

    <div class="grid-productos">
      <div v-for="producto in tienda.productosFiltrados" :key="producto.id">
        <img :src="producto.imagen" width="150" />
        <p>{{ producto.nombre }}</p>
      </div>
    </div>
  </div>
</template>