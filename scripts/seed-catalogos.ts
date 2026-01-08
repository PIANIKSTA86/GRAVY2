import XLSX from 'xlsx';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../server/db';
import { paises, departamentos, municipios } from '@shared/schema';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PaisRow {
  'Codigo Pais': string;
  'nombre Pais': string;
}

interface MunicipioRow {
  'Codigo Departamento': string;
  'Nombre Departamento': string;
  'Codigo del Municipio': string;
  'Nombre Municipio': string;
  'Codigo Postal': string;
}

async function seedCatalogos() {
  console.log('🌍 Iniciando carga de catálogos geográficos...\n');

  const referenciaPath = path.join(__dirname, '..', 'Referencia');
  const paisesFile = path.join(referenciaPath, 'paises.xlsx');
  const municipiosFile = path.join(referenciaPath, 'Municipios.xlsx');

  try {
    // 1. CARGAR PAÍSES
    console.log('📋 Cargando países...');
    const paisesWorkbook = XLSX.readFile(paisesFile);
    const paisesSheet = paisesWorkbook.Sheets['PAISES'];
    const paisesData = XLSX.utils.sheet_to_json<PaisRow>(paisesSheet);

    let paisesInserted = 0;
    let paisesUpdated = 0;

    for (const row of paisesData) {
      const codigo = row['Codigo Pais']?.trim();
      const nombre = row['nombre Pais']?.trim();

      if (!codigo || !nombre) continue;

      // Verificar si existe
      const existing = await db.select().from(paises).where(eq(paises.codigo, codigo));

      if (existing.length > 0) {
        // Actualizar
        await db.update(paises)
          .set({ nombre, activo: true })
          .where(eq(paises.codigo, codigo));
        paisesUpdated++;
      } else {
        // Insertar
        await db.insert(paises).values({
          codigo,
          nombre,
          activo: true,
        });
        paisesInserted++;
      }
    }

    console.log(`✅ Países: ${paisesInserted} insertados, ${paisesUpdated} actualizados\n`);

    // 2. CARGAR MUNICIPIOS (incluye departamentos)
    console.log('📋 Cargando departamentos y municipios...');
    const municipiosWorkbook = XLSX.readFile(municipiosFile);
    const municipiosSheet = municipiosWorkbook.Sheets['MunicipiosDANE'];
    const municipiosData = XLSX.utils.sheet_to_json<MunicipioRow>(municipiosSheet);

    // Extraer departamentos únicos
    const dptosMap = new Map<string, string>();
    municipiosData.forEach(row => {
      const codigoDpto = row['Codigo Departamento']?.toString().trim();
      const nombreDpto = row['Nombre Departamento']?.trim();
      if (codigoDpto && nombreDpto && !dptosMap.has(codigoDpto)) {
        dptosMap.set(codigoDpto, nombreDpto);
      }
    });

    let dptosInserted = 0;
    let dptosUpdated = 0;

    // Insertar/actualizar departamentos
    for (const [codigo, nombre] of dptosMap) {
      const existing = await db.select().from(departamentos).where(eq(departamentos.codigo, codigo));

      if (existing.length > 0) {
        await db.update(departamentos)
          .set({ nombre, activo: true })
          .where(eq(departamentos.codigo, codigo));
        dptosUpdated++;
      } else {
        await db.insert(departamentos).values({
          codigo,
          nombre,
          paisCodigo: 'CO',
          activo: true,
        });
        dptosInserted++;
      }
    }

    console.log(`✅ Departamentos: ${dptosInserted} insertados, ${dptosUpdated} actualizados`);

    // Insertar/actualizar municipios
    let mpiosInserted = 0;
    let mpiosUpdated = 0;

    for (const row of municipiosData) {
      const codigo = row['Codigo del Municipio']?.toString().trim();
      const nombre = row['Nombre Municipio']?.trim();
      const departamentoCodigo = row['Codigo Departamento']?.toString().trim();
      const codigoPostal = row['Codigo Postal']?.toString().trim() || null;

      if (!codigo || !nombre || !departamentoCodigo) continue;

      const existing = await db.select().from(municipios).where(eq(municipios.codigo, codigo));

      if (existing.length > 0) {
        await db.update(municipios)
          .set({ nombre, departamentoCodigo, codigoPostal, activo: true })
          .where(eq(municipios.codigo, codigo));
        mpiosUpdated++;
      } else {
        await db.insert(municipios).values({
          codigo,
          nombre,
          departamentoCodigo,
          codigoPostal,
          activo: true,
        });
        mpiosInserted++;
      }
    }

    console.log(`✅ Municipios: ${mpiosInserted} insertados, ${mpiosUpdated} actualizados\n`);

    console.log('🎉 Carga de catálogos completada exitosamente!');
    console.log('─────────────────────────────────────────────');
    console.log(`Total países: ${paisesInserted + paisesUpdated}`);
    console.log(`Total departamentos: ${dptosInserted + dptosUpdated}`);
    console.log(`Total municipios: ${mpiosInserted + mpiosUpdated}`);

  } catch (error) {
    console.error('❌ Error al cargar catálogos:', error);
    throw error;
  }
}

// Ejecutar seed
seedCatalogos()
  .then(() => {
    console.log('\n✨ Proceso finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
