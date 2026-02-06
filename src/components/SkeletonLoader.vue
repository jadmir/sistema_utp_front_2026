<template>
  <div class="animate-pulse">
    <!-- Table Row Skeleton -->
    <div v-if="type === 'table-row'" class="grid grid-cols-6 gap-4 px-6 py-4">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>

    <!-- Card Skeleton -->
    <div v-else-if="type === 'card'" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
    </div>

    <!-- List Item Skeleton -->
    <div v-else-if="type === 'list-item'" class="flex items-center gap-4 p-4">
      <div class="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div class="flex-1">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Dashboard Card Skeleton -->
    <div v-else-if="type === 'dashboard-card'" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div class="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div class="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div class="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>

    <!-- Default -->
    <div v-else class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'table-row', 'card', 'list-item', 'dashboard-card'].includes(value)
  }
})
</script>
