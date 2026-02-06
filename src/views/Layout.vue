<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex space-x-4 items-center">
            <router-link to="/" class="text-gray-800 hover:text-blue-600 px-3 py-2">
              Home
            </router-link>
            <router-link to="/about" class="text-gray-800 hover:text-blue-600 px-3 py-2">
              About
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="max-w-7xl mx-auto py-6 px-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>
