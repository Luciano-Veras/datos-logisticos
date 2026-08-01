(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function r(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(e){if(e.ep)return;e.ep=!0;const n=r(e);fetch(e.href,n)}})();const d={db:null,productsList:[],activeSortColumn:"id",sortAscending:!0,expandedRowSku:null};function i(s,a="success"){const r=document.createElement("div"),t=a==="success"?"bg-gray-900 text-white":a==="error"?"bg-red-600 text-white":"bg-[#005696] text-white",e=a==="success"?"fa-check-circle text-emerald-400":a==="error"?"fa-exclamation-triangle text-amber-300":"fa-info-circle text-sky-300";r.className=`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs font-medium ${t} transform transition-all duration-300 translate-y-2 opacity-0`,r.innerHTML=`<i class="fa-solid ${e}"></i><span>${s}</span>`,document.getElementById("toast-container").appendChild(r),requestAnimationFrame(()=>{r.classList.remove("translate-y-2","opacity-0")}),setTimeout(()=>{r.classList.add("opacity-0","translate-y-2"),setTimeout(()=>r.remove(),300)},3500)}function u(){const s=document.getElementById("search-input"),a=s?s.value:"";d.productsList=k(a);const r=document.getElementById("table-body"),t=document.getElementById("count-number"),e=document.getElementById("badge-total-sku");if(t&&(t.innerText=d.productsList.length),e&&(e.innerText=d.productsList.length),d.productsList.length===0){r.innerHTML=`
      <tr>
        <td colspan="7" class="px-6 py-12 text-center text-gray-400">
          <div class="flex flex-col items-center justify-center space-y-2">
            <i class="fa-solid fa-folder-open text-3xl text-gray-300"></i>
            <p class="text-sm font-medium text-gray-600">No se encontraron productos logísticos</p>
            <p class="text-xs text-gray-400">Intenta cambiar el término de búsqueda o agregar un producto nuevo.</p>
          </div>
        </td>
      </tr>
    `;return}let n="";d.productsList.forEach((o,b)=>{const m=d.expandedRowSku===o.sku,x=parseFloat(o.peso_unidad).toFixed(3),g=o.peso_unidad<1?`${Math.round(o.peso_unidad*1e3)} g`:`${x} kg`,p=m?"bg-blue-50/60 font-medium block md:table-row p-4 md:p-0":"border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer block md:table-row p-4 md:p-0",f=m?"text-[#005696] font-bold":"text-gray-600 font-medium",l=m?"font-semibold text-[#005696]":"font-semibold text-gray-800";if(n+=`
      <tr class="${p}" onclick="window.toggleExpandRow('${o.sku}')">
        <td class="hidden md:table-cell px-6 py-4 text-center font-mono text-xs text-gray-400">${b+1}</td>
        
        <td class="block md:table-cell md:px-6 md:py-4 mb-2 md:mb-0">
          <span class="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">SKU</span>
          <span class="font-mono ${f}">${o.sku}</span>
        </td>
        
        <td class="block md:table-cell md:px-6 md:py-4 mb-3 md:mb-0">
          <span class="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Producto</span>
          <div class="flex items-center gap-2">
            <span class="${l}">${o.nombre}</span>
          </div>
        </td>
        
        <td class="flex justify-between md:table-cell md:text-center md:px-6 md:py-4 mb-1 md:mb-0 text-sm md:text-base">
          <span class="md:hidden font-bold text-gray-600">Peso Unit.:</span>
          <span class="text-gray-600 font-mono">${g}</span>
        </td>
        
        <td class="flex justify-between md:table-cell md:text-center md:px-6 md:py-4 mb-1 md:mb-0 text-sm md:text-base">
          <span class="md:hidden font-bold text-gray-600">Cdad. Caja:</span>
          <span class="text-gray-600">${o.cantidad_caja} Un.</span>
        </td>
        
        <td class="flex justify-between md:table-cell md:text-center md:px-6 md:py-4 mb-3 md:mb-0 text-sm md:text-base">
          <span class="md:hidden font-bold text-gray-600">Vencimiento:</span>
          <span class="text-gray-500">${o.vencimiento}</span>
        </td>
        
        <td class="block md:table-cell md:text-right mt-3 md:mt-0 pt-3 border-t border-gray-100 md:border-0 md:pt-0 md:px-6 md:py-4" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between md:justify-end space-x-1">
            <span class="md:hidden text-xs text-[#005696] font-medium">Acciones</span>
            <div class="flex gap-1">
              <button 
                onclick="window.toggleExpandRow('${o.sku}')" 
                class="p-2 md:p-1.5 text-gray-400 hover:text-[#005696] hover:bg-blue-100/50 rounded transition-colors"
                title="Ver detalles de empaque (Bento Grid)"
              >
                <i class="fa-solid ${m?"fa-chevron-up text-[#005696]":"fa-chevron-down"} text-base md:text-xs"></i>
              </button>
            </div>
          </div>
        </td>
      </tr>
    `,m){(o.largo_caja*o.ancho_caja*o.alto_caja/1e6).toFixed(4);const c=(o.cajas_pallet*o.peso_caja).toFixed(1);n+=`
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
                        <p class="text-sm font-bold text-gray-900 leading-tight mt-0.5">${o.largo_caja} cm</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-blue-50 text-[#005696] flex items-center justify-center shrink-0 border border-blue-100"><i class="fa-solid fa-ruler-combined text-lg"></i></div>
                      <div>
                        <p class="text-xs text-gray-500 font-semibold leading-tight">Ancho</p>
                        <p class="text-sm font-bold text-gray-900 leading-tight mt-0.5">${o.ancho_caja} cm</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-blue-50 text-[#005696] flex items-center justify-center shrink-0 border border-blue-100"><i class="fa-solid fa-arrows-up-down text-lg"></i></div>
                      <div>
                        <p class="text-xs text-gray-500 font-semibold leading-tight">Alto</p>
                        <p class="text-sm font-bold text-gray-900 leading-tight mt-0.5">${o.alto_caja} cm</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-blue-50 text-[#005696] flex items-center justify-center shrink-0 border border-blue-100"><i class="fa-solid fa-scale-balanced text-lg"></i></div>
                      <div>
                        <p class="text-xs text-gray-500 font-semibold leading-tight">Peso Bruto</p>
                        <p class="text-sm font-bold text-gray-900 leading-tight mt-0.5">${o.peso_caja} kg</p>
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
                  <img src="imagenes/${o.sku}.jpg" alt="${o.nombre}" 
                       class="w-full h-full object-contain absolute inset-0 z-10 bg-white"
                       onerror="this.onerror=null; this.src='imagenes/${o.sku}.png'; this.onerror=function(){this.style.display='none'; this.nextElementSibling.classList.remove('hidden'); this.nextElementSibling.classList.add('flex');}"
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
                      <span class="text-[15px] font-mono font-bold text-gray-700 tracking-tight break-all">[${o.ean13}]</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-bold mb-2 uppercase">DUN14:</p>
                    <div class="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 shadow-inner">
                      <i class="fa-solid fa-barcode text-2xl text-[#005696]/60"></i>
                      <span class="text-[15px] font-mono font-bold text-gray-700 tracking-tight break-all">[${o.dun14}]</span>
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
                      <p class="text-4xl font-black text-[#005696] font-mono leading-none mt-1">${o.cajas_pallet}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-3xl font-black text-[#005696] font-mono leading-none mt-1">${c}<span class="text-sm font-bold text-gray-500 ml-1">KG</span></p>
                      <p class="text-[11px] text-gray-500 font-bold uppercase tracking-wide mt-1">Por Pallet</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-center gap-8 border-t border-gray-100 pt-5 px-2 mb-4">
                    <div class="text-center">
                      <p class="text-[11px] text-gray-500 font-bold uppercase">Cajas por Base:</p>
                      <p class="text-2xl font-bold text-gray-800 mt-1">${o.cajas_base}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-[11px] text-gray-500 font-bold uppercase">Camadas de Altura:</p>
                      <p class="text-2xl font-bold text-gray-800 mt-1">${o.altura_pallet}</p>
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
      `}}),r.innerHTML=n}function E(s){d.expandedRowSku===s?d.expandedRowSku=null:d.expandedRowSku=s,u()}function w(s){d.activeSortColumn===s?d.sortAscending=!d.sortAscending:(d.activeSortColumn=s,d.sortAscending=!0),u()}function L(){document.getElementById("db-modal").classList.remove("hidden")}function y(){document.getElementById("db-modal").classList.add("hidden")}window.toggleExpandRow=E;window.sortTable=w;function v(s){s.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT UNIQUE NOT NULL,
      nombre TEXT NOT NULL,
      peso_unidad REAL NOT NULL,
      cantidad_caja INTEGER NOT NULL,
      vencimiento TEXT NOT NULL,
      largo_caja REAL NOT NULL,
      ancho_caja REAL NOT NULL,
      alto_caja REAL NOT NULL,
      peso_caja REAL NOT NULL,
      ean13 TEXT NOT NULL,
      dun14 TEXT NOT NULL,
      cajas_base INTEGER NOT NULL,
      altura_pallet INTEGER NOT NULL,
      cajas_pallet INTEGER NOT NULL
    );
  `);const a=s.exec("SELECT COUNT(*) FROM productos");if((a[0]?a[0].values[0][0]:0)===0){const t=[["SKU-90214","Galletitas de Chocolate Rellenas 150g",.15,24,"12 Meses",38,26,18.5,3.9,"7790123456789","17790123456786",10,8,80],["SKU-88450","Caramelos Masticables Frutales (Bolsa)",.8,12,"18 Meses",40,30,25,10.2,"7790987654321","17790987654328",9,5,45],["SKU-77210","Obleas Rellenas Sabor Vainilla 200g",.2,20,"10 Meses",37,25,17.5,4.3,"7790112233445","17790112233442",10,8,80],["SKU-1004","Snacks Salados de Queso 100g",.1,36,"10 Meses",40,30,25,4.1,"7790040100408","17790040100405",9,6,54],["SKU-1005","Mermelada de Durazno Frasco 390g",.39,12,"24 Meses",32,21.5,14,7.2,"7790040100507","17790040100504",15,8,120],["SKU-1006","Turrón de Maní y Oblea 25g",.025,50,"12 Meses",28,18,12.5,1.45,"7790040100606","17790040100603",20,10,200],["SKU-1007","Salsa de Tomate Passata Tetra 520g",.52,18,"18 Meses",35,23,16,9.85,"7790040100705","17790040100702",11,8,88],["SKU-1009","Alfajor Triple Bon o Bon 60g",.06,30,"6 Meses",31,20,13.5,2.05,"7790040100903","17790040100900",16,9,144]],e=s.prepare(`
      INSERT INTO productos (
        sku, nombre, peso_unidad, cantidad_caja, vencimiento,
        largo_caja, ancho_caja, alto_caja, peso_caja,
        ean13, dun14, cajas_base, altura_pallet, cajas_pallet
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);for(const n of t)e.run(n);e.free()}}async function j(){var s;try{const a=await initSqlJs({locateFile:r=>`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${r}`});try{const r=await fetch("datos_logisticos.db"),t=(s=r.headers.get("content-type"))==null?void 0:s.includes("text/html");if(r.ok&&!t){const e=await r.arrayBuffer();if(!new TextDecoder().decode(e.slice(0,16)).startsWith("SQLite format 3"))throw new Error("El archivo no es una base de datos válida (magic header incorrecto)");d.db=new a.Database(new Uint8Array(e)),i("Base de datos datos_logisticos.db cargada con éxito","success")}else throw new Error("Archivo .db no encontrado o devuelto como HTML")}catch(r){console.warn("Fetch automático no encontró archivo local, creando DB en memoria:",r),d.db=new a.Database,v(d.db),i("Base de datos inicializada en memoria RAM","info")}u()}catch(a){console.error("Error al inicializar sql.js:",a),document.getElementById("drag-drop-fallback").classList.remove("hidden"),i("Fallo al iniciar SQLite WASM. Utiliza la zona de carga manual.","error")}}function k(s=""){if(!d.db)return[];let a="SELECT * FROM productos",r=[];if(s.trim()!==""){a+=" WHERE sku LIKE ? OR nombre LIKE ?";const t=`%${s.trim()}%`;r=[t,t]}a+=` ORDER BY ${d.activeSortColumn} ${d.sortAscending?"ASC":"DESC"}`;try{const t=d.db.prepare(a);t.bind(r);const e=[];for(;t.step();){const n=t.getAsObject();e.push(n)}return t.free(),e}catch(t){return console.error("Error al ejecutar SELECT:",t),[]}}function h(s){if(!s)return;const a=new FileReader;a.onload=async function(r){try{const t=new Uint8Array(r.target.result),e=await initSqlJs({locateFile:n=>`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${n}`});d.db=new e.Database(t),d.expandedRowSku=null,document.getElementById("drag-drop-fallback").classList.add("hidden"),y(),u(),i(`Base de datos '${s.name}' cargada correctamente`,"success")}catch(t){console.error("Error al parsear .db:",t),i("El archivo no es una base de datos SQLite válida","error")}},a.readAsArrayBuffer(s)}function T(){if(!d.productsList||d.productsList.length===0){i("No hay datos para exportar","error");return}const s=d.productsList.map(e=>({SKU:e.sku,"Nombre del Producto":e.nombre,"Peso Unidad (kg)":e.peso_unidad,"Cantidad por Caja (u)":e.cantidad_caja,Vencimiento:e.vencimiento,"Largo Caja (cm)":e.largo_caja,"Ancho Caja (cm)":e.ancho_caja,"Alto Caja (cm)":e.alto_caja,"Peso Bruto Caja (kg)":e.peso_caja,"Código EAN13":e.ean13,"Código DUN14":e.dun14,"Cajas por Base (Camada)":e.cajas_base,"Camadas Altura Pallet":e.altura_pallet,"Cajas Totales Pallet":e.cajas_pallet,"Peso Est. Pallet (kg)":(e.cajas_pallet*e.peso_caja).toFixed(1)})),a=XLSX.utils.json_to_sheet(s),r=[{wch:12},{wch:40},{wch:16},{wch:20},{wch:14},{wch:15},{wch:15},{wch:15},{wch:20},{wch:16},{wch:16},{wch:22},{wch:22},{wch:20},{wch:20}];a["!cols"]=r;const t=XLSX.utils.book_new();XLSX.utils.book_append_sheet(t,a,"Catálogo Logístico"),XLSX.writeFile(t,"catalogo_datos_logisticos.xlsx"),i("Archivo catalogo_datos_logisticos.xlsx generado con éxito","success")}function A(){if(d.db)try{const s=d.db.export(),a=new Blob([s],{type:"application/x-sqlite3"}),r=URL.createObjectURL(a),t=document.createElement("a");t.href=r,t.download="datos_logisticos.db",document.body.appendChild(t),t.click(),document.body.removeChild(t),URL.revokeObjectURL(r),i("Base de datos SQLite exportada como datos_logisticos.db","success")}catch(s){console.error("Error al exportar .db:",s),i("Error al exportar base de datos SQLite","error")}}document.addEventListener("DOMContentLoaded",()=>{var o,b,m,x,g,p,f;j();const s=document.getElementById("search-input"),a=document.getElementById("clear-search-btn");s&&s.addEventListener("input",l=>{l.target.value?a.classList.remove("hidden"):a.classList.add("hidden"),u()}),a&&a.addEventListener("click",()=>{s.value="",a.classList.add("hidden"),u()}),(o=document.getElementById("btn-open-db-modal"))==null||o.addEventListener("click",L),(b=document.getElementById("btn-close-db-modal"))==null||b.addEventListener("click",y),(m=document.getElementById("btn-export-excel"))==null||m.addEventListener("click",T),(x=document.getElementById("btn-download-db"))==null||x.addEventListener("click",A),[document.getElementById("modal-drop-zone"),document.getElementById("drag-drop-fallback")].forEach(l=>{l&&(l.addEventListener("dragover",c=>{c.preventDefault(),l.classList.add("border-[#005696]","bg-blue-50")}),l.addEventListener("dragleave",c=>{c.preventDefault(),l.classList.remove("border-[#005696]","bg-blue-50")}),l.addEventListener("drop",c=>{c.preventDefault(),l.classList.remove("border-[#005696]","bg-blue-50"),c.dataTransfer.files&&c.dataTransfer.files[0]&&h(c.dataTransfer.files[0])}))}),(g=document.getElementById("modal-drop-zone"))==null||g.addEventListener("click",()=>{var l;(l=document.getElementById("modal-file-input"))==null||l.click()}),(p=document.getElementById("modal-file-input"))==null||p.addEventListener("change",l=>{l.target.files&&l.target.files[0]&&h(l.target.files[0])}),(f=document.getElementById("db-file-input"))==null||f.addEventListener("change",l=>{l.target.files&&l.target.files[0]&&h(l.target.files[0])});const t=document.getElementById("btn-load-sample"),e=document.getElementById("btn-modal-load-sample"),n=async()=>{const l=await initSqlJs({locateFile:c=>`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${c}`});d.db=new l.Database,v(d.db),d.expandedRowSku=null,document.getElementById("drag-drop-fallback").classList.add("hidden"),y(),u(),i("Catálogo de datos logísticos restaurado con éxito","success")};t&&t.addEventListener("click",n),e&&e.addEventListener("click",n)});
