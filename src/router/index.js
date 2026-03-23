import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import Categoria from '../views/Categoria.vue'

const routes = [
  { path: '/', component: App },
  { path: '/categoria/:slug', component: Categoria }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})