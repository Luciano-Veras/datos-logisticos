import { state } from './store.js';
import { 
  initDatabase, 
  seedSampleData, 
  loadDatabaseFromFile 
} from './database.js';
import { 
  renderProductsTable, 
  openDbModal, 
  closeDbModal, 
  showToast 
} from './ui.js';
import { exportToExcel, downloadDatabaseBinary } from './export.js';

document.addEventListener('DOMContentLoaded', () => {
  initDatabase();

  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      if (e.target.value) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
      renderProductsTable();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      renderProductsTable();
    });
  }

      
  document.getElementById('btn-open-db-modal')?.addEventListener('click', openDbModal);
  document.getElementById('btn-close-db-modal')?.addEventListener('click', closeDbModal);

  document.getElementById('btn-export-excel')?.addEventListener('click', exportToExcel);
  document.getElementById('btn-download-db')?.addEventListener('click', downloadDatabaseBinary);

  
  
  const dropZones = [document.getElementById('modal-drop-zone'), document.getElementById('drag-drop-fallback')];
  dropZones.forEach(dz => {
    if (!dz) return;
    dz.addEventListener('dragover', (e) => {
      e.preventDefault();
      dz.classList.add('border-[#005696]', 'bg-blue-50');
    });
    dz.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dz.classList.remove('border-[#005696]', 'bg-blue-50');
    });
    dz.addEventListener('drop', (e) => {
      e.preventDefault();
      dz.classList.remove('border-[#005696]', 'bg-blue-50');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadDatabaseFromFile(e.dataTransfer.files[0]);
      }
    });
  });

  document.getElementById('modal-drop-zone')?.addEventListener('click', () => {
    document.getElementById('modal-file-input')?.click();
  });
  document.getElementById('modal-file-input')?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadDatabaseFromFile(e.target.files[0]);
    }
  });

  document.getElementById('db-file-input')?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadDatabaseFromFile(e.target.files[0]);
    }
  });

  const restoreBtn = document.getElementById('btn-load-sample');
  const modalRestoreBtn = document.getElementById('btn-modal-load-sample');

  const handleRestore = async () => {
    const SQL = await initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
    });
    state.db = new SQL.Database();
    seedSampleData(state.db);
    state.expandedRowSku = null;
    document.getElementById('drag-drop-fallback').classList.add('hidden');
    closeDbModal();
    renderProductsTable();
    showToast('Catálogo de datos logísticos restaurado con éxito', 'success');
  };

  if (restoreBtn) restoreBtn.addEventListener('click', handleRestore);
  if (modalRestoreBtn) modalRestoreBtn.addEventListener('click', handleRestore);
});
