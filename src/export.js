import { state } from './store.js';
import { showToast } from './ui.js';

export function exportToExcel() {
  if (!state.productsList || state.productsList.length === 0) {
    showToast('No hay datos para exportar', 'error');
    return;
  }

  const excelData = state.productsList.map(p => ({
    'SKU': p.sku,
    'Nombre del Producto': p.nombre,
    'Peso Unidad (kg)': p.peso_unidad,
    'Cantidad por Caja (u)': p.cantidad_caja,
    'Vencimiento': p.vencimiento,
    'Largo Caja (cm)': p.largo_caja,
    'Ancho Caja (cm)': p.ancho_caja,
    'Alto Caja (cm)': p.alto_caja,
    'Peso Bruto Caja (kg)': p.peso_caja,
    'Código EAN13': p.ean13,
    'Código DUN14': p.dun14,
    'Cajas por Base (Camada)': p.cajas_base,
    'Camadas Altura Pallet': p.altura_pallet,
    'Cajas Totales Pallet': p.cajas_pallet,
    'Peso Est. Pallet (kg)': (p.cajas_pallet * p.peso_caja).toFixed(1)
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  const colWidths = [
    { wch: 12 }, { wch: 40 }, { wch: 16 }, { wch: 20 }, { wch: 14 },
    { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
    { wch: 16 }, { wch: 16 }, { wch: 22 }, { wch: 22 }, { wch: 20 }, { wch: 20 }
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Catálogo Logístico');

  XLSX.writeFile(workbook, 'catalogo_datos_logisticos.xlsx');
  showToast('Archivo catalogo_datos_logisticos.xlsx generado con éxito', 'success');
}

export function downloadDatabaseBinary() {
  if (!state.db) return;
  try {
    const binaryArray = state.db.export();
    const blob = new Blob([binaryArray], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos_logisticos.db';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Base de datos SQLite exportada como datos_logisticos.db', 'success');
  } catch (err) {
    console.error('Error al exportar .db:', err);
    showToast('Error al exportar base de datos SQLite', 'error');
  }
}
