<template>
  <nav class="flex mb-4" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <router-link
          to="/"
          class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-400 dark:hover:text-white"
        >
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Inicio
        </router-link>
      </li>

      <li v-for="(crumb, index) in breadcrumbs" :key="index">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <router-link
            v-if="crumb.path && index < breadcrumbs.length - 1"
            :to="crumb.path"
            class="ml-1 text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-400 dark:hover:text-white md:ml-2"
          >
            {{ crumb.name }}
          </router-link>
          <span
            v-else
            class="ml-1 text-sm font-medium text-gray-500 dark:text-gray-500 md:ml-2"
          >
            {{ crumb.name }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbMap = {
  '/': { name: 'Dashboard' },
  '/usuarios': { name: 'Usuarios' },
  '/permisos': { name: 'Permisos' },
  '/inventario': { name: 'Inventario' },
  '/about': { name: 'Acerca de' },
  '/cambiar-password': { name: 'Cambiar Contraseña' }
}

const breadcrumbs = computed(() => {
  const path = route.path
  const crumbs = []

  if (path !== '/') {
    const info = breadcrumbMap[path]
    if (info) {
      crumbs.push({
        name: info.name,
        path: path
      })
    }
  }

  return crumbs
})
</script>
