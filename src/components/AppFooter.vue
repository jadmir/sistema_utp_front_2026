<template>
  <footer class="bg-black text-white border-t border-gray-800">
    <div class="max-w-7xl mx-auto py-6 px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Información -->
        <div>
          <h3 class="text-lg font-bold mb-3 text-primary">Sistema de Almacén</h3>
          <p class="text-gray-400 text-sm">
            Gestión eficiente de inventario y productos para tu empresa.
          </p>
        </div>
        
        <!-- Enlaces -->
        <div>
          <h3 class="text-lg font-bold mb-3">Enlaces Rápidos</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/" class="text-gray-400 hover:text-primary transition">
                Inicio
              </router-link>
            </li>
            <li>
              <router-link to="/inventario" class="text-gray-400 hover:text-primary transition">
                Inventario
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Contacto -->
        <div>
          <h3 class="text-lg font-bold mb-3">Contacto</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>admin@almacen.com</span>
            </li>
            <li class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+51 999 999 999</span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="border-t border-gray-800 mt-6 pt-6 text-center">
        <p class="text-gray-400 text-sm">
          © {{ currentYear }} Sistema de Almacén UTP. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
