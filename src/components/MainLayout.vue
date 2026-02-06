<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
    <AppHeader />
    
    <!-- Espaciador para compensar el header fijo (h-16 = 64px) -->
    <div class="h-16 flex-shrink-0"></div>
    
    <main class="flex-1 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <slot />
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import Breadcrumbs from './Breadcrumbs.vue'
</script>
