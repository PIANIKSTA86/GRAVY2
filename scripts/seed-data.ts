/**
 * Script de Seed Data - ContaGrav2
 * Genera datos iniciales para desarrollo y demostración
 */

import { db } from "../server/db";
import {
  tenants,
  planCuentas,
  terceros,
  centrosCosto,
  periodosContables,
  asientos,
  lineasAsiento,
  niifPoliticas,
} from "../shared/schema";

function getInsertId(result: any): number {
  const insertId = (result as any)?.insertId ?? (Array.isArray(result) ? (result as any)[0]?.insertId : undefined);
  if (insertId === undefined || Number.isNaN(Number(insertId))) {
    throw new Error("No se pudo obtener insertId del resultado del insert");
  }
  return Number(insertId);
}

async function seedDatabase() {
  console.log("🌱 Iniciando seed de base de datos...\n");

  try {
    // 1. CREAR TENANT DE EJEMPLO
    console.log("📊 Creando empresa demo...");
    const tenantResult = await db.insert(tenants).values({
      nombre: "Comercializadora ABC S.A.S.",
      tipoEmpresa: "S.A.S.",
      grupoNiif: "2",
      monedaFuncional: "COP",
      responsableContable: "María Rodríguez"
    });
    const tenantId = getInsertId(tenantResult);
    console.log(`✓ Tenant creado con ID: ${tenantId}\n`);

    // 2. PLAN DE CUENTAS COMPLETO (PUC COLOMBIA SIMPLIFICADO)
    console.log("📚 Creando Plan de Cuentas...");
    
    const cuentas = [
      // CLASE 1 - ACTIVO
      { codigo: "1", nombre: "ACTIVO", nivel: 1, padreId: null, naturaleza: "D" },
      { codigo: "11", nombre: "DISPONIBLE", nivel: 2, padreId: null, naturaleza: "D" },
      { codigo: "1105", nombre: "CAJA", nivel: 4, padreId: null, naturaleza: "D", permiteTercero: false },
      { codigo: "110505", nombre: "Caja General", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "1110", nombre: "BANCOS", nivel: 4, padreId: null, naturaleza: "D", permiteTercero: true },
      { codigo: "111005", nombre: "Banco Comercial - Cuenta Corriente", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "111010", nombre: "Banco Nacional - Ahorros", nivel: 6, padreId: null, naturaleza: "D" },
      
      { codigo: "13", nombre: "DEUDORES", nivel: 2, padreId: null, naturaleza: "D" },
      { codigo: "1305", nombre: "CLIENTES", nivel: 4, padreId: null, naturaleza: "D", permiteTercero: true },
      { codigo: "130505", nombre: "Clientes Nacionales", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "1355", nombre: "ANTICIPO DE IMPUESTOS", nivel: 4, padreId: null, naturaleza: "D" },
      { codigo: "135515", nombre: "Retención en la Fuente", nivel: 6, padreId: null, naturaleza: "D" },
      
      { codigo: "15", nombre: "INVENTARIOS", nivel: 2, padreId: null, naturaleza: "D", categoriaNiif: "Inventarios", requiereDeterioro: true },
      { codigo: "1520", nombre: "MERCANCÍAS NO FABRICADAS", nivel: 4, padreId: null, naturaleza: "D" },
      { codigo: "152005", nombre: "Mercancía para la Venta", nivel: 6, padreId: null, naturaleza: "D" },
      
      { codigo: "16", nombre: "PROPIEDADES PLANTA Y EQUIPO", nivel: 2, padreId: null, naturaleza: "D", categoriaNiif: "PPE", metodoMedicion: "Costo", requiereDeterioro: true },
      { codigo: "1524", nombre: "EQUIPO DE OFICINA", nivel: 4, padreId: null, naturaleza: "D" },
      { codigo: "152405", nombre: "Muebles y Enseres", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "1528", nombre: "EQUIPO DE COMPUTACIÓN", nivel: 4, padreId: null, naturaleza: "D" },
      { codigo: "152805", nombre: "Equipos de Procesamiento de Datos", nivel: 6, padreId: null, naturaleza: "D" },
      
      // CLASE 2 - PASIVO
      { codigo: "2", nombre: "PASIVO", nivel: 1, padreId: null, naturaleza: "C" },
      { codigo: "23", nombre: "CUENTAS POR PAGAR", nivel: 2, padreId: null, naturaleza: "C" },
      { codigo: "2335", nombre: "COSTOS Y GASTOS POR PAGAR", nivel: 4, padreId: null, naturaleza: "C", permiteTercero: true },
      { codigo: "233505", nombre: "Gastos Financieros", nivel: 6, padreId: null, naturaleza: "C" },
      { codigo: "2365", nombre: "RETENCIÓN EN LA FUENTE", nivel: 4, padreId: null, naturaleza: "C" },
      { codigo: "236505", nombre: "Servicios", nivel: 6, padreId: null, naturaleza: "C" },
      { codigo: "2367", nombre: "IMPUESTO A LAS VENTAS RETENIDO", nivel: 4, padreId: null, naturaleza: "C" },
      { codigo: "236705", nombre: "IVA Retenido", nivel: 6, padreId: null, naturaleza: "C" },
      { codigo: "2380", nombre: "ACREEDORES VARIOS", nivel: 4, padreId: null, naturaleza: "C", permiteTercero: true },
      { codigo: "238005", nombre: "Proveedores", nivel: 6, padreId: null, naturaleza: "C" },
      
      { codigo: "24", nombre: "IMPUESTOS, GRAVÁMENES Y TASAS", nivel: 2, padreId: null, naturaleza: "C" },
      { codigo: "2408", nombre: "IMPUESTO SOBRE LAS VENTAS POR PAGAR", nivel: 4, padreId: null, naturaleza: "C" },
      { codigo: "240805", nombre: "IVA Generado", nivel: 6, padreId: null, naturaleza: "C" },
      
      // CLASE 3 - PATRIMONIO
      { codigo: "3", nombre: "PATRIMONIO", nivel: 1, padreId: null, naturaleza: "C" },
      { codigo: "31", nombre: "CAPITAL SOCIAL", nivel: 2, padreId: null, naturaleza: "C" },
      { codigo: "3105", nombre: "CAPITAL SUSCRITO Y PAGADO", nivel: 4, padreId: null, naturaleza: "C" },
      { codigo: "310505", nombre: "Capital Autorizado", nivel: 6, padreId: null, naturaleza: "C" },
      { codigo: "36", nombre: "RESULTADOS DEL EJERCICIO", nivel: 2, padreId: null, naturaleza: "C" },
      { codigo: "3605", nombre: "UTILIDAD DEL EJERCICIO", nivel: 4, padreId: null, naturaleza: "C" },
      
      // CLASE 4 - INGRESOS
      { codigo: "4", nombre: "INGRESOS", nivel: 1, padreId: null, naturaleza: "C" },
      { codigo: "41", nombre: "OPERACIONALES", nivel: 2, padreId: null, naturaleza: "C" },
      { codigo: "4135", nombre: "COMERCIO AL POR MAYOR Y MENOR", nivel: 4, padreId: null, naturaleza: "C" },
      { codigo: "413505", nombre: "Venta de Mercancías", nivel: 6, padreId: null, naturaleza: "C" },
      { codigo: "413510", nombre: "Venta de Servicios", nivel: 6, padreId: null, naturaleza: "C" },
      
      { codigo: "42", nombre: "NO OPERACIONALES", nivel: 2, padreId: null, naturaleza: "C" },
      { codigo: "4210", nombre: "FINANCIEROS", nivel: 4, padreId: null, naturaleza: "C" },
      { codigo: "421005", nombre: "Intereses", nivel: 6, padreId: null, naturaleza: "C" },
      
      // CLASE 5 - GASTOS
      { codigo: "5", nombre: "GASTOS", nivel: 1, padreId: null, naturaleza: "D" },
      { codigo: "51", nombre: "OPERACIONALES DE ADMINISTRACIÓN", nivel: 2, padreId: null, naturaleza: "D" },
      { codigo: "5105", nombre: "GASTOS DE PERSONAL", nivel: 4, padreId: null, naturaleza: "D", permiteCentroCosto: true },
      { codigo: "510506", nombre: "Sueldos", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "510527", nombre: "Auxilio de Transporte", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "5110", nombre: "HONORARIOS", nivel: 4, padreId: null, naturaleza: "D", permiteTercero: true },
      { codigo: "511010", nombre: "Asesoría Jurídica", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "511015", nombre: "Asesoría Contable", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "5115", nombre: "ARRENDAMIENTOS", nivel: 4, padreId: null, naturaleza: "D" },
      { codigo: "511505", nombre: "Arrendamiento Oficinas", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "5120", nombre: "SERVICIOS", nivel: 4, padreId: null, naturaleza: "D" },
      { codigo: "512005", nombre: "Aseo y Vigilancia", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "512010", nombre: "Energía Eléctrica", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "512015", nombre: "Teléfono", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "512020", nombre: "Internet", nivel: 6, padreId: null, naturaleza: "D" },
      
      { codigo: "52", nombre: "OPERACIONALES DE VENTAS", nivel: 2, padreId: null, naturaleza: "D" },
      { codigo: "5205", nombre: "GASTOS DE PERSONAL", nivel: 4, padreId: null, naturaleza: "D", permiteCentroCosto: true },
      { codigo: "520506", nombre: "Comisiones", nivel: 6, padreId: null, naturaleza: "D" },
      
      { codigo: "53", nombre: "NO OPERACIONALES", nivel: 2, padreId: null, naturaleza: "D" },
      { codigo: "5305", nombre: "FINANCIEROS", nivel: 4, padreId: null, naturaleza: "D" },
      { codigo: "530505", nombre: "Gastos Bancarios", nivel: 6, padreId: null, naturaleza: "D" },
      { codigo: "530515", nombre: "Comisiones", nivel: 6, padreId: null, naturaleza: "D" },
      
      // CLASE 6 - COSTO DE VENTAS
      { codigo: "6", nombre: "COSTOS DE VENTAS", nivel: 1, padreId: null, naturaleza: "D" },
      { codigo: "61", nombre: "COSTO DE VENTAS Y PRESTACIÓN DE SERVICIOS", nivel: 2, padreId: null, naturaleza: "D" },
      { codigo: "6135", nombre: "COMERCIO AL POR MAYOR Y MENOR", nivel: 4, padreId: null, naturaleza: "D" },
      { codigo: "613505", nombre: "Costo de Mercancías Vendidas", nivel: 6, padreId: null, naturaleza: "D" }
    ];

    for (const cuenta of cuentas) {
      await db.insert(planCuentas).values({
        tenantId,
        ...cuenta,
        permiteTercero: cuenta.permiteTercero ?? false,
        permiteCentroCosto: cuenta.permiteCentroCosto ?? false,
        categoriaNiif: cuenta.categoriaNiif ?? null,
        metodoMedicion: cuenta.metodoMedicion ?? null,
        requiereDeterioro: cuenta.requiereDeterioro ?? false
      });
    }
    console.log(`✓ ${cuentas.length} cuentas creadas\n`);

    // 3. TERCEROS (CLIENTES Y PROVEEDORES)
    console.log("👥 Creando terceros...");
    
    const tercerosList = [
      {
        identificacion: "900123456-7",
        nombre: "DISTRIBUIDORA LA MEGA S.A.S.",
        tipo: "Proveedor",
        vinculoEconomico: "Nacional",
        parteRelacionada: false
      },
      {
        identificacion: "800234567-8",
        nombre: "SUMINISTROS OFFICE LTDA",
        tipo: "Proveedor",
        vinculoEconomico: "Nacional",
        parteRelacionada: false
      },
      {
        identificacion: "79123456-1",
        nombre: "JUAN CARLOS PÉREZ",
        tipo: "Cliente",
        vinculoEconomico: "Nacional",
        parteRelacionada: false
      },
      {
        identificacion: "52345678-9",
        nombre: "MARÍA LÓPEZ HERNÁNDEZ",
        tipo: "Cliente",
        vinculoEconomico: "Nacional",
        parteRelacionada: false
      },
      {
        identificacion: "900345678-9",
        nombre: "CORPORACIÓN XYZ S.A.",
        tipo: "Cliente",
        vinculoEconomico: "Nacional",
        parteRelacionada: false
      },
      {
        identificacion: "890456789-0",
        nombre: "SERVICIOS CONTABLES PRO",
        tipo: "Proveedor",
        vinculoEconomico: "Nacional",
        parteRelacionada: false
      }
    ];

    for (const tercero of tercerosList) {
      await db.insert(terceros).values({ tenantId, ...tercero });
    }
    console.log(`✓ ${tercerosList.length} terceros creados\n`);

    // 4. CENTROS DE COSTO
    console.log("🏢 Creando centros de costo...");
    
    const centros = [
      { codigo: "ADM-01", nombre: "Administración General", categoriaDistribucion: "Administrativo" },
      { codigo: "VEN-01", nombre: "Departamento de Ventas", categoriaDistribucion: "Comercial" },
      { codigo: "OPE-01", nombre: "Operaciones", categoriaDistribucion: "Operativo" }
    ];

    for (const centro of centros) {
      await db.insert(centrosCosto).values({ tenantId, ...centro });
    }
    console.log(`✓ ${centros.length} centros de costo creados\n`);

    // 5. PERÍODO CONTABLE
    console.log("📅 Creando período contable...");
    
    await db.insert(periodosContables).values({
      tenantId,
      fechaInicio: new Date("2026-01-01"),
      fechaFin: new Date("2026-12-31"),
      cerrado: false,
      cierreNiifRealizado: false
    });
    console.log("✓ Período 2026 creado\n");

    // 6. POLÍTICAS NIIF
    console.log("📋 Creando políticas NIIF...");
    
    const politicas = [
      {
        modulo: "Inventarios",
        metodoMedicion: "Promedio Ponderado",
        cuentasAsociadas: "1520,613505"
      },
      {
        modulo: "Propiedad Planta y Equipo",
        metodoMedicion: "Costo",
        cuentasAsociadas: "16,1592"
      },
      {
        modulo: "Deudores Comerciales",
        metodoMedicion: "Costo Amortizado",
        cuentasAsociadas: "1305,5313"
      }
    ];

    for (const politica of politicas) {
      await db.insert(niifPoliticas).values({ tenantId, ...politica });
    }
    console.log(`✓ ${politicas.length} políticas NIIF creadas\n`);

    // 7. ASIENTO DE APERTURA
    console.log("📝 Creando asiento de apertura...");
    
    const asientoApertura = await db.insert(asientos).values({
      tenantId,
      fecha: new Date("2026-01-01"),
      tipoComprobante: "Apertura",
      numero: "AP-001",
      descripcion: "Asiento de Apertura - Aporte Inicial de Socios",
      estado: "Aprobado",
      eventoNiif: "Reconocimiento Inicial de Capital",
      moduloOrigen: "CONTABILIDAD",
      usuarioCreacion: "admin"
    });
    const asientoId = getInsertId(asientoApertura);

    await db.insert(lineasAsiento).values([
      {
        asientoId,
        tenantId,
        cuentaId: 6, // 111005 - Banco Comercial
        debito: "50000000",
        credito: "0",
        detalle: "Aporte en efectivo - Capital Social"
      },
      {
        asientoId,
        tenantId,
        cuentaId: 37, // 310505 - Capital Autorizado
        debito: "0",
        credito: "50000000",
        detalle: "Reconocimiento capital suscrito y pagado"
      }
    ]);
    console.log("✓ Asiento de apertura creado\n");

    // 8. ASIENTO DE COMPRA DE INVENTARIO
    console.log("📦 Creando asiento de compra...");
    
    const asientoCompra = await db.insert(asientos).values({
      tenantId,
      fecha: new Date("2026-01-05"),
      tipoComprobante: "Compra",
      numero: "COM-001",
      descripcion: "Compra de mercancía a crédito",
      estado: "Aprobado",
      eventoNiif: "Adquisición de Inventarios",
      moduloOrigen: "INVENTARIO",
      usuarioCreacion: "admin"
    });
    const asientoCompraId = getInsertId(asientoCompra);

    await db.insert(lineasAsiento).values([
      {
        asientoId: asientoCompraId,
        tenantId,
        cuentaId: 15, // 152005 - Mercancía para la Venta
        debito: "10000000",
        credito: "0",
        detalle: "Compra de mercancía según factura 1234",
        productoId: 1,
        cantidad: "100",
        costoUnitario: "100000"
      },
      {
        asientoId: asientoCompraId,
        tenantId,
        cuentaId: 11, // 135515 - Retención en la Fuente
        debito: "250000",
        credito: "0",
        detalle: "Retención fuente 2.5%"
      },
      {
        asientoId: asientoCompraId,
        tenantId,
        cuentaId: 27, // 238005 - Proveedores
        debito: "0",
        credito: "10250000",
        detalle: "Cuenta por pagar proveedor"
      }
    ]);
    console.log("✓ Asiento de compra creado\n");

    // 9. ASIENTO DE VENTA
    console.log("💰 Creando asiento de venta...");
    
    const asientoVenta = await db.insert(asientos).values({
      tenantId,
      fecha: new Date("2026-01-10"),
      tipoComprobante: "Ingreso",
      numero: "ING-001",
      descripcion: "Venta de mercancía de contado + IVA",
      estado: "Aprobado",
      eventoNiif: "Reconocimiento de Ingresos",
      moduloOrigen: "VENTAS",
      usuarioCreacion: "admin"
    });
    const asientoVentaId = getInsertId(asientoVenta);

    await db.insert(lineasAsiento).values([
      {
        asientoId: asientoVentaId,
        tenantId,
        cuentaId: 6, // 111005 - Banco
        debito: "5950000",
        credito: "0",
        detalle: "Recaudo venta mercancía"
      },
      {
        asientoId: asientoVentaId,
        tenantId,
        cuentaId: 42, // 413505 - Venta de Mercancías
        debito: "0",
        credito: "5000000",
        detalle: "Ingreso por venta"
      },
      {
        asientoId: asientoVentaId,
        tenantId,
        cuentaId: 31, // 240805 - IVA Generado
        debito: "0",
        credito: "950000",
        detalle: "IVA 19% sobre venta"
      }
    ]);

    // Costo de venta
    const asientoCosto = await db.insert(asientos).values({
      tenantId,
      fecha: new Date("2026-01-10"),
      tipoComprobante: "Costo",
      numero: "COS-001",
      descripcion: "Reconocimiento costo de venta",
      estado: "Aprobado",
      eventoNiif: "Reconocimiento de Costos",
      moduloOrigen: "INVENTARIO",
      usuarioCreacion: "admin"
    });
    const asientoCostoId = getInsertId(asientoCosto);

    await db.insert(lineasAsiento).values([
      {
        asientoId: asientoCostoId,
        tenantId,
        cuentaId: 69, // 613505 - Costo de Mercancías
        debito: "3000000",
        credito: "0",
        detalle: "Costo de venta",
        productoId: 1,
        cantidad: "30",
        costoUnitario: "100000"
      },
      {
        asientoId: asientoCostoId,
        tenantId,
        cuentaId: 15, // 152005 - Inventario
        debito: "0",
        credito: "3000000",
        detalle: "Salida de inventario"
      }
    ]);
    console.log("✓ Asiento de venta y costo creados\n");

    // 10. ASIENTO DE GASTOS
    console.log("💸 Creando asiento de gastos...");
    
    const asientoGasto = await db.insert(asientos).values({
      tenantId,
      fecha: new Date("2026-01-15"),
      tipoComprobante: "Egreso",
      numero: "EGR-001",
      descripcion: "Pago de servicios del mes",
      estado: "Aprobado",
      eventoNiif: "Reconocimiento de Gastos",
      moduloOrigen: "CONTABILIDAD",
      usuarioCreacion: "admin"
    });
    const asientoGastoId = getInsertId(asientoGasto);

    await db.insert(lineasAsiento).values([
      {
        asientoId: asientoGastoId,
        tenantId,
        cuentaId: 55, // 511505 - Arrendamiento
        debito: "2000000",
        credito: "0",
        detalle: "Arriendo oficina enero",
        centroCostoId: 1
      },
      {
        asientoId: asientoGastoId,
        tenantId,
        cuentaId: 57, // 512010 - Energía
        debito: "300000",
        credito: "0",
        detalle: "Energía eléctrica enero",
        centroCostoId: 1
      },
      {
        asientoId: asientoGastoId,
        tenantId,
        cuentaId: 59, // 512020 - Internet
        debito: "150000",
        credito: "0",
        detalle: "Internet y comunicaciones",
        centroCostoId: 1
      },
      {
        asientoId: asientoGastoId,
        tenantId,
        cuentaId: 6, // 111005 - Banco
        debito: "0",
        credito: "2450000",
        detalle: "Pago servicios"
      }
    ]);
    console.log("✓ Asiento de gastos creado\n");

    console.log("✅ SEED COMPLETADO EXITOSAMENTE!\n");
    console.log("📊 Resumen:");
    console.log(`   - 1 Empresa creada`);
    console.log(`   - ${cuentas.length} Cuentas contables`);
    console.log(`   - ${tercerosList.length} Terceros`);
    console.log(`   - ${centros.length} Centros de costo`);
    console.log(`   - 1 Período contable`);
    console.log(`   - ${politicas.length} Políticas NIIF`);
    console.log(`   - 6 Asientos contables con múltiples líneas`);
    console.log("\n🚀 La base de datos está lista para usar!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  }
}

// Ejecutar seed
seedDatabase();
