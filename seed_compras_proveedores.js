// ============================================================
// SEED SCRIPT - Proveedores, Compras y DetalleCompras
// Colecciones: proveedores, Compras, DetalleCompras
// Base de datos: seged
// ============================================================

db = db.getSiblingDB('seged');

print("🧹 Limpiando colecciones de proveedores y compras previas...");
db.proveedores.deleteMany({});
db.Compras.deleteMany({});
db.DetalleCompras.deleteMany({});

print("🛒 Cargando productos existentes...");
const productos = db.Productos.find().toArray();
if (productos.length === 0) {
  print("❌ No hay productos en la base de datos. Por favor ejecuta seed_productos.js primero.");
  quit(1);
}

// Helper para fechas aleatorias entre inicio y fin
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Parámetros de fechas
const endDate = new Date(); // now
const startDate = new Date();
startDate.setFullYear(endDate.getFullYear() - 1); // un año atrás

// ============================================================
// 1. GENERAR PROVEEDORES
// ============================================================
print("🏭 Generando proveedores...");
const proveedoresList = [
    { nombre: "TechCorp", nit: "900123456-1", correo: "contacto@techcorp.com", celular: "3001234567", direccion: "Calle 123 # 45-67" },
    { nombre: "DistriGlobal", nit: "800987654-2", correo: "ventas@distriglobal.com", celular: "3109876543", direccion: "Cra 50 # 10-20" },
    { nombre: "Insumos Express", nit: "901345678-3", correo: "hola@insumosexpress.com", celular: "3203456789", direccion: "Av Siempre Viva 742" },
    { nombre: "ElectroMayor", nit: "802555666-4", correo: "gerencia@electromayor.com", celular: "3155556666", direccion: "Centro Comercial Tech Local 101" },
    { nombre: "Proveedora Central", nit: "900777888-5", correo: "info@proveedoracentral.com", celular: "3017778888", direccion: "Zona Industrial Lote 5" }
];

const proveedoresToInsert = proveedoresList.map(p => ({
    _id: new ObjectId(),
    nombreProveedor: p.nombre,
    nit: p.nit,
    correo: p.correo,
    celular: p.celular,
    direccion: p.direccion
}));

db.proveedores.insertMany(proveedoresToInsert);
print(`✅ ${proveedoresToInsert.length} proveedores insertados.`);

// ============================================================
// 2. GENERAR COMPRAS Y DETALLE COMPRAS
// ============================================================
const numCompras = 300;
const metodosPago = ["EFECTIVO", "TARJETA_CREDITO", "TRANSFERENCIA", "CHEQUE"];
const estados = ["RECIBIDA", "RECIBIDA", "RECIBIDA", "PENDIENTE", "CANCELADA"];
const tipos = ["FACTURA", "REMISION"];

const comprasToInsert = [];
const detallesToInsert = [];

print(`📦 Generando ${numCompras} compras...`);

for (let i = 1; i <= numCompras; i++) {
  const fechaCompra = getRandomDate(startDate, endDate);
  const compraId = new ObjectId();
  
  // Seleccionar proveedor aleatorio
  const proveedor = proveedoresToInsert[Math.floor(Math.random() * proveedoresToInsert.length)];
  
  const numItems = Math.floor(Math.random() * 8) + 1;
  let subTotalCompra = 0;
  let totalDescuentosCompra = 0;
  
  const detallesEstaCompra = [];
  
  // Para evitar productos duplicados en la misma compra
  const productosSeleccionados = new Set();
  
  for (let j = 0; j < numItems; j++) {
    let prodIndex = Math.floor(Math.random() * productos.length);
    while(productosSeleccionados.has(prodIndex)) {
        prodIndex = Math.floor(Math.random() * productos.length);
    }
    productosSeleccionados.add(prodIndex);
    
    const producto = productos[prodIndex];
    
    // Cantidad a comprar suele ser mayor que en ventas
    const cantidad = Math.floor(Math.random() * 50) + 10; 
    
    // El precio de compra al proveedor es menor que el precio de venta (ej. 60-80% del precio de venta)
    const margen = (Math.floor(Math.random() * 20) + 60) / 100;
    const precioUnitario = parseFloat((producto.preciounitario * margen).toFixed(2));
    
    const tieneDescuento = Math.random() > 0.7; // 30% probabilidad de descuento
    const descuentoPorcentaje = tieneDescuento ? (Math.floor(Math.random() * 15) + 5) : 0;
    const valorDescuentoLinea = parseFloat(((precioUnitario * cantidad) * (descuentoPorcentaje / 100)).toFixed(2));
    
    const subtotalLinea = parseFloat(((precioUnitario * cantidad) - valorDescuentoLinea).toFixed(2));
    
    subTotalCompra += (precioUnitario * cantidad);
    totalDescuentosCompra += valorDescuentoLinea;
    
    const detalleId = new ObjectId();
    detallesEstaCompra.push({
      _id: detalleId,
      compra_id: compraId.toString(),
      producto_id: producto._id.toString(),
      cantidad: cantidad,
      precioUnitario: precioUnitario,
      descuentos: {
        tipo: tieneDescuento ? "PORCENTAJE" : "NINGUNO",
        valor: tieneDescuento ? descuentoPorcentaje : 0
      },
      subtotal: subtotalLinea
    });
  }
  
  const baseImponible = subTotalCompra - totalDescuentosCompra;
  const impuestos = parseFloat((baseImponible * 0.19).toFixed(2)); // IVA 19%
  const total = parseFloat((baseImponible + impuestos).toFixed(2));
  
  const compra = {
    _id: compraId,
    proveedor_id: proveedor._id.toString(),
    usuario_id: "ADMIN_SEED_" + Math.floor(Math.random() * 3), // Usuario que registró
    informacionCompra: {
      numero: "COM-" + fechaCompra.getFullYear() + "-" + String(i).padStart(5, '0'),
      fecha: fechaCompra,
      metodoPago: metodosPago[Math.floor(Math.random() * metodosPago.length)],
      tipo: tipos[Math.floor(Math.random() * tipos.length)]
    },
    calculo: {
      subtotal: parseFloat(subTotalCompra.toFixed(2)),
      impuestos: impuestos,
      descuentos: parseFloat(totalDescuentosCompra.toFixed(2)),
      total: total
    },
    estado: estados[Math.floor(Math.random() * estados.length)],
    fechaCreacion: fechaCompra,
    fechaActualizacion: fechaCompra
  };
  
  comprasToInsert.push(compra);
  detallesToInsert.push(...detallesEstaCompra);
}

// Insertar en lotes si es necesario, pero 300 compras es pequeño
db.Compras.insertMany(comprasToInsert);
db.DetalleCompras.insertMany(detallesToInsert);

print("✅ " + db.Compras.countDocuments() + " compras insertadas.");
print("✅ " + db.DetalleCompras.countDocuments() + " detalles de compras insertados.");
print("🎉 SCRIPT COMPLETADO EXITOSAMENTE");
