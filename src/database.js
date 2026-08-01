import { state } from './store.js';
import { showToast, renderProductsTable, closeDbModal } from './ui.js';

export function seedSampleData(database) {
  database.run(`
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
  `);

  const res = database.exec("SELECT COUNT(*) FROM productos");
  const count = res[0] ? res[0].values[0][0] : 0;

  if (count === 0) {
    const samples = [
      ['SKU-90214', 'Galletitas de Chocolate Rellenas 150g', 0.150, 24, '12 Meses', 38.0, 26.0, 18.5, 3.90, '7790123456789', '17790123456786', 10, 8, 80],
      ['SKU-88450', 'Caramelos Masticables Frutales (Bolsa)', 0.800, 12, '18 Meses', 40.0, 30.0, 25.0, 10.20, '7790987654321', '17790987654328', 9, 5, 45],
      ['SKU-77210', 'Obleas Rellenas Sabor Vainilla 200g', 0.200, 20, '10 Meses', 37.0, 25.0, 17.5, 4.30, '7790112233445', '17790112233442', 10, 8, 80],
      ['SKU-1004', 'Snacks Salados de Queso 100g', 0.100, 36, '10 Meses', 40.0, 30.0, 25.0, 4.10, '7790040100408', '17790040100405', 9, 6, 54],
      ['SKU-1005', 'Mermelada de Durazno Frasco 390g', 0.390, 12, '24 Meses', 32.0, 21.5, 14.0, 7.20, '7790040100507', '17790040100504', 15, 8, 120],
      ['SKU-1006', 'Turrón de Maní y Oblea 25g', 0.025, 50, '12 Meses', 28.0, 18.0, 12.5, 1.45, '7790040100606', '17790040100603', 20, 10, 200],
      ['SKU-1007', 'Salsa de Tomate Passata Tetra 520g', 0.520, 18, '18 Meses', 35.0, 23.0, 16.0, 9.85, '7790040100705', '17790040100702', 11, 8, 88],
      ['SKU-1009', 'Alfajor Triple Bon o Bon 60g', 0.060, 30, '6 Meses', 31.0, 20.0, 13.5, 2.05, '7790040100903', '17790040100900', 16, 9, 144]
    ];

    const stmt = database.prepare(`
      INSERT INTO productos (
        sku, nombre, peso_unidad, cantidad_caja, vencimiento,
        largo_caja, ancho_caja, alto_caja, peso_caja,
        ean13, dun14, cajas_base, altura_pallet, cajas_pallet
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const s of samples) {
      stmt.run(s);
    }
    stmt.free();
  }
}

export async function initDatabase() {
  try {
    const SQL = await initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
    });

    try {
      const response = await fetch('datos_logisticos.db');
      const isHtml = response.headers.get('content-type')?.includes('text/html');
      
      if (response.ok && !isHtml) {
        const buffer = await response.arrayBuffer();
        
        // Verificar que sea realmente una base de datos SQLite (magic header)
        const header = new TextDecoder().decode(buffer.slice(0, 16));
        if (!header.startsWith("SQLite format 3")) {
          throw new Error("El archivo no es una base de datos válida (magic header incorrecto)");
        }
        
        state.db = new SQL.Database(new Uint8Array(buffer));
        showToast('Base de datos datos_logisticos.db cargada con éxito', 'success');
      } else {
        throw new Error('Archivo .db no encontrado o devuelto como HTML');
      }
    } catch (fetchErr) {
      console.warn('Fetch automático no encontró archivo local, creando DB en memoria:', fetchErr);
      state.db = new SQL.Database();
      seedSampleData(state.db);
      showToast('Base de datos inicializada en memoria RAM', 'info');
    }

    renderProductsTable();
  } catch (err) {
    console.error('Error al inicializar sql.js:', err);
    document.getElementById('drag-drop-fallback').classList.remove('hidden');
    showToast('Fallo al iniciar SQLite WASM. Utiliza la zona de carga manual.', 'error');
  }
}

export function queryProducts(searchTerm = '') {
  if (!state.db) return [];

  let sql = `SELECT * FROM productos`;
  let params = [];

  if (searchTerm.trim() !== '') {
    sql += ` WHERE sku LIKE ? OR nombre LIKE ?`;
    const term = `%${searchTerm.trim()}%`;
    params = [term, term];
  }

  sql += ` ORDER BY ${state.activeSortColumn} ${state.sortAscending ? 'ASC' : 'DESC'}`;

  try {
    const stmt = state.db.prepare(sql);
    stmt.bind(params);

    const rows = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      rows.push(row);
    }
    stmt.free();
    return rows;
  } catch (err) {
    console.error('Error al ejecutar SELECT:', err);
    return [];
  }
}

export function loadDatabaseFromFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const Uints = new Uint8Array(e.target.result);
      const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
      });
      state.db = new SQL.Database(Uints);
      state.expandedRowSku = null;
      document.getElementById('drag-drop-fallback').classList.add('hidden');
      closeDbModal();
      renderProductsTable();
      showToast(`Base de datos '${file.name}' cargada correctamente`, 'success');
    } catch (err) {
      console.error('Error al parsear .db:', err);
      showToast('El archivo no es una base de datos SQLite válida', 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

// Para usarla desde drag/drop que no está en módulos si hiciera falta, aunque lo conectaremos en main.js
