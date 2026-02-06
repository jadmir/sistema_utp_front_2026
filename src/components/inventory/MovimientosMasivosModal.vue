<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full my-2 sm:my-4 max-h-[98vh] sm:max-h-[95vh] flex flex-col">
      <!-- Header -->
      <div 
        :class="[
          'border-b dark:border-gray-700 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-start sm:items-center rounded-t-lg flex-shrink-0',
          tipo === 'entrada' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-orange-50 dark:bg-orange-900/20'
        ]"
      >
        <div class="flex-1 min-w-0 pr-2">
          <h2 class="text-base sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {{ tipo === 'entrada' ? '📥 Entrada Masiva' : '📤 Salida Masiva' }}
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
            {{ tipo === 'entrada' 
              ? 'Registra entradas de stock para múltiples productos' 
              : 'Registra salidas de stock para múltiples productos' 
            }}
          </p>
        </div>
        <button @click="$emit('close')" class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto flex flex-col">
        <div class="p-3 sm:p-6 space-y-4 sm:space-y-6 flex-1">
          <!-- Configuración Global (solo para salidas) -->
          <div v-if="tipo === 'salida'" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">⚙️ Configuración Global</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Área de destino *
                </label>
                <select
                  v-model="configuracionGlobal.area_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccione un área...</option>
                  <option v-for="area in (areas || [])" :key="area.id" :value="area.id">
                    {{ area.nombre }} - {{ area.codigo }}
                  </option>
                </select>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  📍 Se aplicará a todos los productos
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Motivo general *
                </label>
                <input
                  v-model="configuracionGlobal.motivo"
                  type="text"
                  maxlength="255"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Entrega mensual de material"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  📝 Se aplicará a todos los productos
                </p>
              </div>
            </div>
          </div>

          <!-- Configuración Global (para entradas) -->
          <div v-else class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">⚙️ Configuración Global</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Motivo general *
              </label>
              <input
                v-model="configuracionGlobal.motivo"
                type="text"
                maxlength="255"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ej: Compra a proveedor, Donación, etc."
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                📝 Se aplicará a todos los productos (puedes personalizarlo por producto después)
              </p>
            </div>
          </div>

          <!-- Fecha del Movimiento -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              📅 Fecha del Movimiento *
              <span 
                class="text-xs text-gray-500 dark:text-gray-400 cursor-help" 
                title="¿Cuándo ocurrieron realmente estos movimientos?"
              >
                ℹ️
              </span>
            </label>
            <input
              v-model="configuracionGlobal.fecha_movimiento"
              type="date"
              :max="maxDate"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ tipo === 'entrada' ? '¿Cuándo llegaron realmente los productos?' : '¿Cuándo se entregaron realmente?' }}
            </p>
          </div>

          <!-- Lista de productos -->
          <div>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                📦 Productos ({{ productosSeleccionados.length }})
              </h3>
              <button
                type="button"
                @click="agregarProducto"
                class="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="sm:inline">Agregar Producto</span>
              </button>
            </div>

            <!-- Tabla de productos - Desktop -->
            <div class="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="max-h-[450px] overflow-y-auto">
                <table class="w-full table-fixed">
                  <thead class="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase" :style="{ width: tipo === 'salida' ? '35%' : '40%' }">Producto</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase" style="width: 140px;">Cantidad</th>
                      <th v-if="tipo === 'salida'" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase" style="width: 120px;">Stock</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Observaciones</th>
                      <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase" style="width: 80px;">Acción</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="productosSeleccionados.length === 0">
                      <td :colspan="tipo === 'salida' ? 5 : 4" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No hay productos agregados. Haz clic en "Agregar Producto" para comenzar.
                      </td>
                    </tr>
                    <tr v-else v-for="(item, index) in productosSeleccionados" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <!-- Producto -->
                      <td class="px-4 py-3 align-top">
                        <div class="relative">
                          <!-- Producto seleccionado (badge) -->
                          <div v-if="item.product_id" class="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-2.5">
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium text-gray-900 dark:text-white truncate leading-tight">{{ getProducto(item.product_id)?.nombre }}</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                <span class="font-mono">{{ getProducto(item.product_id)?.codigo }}</span> • 
                                Stock: <span class="font-semibold">{{ getProducto(item.product_id).stock_actual }} {{ getProducto(item.product_id).unidad_medida }}</span>
                              </p>
                            </div>
                            <button
                              type="button"
                              @click="limpiarSeleccion(index)"
                              class="flex-shrink-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              title="Cambiar producto"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <!-- Input de búsqueda (solo cuando no hay producto seleccionado) -->
                          <div v-else>
                            <input
                              :ref="el => setInputRef(el, index)"
                              v-model="item.busqueda"
                              @focus="iniciarBusqueda(index)"
                              @input="filtrarProductos(index)"
                              type="text"
                              placeholder="Buscar producto por nombre o código..."
                              :disabled="cargandoProductos"
                              class="w-full px-3 py-2 pr-8 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <!-- Icono de búsqueda -->
                            <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          
                          <!-- Lista desplegable de productos filtrados -->
                          <div 
                            v-if="!item.product_id && item.mostrarLista && item.productosFiltrados && item.productosFiltrados.length > 0"
                            class="fixed z-[9999] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl max-h-96 overflow-y-auto"
                            :style="{ 
                              top: getDropdownPosition(index).top, 
                              left: getDropdownPosition(index).left,
                              width: getDropdownPosition(index).width
                            }"
                          >
                            <button
                              v-for="producto in item.productosFiltrados.slice(0, 50)"
                              :key="producto.id"
                              type="button"
                              @click="seleccionarProducto(index, producto)"
                              :disabled="esProductoSeleccionado(producto.id)"
                              :class="[
                                'w-full px-3 py-2.5 text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors',
                                esProductoSeleccionado(producto.id) 
                                  ? 'bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed' 
                                  : 'hover:bg-blue-50 dark:hover:bg-gray-700/50'
                              ]"
                            >
                              <div class="flex flex-col gap-1">
                                <div class="flex items-center justify-between gap-2">
                                  <span class="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">{{ producto.codigo }}</span>
                                  <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                    Stock: <span class="font-semibold text-gray-700 dark:text-gray-300">{{ producto.stock_actual }}</span>
                                    <span v-if="esProductoSeleccionado(producto.id)" class="ml-2 text-orange-600 dark:text-orange-400">✓ Seleccionado</span>
                                  </span>
                                </div>
                                <p class="text-sm text-gray-900 dark:text-white line-clamp-2">{{ producto.nombre }}</p>
                              </div>
                            </button>
                          </div>
                          
                          <!-- Mensaje cuando no hay resultados -->
                          <div 
                            v-if="!item.product_id && item.mostrarLista && item.busqueda && item.productosFiltrados && item.productosFiltrados.length === 0"
                            class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 text-sm text-gray-500 dark:text-gray-400 text-center"
                          >
                            No se encontraron productos
                          </div>
                        </div>
                      </td>

                      <!-- Cantidad -->
                      <td class="px-4 py-3 align-top">
                        <input
                          v-model.number="item.cantidad"
                          type="number"
                          min="1"
                          :max="tipo === 'salida' && item.product_id ? getProducto(item.product_id)?.stock_actual : undefined"
                          required
                          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                          placeholder="0"
                        />
                      </td>

                      <!-- Stock (solo salidas) -->
                      <td v-if="tipo === 'salida'" class="px-4 py-3 text-sm align-top">
                        <span v-if="item.product_id && item.cantidad" 
                          :class="[
                            'font-semibold inline-block',
                            calcularNuevoStock(item) < getProducto(item.product_id)?.stock_minimo 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-gray-900 dark:text-white'
                          ]"
                        >
                          {{ calcularNuevoStock(item) }}
                          <span class="text-xs text-gray-500">
                            {{ getProducto(item.product_id)?.unidad_medida }}
                          </span>
                        </span>
                        <p v-if="item.product_id && item.cantidad && calcularNuevoStock(item) < getProducto(item.product_id)?.stock_minimo" 
                          class="text-xs text-red-600 dark:text-red-400 mt-1"
                        >
                          ⚠️ Bajo mínimo
                        </p>
                      </td>

                      <!-- Observaciones -->
                      <td class="px-4 py-3 align-top">
                        <input
                          v-model="item.observaciones"
                          type="text"
                          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Opcional..."
                        />
                      </td>

                      <!-- Acción -->
                      <td class="px-4 py-3 text-center align-top">
                        <button
                          type="button"
                          @click="eliminarProducto(index)"
                          class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Eliminar"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Vista Mobile - Cards -->
            <div class="md:hidden space-y-3">
              <div v-if="productosSeleccionados.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                No hay productos agregados. Toca "Agregar Producto" para comenzar.
              </div>
              
              <div v-else v-for="(item, index) in productosSeleccionados" :key="index" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-3">
                <!-- Header del card -->
                <div class="flex justify-between items-start mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Producto #{{ index + 1 }}</span>
                  <button
                    type="button"
                    @click="eliminarProducto(index)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                    title="Eliminar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <!-- Producto -->
                <div class="mb-3">
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Producto</label>
                  <div class="relative">
                    <!-- Producto seleccionado (badge) -->
                    <div v-if="item.product_id" class="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-2.5">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate leading-tight">{{ getProducto(item.product_id)?.nombre }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <span class="font-mono">{{ getProducto(item.product_id)?.codigo }}</span> • 
                          Stock: <span class="font-semibold">{{ getProducto(item.product_id).stock_actual }} {{ getProducto(item.product_id).unidad_medida }}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        @click="limpiarSeleccion(index)"
                        class="flex-shrink-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                        title="Cambiar producto"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Input de búsqueda (solo cuando no hay producto seleccionado) -->
                    <div v-else>
                      <input
                        :ref="el => setInputRef(el, index)"
                        v-model="item.busqueda"
                        @focus="iniciarBusqueda(index)"
                        @input="filtrarProductos(index)"
                        type="text"
                        placeholder="Buscar producto por nombre o código..."
                        :disabled="cargandoProductos"
                        class="w-full px-3 py-2.5 pr-8 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <!-- Icono de búsqueda -->
                      <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    <!-- Lista desplegable de productos filtrados -->
                    <div 
                      v-if="!item.product_id && item.mostrarLista && item.productosFiltrados && item.productosFiltrados.length > 0"
                      class="fixed z-[9999] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
                      :style="{ 
                        top: getDropdownPosition(index).top, 
                        left: getDropdownPosition(index).left,
                        width: getDropdownPosition(index).width
                      }"
                    >
                      <button
                        v-for="producto in item.productosFiltrados.slice(0, 50)"
                        :key="producto.id"
                        type="button"
                        @click="seleccionarProducto(index, producto)"
                        :disabled="esProductoSeleccionado(producto.id)"
                        :class="[
                          'w-full px-3 py-2.5 text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors',
                          esProductoSeleccionado(producto.id) 
                            ? 'bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed' 
                            : 'hover:bg-blue-50 dark:hover:bg-gray-700/50'
                        ]"
                      >
                        <div class="flex flex-col gap-1">
                          <div class="flex items-center justify-between gap-2">
                            <span class="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">{{ producto.codigo }}</span>
                            <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              Stock: <span class="font-semibold text-gray-700 dark:text-gray-300">{{ producto.stock_actual }}</span>
                              <span v-if="esProductoSeleccionado(producto.id)" class="ml-2 text-orange-600 dark:text-orange-400">✓</span>
                            </span>
                          </div>
                          <p class="text-sm text-gray-900 dark:text-white line-clamp-2">{{ producto.nombre }}</p>
                        </div>
                      </button>
                    </div>
                    
                    <!-- Mensaje cuando no hay resultados -->
                    <div 
                      v-if="!item.product_id && item.mostrarLista && item.busqueda && item.productosFiltrados && item.productosFiltrados.length === 0"
                      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 text-sm text-gray-500 dark:text-gray-400 text-center"
                    >
                      No se encontraron productos
                    </div>
                  </div>
                </div>

                <!-- Cantidad y Stock (si es salida) -->
                <div :class="tipo === 'salida' ? 'grid grid-cols-2 gap-2 mb-3' : 'mb-3'">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Cantidad</label>
                    <input
                      v-model.number="item.cantidad"
                      type="number"
                      min="1"
                      :max="tipo === 'salida' && item.product_id ? getProducto(item.product_id)?.stock_actual : undefined"
                      required
                      class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                  
                  <div v-if="tipo === 'salida'">
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Resultante</label>
                    <div class="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <span v-if="item.product_id && item.cantidad" 
                        :class="[
                          'font-semibold',
                          calcularNuevoStock(item) < getProducto(item.product_id)?.stock_minimo 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-gray-900 dark:text-white'
                        ]"
                      >
                        {{ calcularNuevoStock(item) }}
                        <span class="text-xs text-gray-500">
                          {{ getProducto(item.product_id)?.unidad_medida }}
                        </span>
                      </span>
                      <span v-else class="text-gray-400">-</span>
                    </div>
                    <p v-if="item.product_id && item.cantidad && calcularNuevoStock(item) < getProducto(item.product_id)?.stock_minimo" 
                      class="text-xs text-red-600 dark:text-red-400 mt-1"
                    >
                      ⚠️ Bajo mínimo
                    </p>
                  </div>
                </div>

                <!-- Observaciones -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
                  <input
                    v-model="item.observaciones"
                    type="text"
                    class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Opcional..."
                  />
                </div>
              </div>
            </div>

            <!-- Resumen -->
            <div v-if="productosSeleccionados.length > 0" class="mt-3 sm:mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    Total de productos: <span class="text-blue-600 dark:text-blue-400 font-bold">{{ productosSeleccionados.length }}</span>
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {{ tipo === 'entrada' 
                      ? 'Se registrarán entradas para estos productos' 
                      : 'Se registrarán salidas para estos productos' 
                    }}
                  </p>
                </div>
                <div v-if="tipo === 'salida' && hayProductosConStockBajo" class="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span class="text-xs sm:text-sm font-medium">Algunos productos quedarán con stock bajo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer con botones -->
        <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-3 sm:p-6 pt-3 sm:pt-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
          <button
            type="button"
            @click="$emit('close')"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition text-sm sm:text-base"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading || productosSeleccionados.length === 0 || !formularioValido"
            :class="[
              'w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 text-sm sm:text-base',
              tipo === 'entrada' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'
            ]"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Procesando...' : 'Registrar ' + (tipo === 'entrada' ? 'Entradas' : 'Salidas') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { productsService } from '../../services/products'
import { areasService } from '../../services/areas'
import { useAlert } from '../../composables/useAlert'
import { useCache } from '../../composables/useCache'

const props = defineProps({
  tipo: {
    type: String,
    required: true,
    validator: (value) => ['entrada', 'salida'].includes(value)
  },
  productos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const { success, error, warning } = useAlert()
const { invalidateCache } = useCache()
const loading = ref(false)
const cargandoProductos = ref(false)
const cargandoAreas = ref(false)
const areas = ref([])
const productosDisponibles = ref([])
const inputRefs = ref({})

// Función para guardar referencias de inputs
const setInputRef = (el, index) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

// Función para obtener la posición del dropdown
const getDropdownPosition = (index) => {
  const input = inputRefs.value[index]
  if (!input) return { top: '0px', left: '0px', width: 'auto' }
  
  const rect = input.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const dropdownWidth = Math.min(600, viewportWidth - rect.left - 20) // Máximo 600px o el espacio disponible
  
  return {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${dropdownWidth}px`
  }
}

// Fecha máxima permitida (hoy)
const maxDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const configuracionGlobal = ref({
  area_id: '',
  motivo: '',
  fecha_movimiento: maxDate.value
})

const productosSeleccionados = ref([])

const formularioValido = computed(() => {
  if (productosSeleccionados.value.length === 0) return false
  
  // Validar configuración global
  if (!configuracionGlobal.value.motivo) return false
  if (props.tipo === 'salida' && !configuracionGlobal.value.area_id) return false
  if (!configuracionGlobal.value.fecha_movimiento) return false
  
  // Validar cada producto
  return productosSeleccionados.value.every(item => {
    if (!item.product_id || !item.cantidad || item.cantidad < 1) return false
    
    // Para salidas, validar stock disponible
    if (props.tipo === 'salida') {
      const producto = getProducto(item.product_id)
      if (!producto || item.cantidad > producto.stock_actual) return false
    }
    
    return true
  })
})

const hayProductosConStockBajo = computed(() => {
  if (props.tipo !== 'salida') return false
  
  return productosSeleccionados.value.some(item => {
    if (!item.product_id || !item.cantidad) return false
    const producto = getProducto(item.product_id)
    if (!producto) return false
    return calcularNuevoStock(item) < producto.stock_minimo
  })
})

const agregarProducto = () => {
  productosSeleccionados.value.push({
    product_id: '',
    cantidad: 0,
    observaciones: '',
    busqueda: '',
    mostrarLista: false,
    productosFiltrados: []
  })
}

const eliminarProducto = (index) => {
  productosSeleccionados.value.splice(index, 1)
}

const iniciarBusqueda = (index) => {
  // Cerrar todas las demás listas primero
  productosSeleccionados.value.forEach((item, i) => {
    if (i !== index) {
      item.mostrarLista = false
    }
  })
  
  const item = productosSeleccionados.value[index]
  item.mostrarLista = true
  // Inicializar con todos los productos si no hay filtro
  if (!item.productosFiltrados || item.productosFiltrados.length === 0) {
    item.productosFiltrados = productosDisponibles.value
  }
}

const filtrarProductos = (index) => {
  const item = productosSeleccionados.value[index]
  const busqueda = item.busqueda?.toLowerCase().trim() || ''
  
  // Cerrar todas las demás listas
  productosSeleccionados.value.forEach((otroItem, i) => {
    if (i !== index) {
      otroItem.mostrarLista = false
    }
  })
  
  // Mostrar la lista cuando hay algo escrito o cuando se hace focus
  item.mostrarLista = true
  
  if (!busqueda) {
    // Si no hay búsqueda, mostrar todos los productos
    item.productosFiltrados = productosDisponibles.value
    return
  }
  
  // Filtrar productos por código o nombre
  item.productosFiltrados = productosDisponibles.value.filter(producto => {
    const nombre = producto.nombre?.toLowerCase() || ''
    const codigo = producto.codigo?.toLowerCase() || ''
    return nombre.includes(busqueda) || codigo.includes(busqueda)
  })
}

const seleccionarProducto = (index, producto) => {
  // Verificar si el producto ya está seleccionado
  if (esProductoSeleccionado(producto.id)) {
    warning(`El producto "${producto.nombre}" ya está seleccionado en otra fila`)
    return
  }
  
  const item = productosSeleccionados.value[index]
  item.product_id = producto.id
  item.busqueda = ''
  item.mostrarLista = false
  item.cantidad = 0
}

const limpiarSeleccion = (index) => {
  const item = productosSeleccionados.value[index]
  item.product_id = ''
  item.busqueda = ''
  item.cantidad = 0
  item.observaciones = ''
  item.mostrarLista = false
}

const esProductoSeleccionado = (productId) => {
  return productosSeleccionados.value.some(item => item.product_id === productId)
}

const getProducto = (productId) => {
  if (!productosDisponibles.value || !Array.isArray(productosDisponibles.value)) return null
  return productosDisponibles.value.find(p => p.id === productId)
}

const onProductoChange = (index) => {
  // Resetear cantidad cuando cambia el producto
  productosSeleccionados.value[index].cantidad = 0
}

const calcularNuevoStock = (item) => {
  if (!item.product_id || !item.cantidad) return 0
  const producto = getProducto(item.product_id)
  if (!producto) return 0
  return producto.stock_actual - item.cantidad
}

const handleSubmit = async () => {
  if (!formularioValido.value) {
    error('Por favor completa todos los campos requeridos')
    return
  }

  // Validar stock para salidas
  if (props.tipo === 'salida') {
    const erroresStock = []
    productosSeleccionados.value.forEach((item, index) => {
      const producto = getProducto(item.product_id)
      if (producto && item.cantidad > producto.stock_actual) {
        erroresStock.push(`${producto.nombre}: Stock insuficiente (disponible: ${producto.stock_actual})`)
      }
    })
    
    if (erroresStock.length > 0) {
      error(`Stock insuficiente:\n${erroresStock.join('\n')}`)
      return
    }
  }

  loading.value = true

  try {
    // Preparar datos según el formato de la API
    const productos = productosSeleccionados.value.map(item => {
      const data = {
        product_id: item.product_id,
        cantidad: item.cantidad,
        motivo: configuracionGlobal.value.motivo,
        observaciones: item.observaciones || null,
        fecha_movimiento: configuracionGlobal.value.fecha_movimiento
      }
      
      // Agregar area_id solo para salidas
      if (props.tipo === 'salida') {
        data.area_id = configuracionGlobal.value.area_id
      }
      
      return data
    })

    const payload = { productos }

    // Llamar al servicio correspondiente
    const response = props.tipo === 'entrada' 
      ? await productsService.entradaMasiva(payload)
      : await productsService.salidaMasiva(payload)

    // Invalidar caché
    invalidateCache('products')
    invalidateCache('movements')
    invalidateCache('dashboard')

    // Mostrar mensaje de éxito
    const mensaje = response.data.message || `${props.tipo === 'entrada' ? 'Entradas' : 'Salidas'} masivas registradas exitosamente`
    success(mensaje)

    // Mostrar alertas de stock bajo si las hay
    if (props.tipo === 'salida' && response.data.alertas_stock_bajo?.length > 0) {
      const productosConStockBajo = response.data.alertas_stock_bajo.map(p => 
        `${p.nombre} (Stock: ${p.stock_actual}/${p.stock_minimo})`
      ).join('\n')
      warning(`Productos con stock bajo:\n${productosConStockBajo}`)
    }

    emit('save', response.data)
    emit('close')
  } catch (err) {
    console.error('Error al registrar movimientos masivos:', err)
    
    if (err.response?.status === 422) {
      // Errores de validación
      const errors = err.response.data.errors || {}
      const mensajes = Object.values(errors).flat().join('\n')
      error(`Error de validación:\n${mensajes}`)
    } else if (err.response?.status === 400) {
      // Errores de procesamiento (stock insuficiente, etc)
      const errores = err.response.data.errores || []
      if (errores.length > 0) {
        const mensajes = errores.map(e => {
          if (e.error === 'Stock insuficiente') {
            return `${e.nombre || e.codigo}: Stock insuficiente (disponible: ${e.stock_actual}, solicitado: ${e.cantidad_solicitada})`
          }
          return `${e.nombre || e.codigo}: ${e.error}`
        }).join('\n')
        error(`Error al procesar:\n${mensajes}`)
      } else {
        error(err.response.data.message || 'Error al procesar los movimientos')
      }
    } else {
      error(err.response?.data?.message || 'Error al registrar los movimientos masivos')
    }
  } finally {
    loading.value = false
  }
}

const cargarProductos = async () => {
  cargandoProductos.value = true
  try {
    const response = await productsService.getAll({ per_page: 1000 })
    
    // La estructura es: response.data.data.data (respuesta paginada)
    let data = []
    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      // Respuesta paginada: { data: { data: [...] } }
      data = response.data.data.data
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      // Respuesta simple: { data: [...] }
      data = response.data.data
    } else if (Array.isArray(response.data)) {
      // Array directo
      data = response.data
    }
    
    console.log('✅ Productos cargados:', data.length)
    productosDisponibles.value = data
  } catch (err) {
    console.error('❌ Error al cargar productos:', err)
    productosDisponibles.value = []
    error('Error al cargar los productos')
  } finally {
    cargandoProductos.value = false
  }
}

const cargarAreas = async () => {
  cargandoAreas.value = true
  try {
    const response = await areasService.getActivas()
    console.log('Respuesta áreas:', response)
    const data = response.data.data || response.data || []
    areas.value = Array.isArray(data) ? data : []
    console.log('Áreas cargadas:', areas.value.length)
  } catch (err) {
    console.error('Error al cargar áreas:', err)
    areas.value = []
    error('Error al cargar las áreas')
  } finally {
    cargandoAreas.value = false
  }
}

onMounted(async () => {
  await cargarProductos()
  if (props.tipo === 'salida') {
    await cargarAreas()
  }
  
  // Si se pasaron productos pre-seleccionados, agregarlos
  if (props.productos && Array.isArray(props.productos) && props.productos.length > 0) {
    productosSeleccionados.value = props.productos
      .filter(p => p && p.id) // Filtrar productos válidos
      .map(p => ({
        product_id: p.id,
        cantidad: 0,
        observaciones: '',
        busqueda: '',
        mostrarLista: false,
        productosFiltrados: []
      }))
  }
  
  // Cerrar listas desplegables al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('td')) {
      productosSeleccionados.value.forEach(item => {
        item.mostrarLista = false
      })
    }
  })
})
</script>
