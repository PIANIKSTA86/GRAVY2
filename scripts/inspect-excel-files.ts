import XLSX from 'xlsx';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para inspeccionar la estructura de un archivo Excel
function inspectExcelFile(filePath: string) {
  console.log(`\n====================================`);
  console.log(`Inspeccionando: ${path.basename(filePath)}`);
  console.log(`====================================\n`);
  
  const workbook = XLSX.readFile(filePath);
  
  // Listar hojas
  console.log(`Hojas disponibles: ${workbook.SheetNames.join(', ')}\n`);
  
  // Inspeccionar cada hoja
  workbook.SheetNames.forEach(sheetName => {
    console.log(`--- Hoja: ${sheetName} ---`);
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    
    if (jsonData.length > 0) {
      console.log(`Total de registros: ${jsonData.length}`);
      console.log(`Columnas:`, Object.keys(jsonData[0]));
      console.log(`Primeros 3 registros:`);
      console.log(JSON.stringify(jsonData.slice(0, 3), null, 2));
    } else {
      console.log(`(Hoja vacía)`);
    }
    console.log('');
  });
}

// Inspeccionar archivos
const referenciaPath = path.join(__dirname, '..', 'Referencia');
const paisesFile = path.join(referenciaPath, 'paises.xlsx');
const municipiosFile = path.join(referenciaPath, 'Municipios.xlsx');

try {
  inspectExcelFile(paisesFile);
  inspectExcelFile(municipiosFile);
} catch (error) {
  console.error('Error al leer archivos:', error);
}
