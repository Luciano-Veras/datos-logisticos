import { state } from './store.js';
import { queryProducts } from './database.js';

export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-gray-900 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-[#005696] text-white';
  const iconClass = type === 'success' ? 'fa-check-circle text-emerald-400' : type === 'error' ? 'fa-exclamation-triangle text-amber-300' : 'fa-info-circle text-sky-300';

  toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs font-medium ${bgClass} transform transition-all duration-300 translate-y-2 opacity-0`;
  toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;

  const container = document.getElementById('toast-container');
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function renderProductsTable() {
  const searchInput = document.getElementById('search-input');
  const searchTerm = searchInput ? searchInput.value : '';
  state.productsList = queryProducts(searchTerm);

  const tbody = document.getElementById('table-body');
  const countEl = document.getElementById('count-number');
  const badgeTotal = document.getElementById('badge-total-sku');

  if (countEl) countEl.innerText = state.productsList.length;
  if (badgeTotal) badgeTotal.innerText = state.productsList.length;

  if (state.productsList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-12 text-center text-gray-400">
          <div class="flex flex-col items-center justify-center space-y-2">
            <i class="fa-solid fa-folder-open text-3xl text-gray-300"></i>
            <p class="text-sm font-medium text-gray-600">No se encontraron productos logísticos</p>
            <p class="text-xs text-gray-400">Intenta cambiar el término de búsqueda o agregar un producto nuevo.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  state.productsList.forEach((p, idx) => {
    const isExpanded = state.expandedRowSku === p.sku;
    const pesoKg = parseFloat(p.peso_unidad).toFixed(3);
    const pesoUnidadLabel = p.peso_unidad < 1 ? `${Math.round(p.peso_unidad * 1000)} g` : `${pesoKg} kg`;

    const rowClass = isExpanded 
      ? 'bg-blue-50/60 font-medium block md:table-row p-4 md:p-0' 
      : 'border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer block md:table-row p-4 md:p-0';

    const skuTextClass = isExpanded ? 'text-[#005696] font-bold' : 'text-gray-600 font-medium';
    const nameTextClass = isExpanded ? 'font-semibold text-[#005696]' : 'font-semibold text-gray-800';

    html += `
      <tr class="${rowClass}" onclick="window.toggleExpandRow('${p.sku}')">
        <td class="hidden md:table-cell px-6 py-4 text-center font-mono text-xs text-gray-400">${idx + 1}</td>
        
        <td class="block md:table-cell md:px-6 md:py-4 mb-2 md:mb-0">
          <span class="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">SKU</span>
          <span class="font-mono ${skuTextClass}">${p.sku}</span>
        </td>
        
        <td class="block md:table-cell md:px-6 md:py-4 mb-3 md:mb-0">
          <span class="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Producto</span>
          <div class="flex items-center gap-2">
            <span class="${nameTextClass}">${p.nombre}</span>
          </div>
        </td>
        
        <td class="flex justify-between md:table-cell md:text-center md:px-6 md:py-4 mb-1 md:mb-0 text-sm md:text-base">
          <span class="md:hidden font-bold text-gray-600">Peso Unit.:</span>
          <span class="text-gray-600 font-mono">${pesoUnidadLabel}</span>
        </td>
        
        <td class="flex justify-between md:table-cell md:text-center md:px-6 md:py-4 mb-1 md:mb-0 text-sm md:text-base">
          <span class="md:hidden font-bold text-gray-600">Cdad. Caja:</span>
          <span class="text-gray-600">${p.cantidad_caja} Un.</span>
        </td>
        
        <td class="flex justify-between md:table-cell md:text-center md:px-6 md:py-4 mb-3 md:mb-0 text-sm md:text-base">
          <span class="md:hidden font-bold text-gray-600">Vencimiento:</span>
          <span class="text-gray-500">${p.vencimiento}</span>
        </td>
        
        <td class="block md:table-cell md:text-right mt-3 md:mt-0 pt-3 border-t border-gray-100 md:border-0 md:pt-0 md:px-6 md:py-4" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between md:justify-end space-x-1">
            <span class="md:hidden text-xs text-[#005696] font-medium">Acciones</span>
            <div class="flex gap-1">
              <button 
                onclick="window.toggleExpandRow('${p.sku}')" 
                class="p-2 md:p-1.5 text-gray-400 hover:text-[#005696] hover:bg-blue-100/50 rounded transition-colors"
                title="Ver detalles de empaque (Bento Grid)"
              >
                <i class="fa-solid ${isExpanded ? 'fa-chevron-up text-[#005696]' : 'fa-chevron-down'} text-base md:text-xs"></i>
              </button>
            </div>
          </div>
        </td>
      </tr>
    `;

    if (isExpanded) {
      const volCajaM3 = ((p.largo_caja * p.ancho_caja * p.alto_caja) / 1000000).toFixed(4);
      const pesoPalletTot = (p.cajas_pallet * p.peso_caja).toFixed(1);

      html += `
        <tr class="bg-[#F9FAFB] block md:table-row">
          <td colspan="7" class="block md:table-cell px-4 md:px-6 py-0 border-b border-gray-200">
            <div class="py-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <!-- Bento Card 1: Medidas de Caja -->
              <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 class="text-sm uppercase font-bold text-[#005696] mb-5 border-b border-gray-100 pb-2">
                    MEDIDAS DE CAJA
                  </h4>
                  <div class="space-y-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-blue-50 text-[#005696] flex items-center justify-center shrink-0 border border-blue-100"><i class="fa-solid fa-arrows-left-right text-lg"></i></div>
                      <div>
                        <p class="text-xs text-gray-500 font-semibold leading-tight">Largo</p>
                        <p class="text-sm font-bold text-gray-900 leading-tight mt-0.5">${p.largo_caja} cm</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-blue-50 text-[#005696] flex items-center justify-center shrink-0 border border-blue-100"><i class="fa-solid fa-ruler-combined text-lg"></i></div>
                      <div>
                        <p class="text-xs text-gray-500 font-semibold leading-tight">Ancho</p>
                        <p class="text-sm font-bold text-gray-900 leading-tight mt-0.5">${p.ancho_caja} cm</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-blue-50 text-[#005696] flex items-center justify-center shrink-0 border border-blue-100"><i class="fa-solid fa-arrows-up-down text-lg"></i></div>
                      <div>
                        <p class="text-xs text-gray-500 font-semibold leading-tight">Alto</p>
                        <p class="text-sm font-bold text-gray-900 leading-tight mt-0.5">${p.alto_caja} cm</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-blue-50 text-[#005696] flex items-center justify-center shrink-0 border border-blue-100"><i class="fa-solid fa-scale-balanced text-lg"></i></div>
                      <div>
                        <p class="text-xs text-gray-500 font-semibold leading-tight">Peso Bruto</p>
                        <p class="text-sm font-bold text-gray-900 leading-tight mt-0.5">${p.peso_caja} kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bento Card 2: Imagen del Producto -->
              <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
                <h4 class="text-sm uppercase font-bold text-[#005696] mb-5 border-b border-gray-100 pb-2">
                  IMAGEN DEL PRODUCTO
                </h4>
                <div class="flex-1 rounded-lg flex items-center justify-center min-h-[200px] text-gray-400 font-medium text-sm border border-gray-200 overflow-hidden relative">
                  <img src="imagenes/${p.sku}.jpg" alt="${p.nombre}" 
                       class="w-full h-full object-contain absolute inset-0 z-10 bg-white"
                       onerror="this.onerror=null; this.src='imagenes/${p.sku}.png'; this.onerror=function(){this.style.display='none'; this.nextElementSibling.classList.remove('hidden'); this.nextElementSibling.classList.add('flex');}"
                  />
                  <div class="text-center z-0 relative bg-gray-50 w-full h-full hidden flex-col items-center justify-center">
                    <i class="fa-regular fa-image text-4xl mb-3 text-gray-300"></i>
                    <p class="text-sm text-gray-400">Sin imagen</p>
                  </div>
                </div>
              </div>

              <!-- Bento Card 3: Códigos Identificadores GS1 -->
              <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
                <h4 class="text-sm uppercase font-bold text-[#005696] mb-5 border-b border-gray-100 pb-2">
                  CÓDIGOS IDENTIFICADORES
                </h4>
                <div class="space-y-6">
                  <div>
                    <p class="text-xs text-gray-500 font-bold mb-2 uppercase">EAN13:</p>
                    <div class="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 shadow-inner">
                      <i class="fa-solid fa-barcode text-2xl text-[#005696]/60"></i>
                      <span class="text-[15px] font-mono font-bold text-gray-700 tracking-tight break-all">[${p.ean13}]</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-bold mb-2 uppercase">DUN14:</p>
                    <div class="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 shadow-inner">
                      <i class="fa-solid fa-barcode text-2xl text-[#005696]/60"></i>
                      <span class="text-[15px] font-mono font-bold text-gray-700 tracking-tight break-all">[${p.dun14}]</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bento Card 4: Configuración de Estiba -->
              <div class="bg-white p-1 rounded-xl shadow-sm flex flex-col h-full relative border border-gray-200">
                <!-- Inner Dashed Border -->
                <div class="absolute inset-0 border-2 border-[#005696] border-dashed rounded-xl opacity-30 pointer-events-none m-1.5"></div>
                
                <div class="relative z-10 flex flex-col h-full p-4 pt-5">
                  <h4 class="text-sm uppercase font-bold text-[#005696] mb-6 border-b border-gray-200 pb-2 text-center mx-2">
                    CONFIGURACIÓN DE ESTIBA
                  </h4>
                  
                  <div class="flex items-center justify-center gap-6 px-2 mb-5">
                    <div class="text-center">
                      <p class="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Cajas Totales:</p>
                      <p class="text-4xl font-black text-[#005696] font-mono leading-none mt-1">${p.cajas_pallet}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-3xl font-black text-[#005696] font-mono leading-none mt-1">${pesoPalletTot}<span class="text-sm font-bold text-gray-500 ml-1">KG</span></p>
                      <p class="text-[11px] text-gray-500 font-bold uppercase tracking-wide mt-1">Por Pallet</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-center gap-8 border-t border-gray-100 pt-5 px-2 mb-4">
                    <div class="text-center">
                      <p class="text-[11px] text-gray-500 font-bold uppercase">Cajas por Base:</p>
                      <p class="text-2xl font-bold text-gray-800 mt-1">${p.cajas_base}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-[11px] text-gray-500 font-bold uppercase">Camadas de Altura:</p>
                      <p class="text-2xl font-bold text-gray-800 mt-1">${p.altura_pallet}</p>
                    </div>
                  </div>
                  
                  <div class="mt-auto flex justify-center pb-2">
                    <svg width="110" height="90" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
                      <!-- Pallet Base -->
                      <rect x="15" y="65" width="70" height="5" fill="#4B5563" rx="2"/>
                      <rect x="20" y="70" width="8" height="6" fill="#374151" rx="1"/>
                      <rect x="46" y="70" width="8" height="6" fill="#374151" rx="1"/>
                      <rect x="72" y="70" width="8" height="6" fill="#374151" rx="1"/>
                      <rect x="15" y="76" width="70" height="4" fill="#4B5563" rx="1"/>
                      <!-- Boxes -->
                      <rect x="25" y="45" width="22" height="18" fill="#DBEAFE" stroke="#1E3A8A" stroke-width="1.5" rx="1"/>
                      <rect x="53" y="45" width="22" height="18" fill="#DBEAFE" stroke="#1E3A8A" stroke-width="1.5" rx="1"/>
                      <rect x="39" y="25" width="22" height="18" fill="#DBEAFE" stroke="#1E3A8A" stroke-width="1.5" rx="1"/>
                      <!-- Box details -->
                      <path d="M30 49 h12 M30 53 h12 M58 49 h12 M58 53 h12 M44 29 h12 M44 33 h12" stroke="#1E3A8A" stroke-width="1.5" stroke-linecap="round"/>
                      <circle cx="36" cy="58" r="1.5" fill="#1E3A8A"/>
                      <circle cx="64" cy="58" r="1.5" fill="#1E3A8A"/>
                      <circle cx="50" cy="38" r="1.5" fill="#1E3A8A"/>
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </td>
        </tr>
      `;
    }
  });

  tbody.innerHTML = html;
}

export function toggleExpandRow(sku) {
  if (state.expandedRowSku === sku) {
    state.expandedRowSku = null;
  } else {
    state.expandedRowSku = sku;
  }
  renderProductsTable();
}

export function sortTable(column) {
  if (state.activeSortColumn === column) {
    state.sortAscending = !state.sortAscending;
  } else {
    state.activeSortColumn = column;
    state.sortAscending = true;
  }
  renderProductsTable();
}

export function openDbModal() {
  document.getElementById('db-modal').classList.remove('hidden');
}

export function closeDbModal() {
  document.getElementById('db-modal').classList.add('hidden');
}

// Global functions for inline HTML onclick handlers
window.toggleExpandRow = toggleExpandRow;
window.sortTable = sortTable;
