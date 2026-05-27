// ============================================================
// SEED SCRIPT - Ventas e Historial de Ventas (500 ventas)
// Colecciones: Ventas, DetalleVentas
// Base de datos: seged
// ============================================================

db = db.getSiblingDB('seged');

print("🧹 Limpiando colecciones de ventas previas...");
db.Ventas.deleteMany({});
db.DetalleVentas.deleteMany({});

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

const numVentas = 500;
const metodosPago = ["EFECTIVO", "TARJETA_CREDITO", "TARJETA_DEBITO", "TRANSFERENCIA", "NEQUI", "DAVIplata"];
const estados = ["COMPLETADA", "COMPLETADA", "COMPLETADA", "COMPLETADA", "COMPLETADA", "CANCELADA", "EN_PROCESO"];

const ventasToInsert = [];
const detallesToInsert = [];

print(`📦 Generando ${numVentas} ventas...`);

for (let i = 1; i <= numVentas; i++) {
  const fechaVenta = getRandomDate(startDate, endDate);
  const ventaId = new ObjectId();
  const numItems = Math.floor(Math.random() * 5) + 1;
  let subTotalVenta = 0;
  
  const detallesEstaVenta = [];
  
  for (let j = 0; j < numItems; j++) {
    const prodIndex = Math.floor(Math.random() * productos.length);
    const producto = productos[prodIndex];
    
    const cantidad = Math.floor(Math.random() * 5) + 1;
    const precioUnitario = producto.preciounitario;
    
    const tieneDescuento = Math.random() > 0.8;
    const descuentoPorcentaje = tieneDescuento ? (Math.floor(Math.random() * 20) + 5) : 0;
    const valorDescuento = (precioUnitario * cantidad) * (descuentoPorcentaje / 100);
    
    const subtotalLinea = (precioUnitario * cantidad) - valorDescuento;
    subTotalVenta += subtotalLinea;
    
    const detalleId = new ObjectId();
    detallesEstaVenta.push({
      _id: detalleId,
      venta_id: ventaId.toString(),
      producto_id: producto._id.toString(),
      cantidad: cantidad,
      precioUnitario: precioUnitario,
      descuento: {
        tipo: tieneDescuento ? "PORCENTAJE" : "NINGUNO",
        valor: tieneDescuento ? descuentoPorcentaje : 0
      },
      subtotal: subtotalLinea
    });
  }
  
  const impuestos = subTotalVenta * 0.19;
  const total = subTotalVenta + impuestos;
  
  const venta = {
    _id: ventaId,
    cliente_id: "CLIENTE_SEED_" + Math.floor(Math.random() * 100),
    usuario_id: "CAJERO_" + Math.floor(Math.random() * 5),
    informacionVenta: {
      numero: "VEN-" + fechaVenta.getFullYear() + "-" + String(i).padStart(5, '0'),
      fecha: fechaVenta,
      metodoPago: metodosPago[Math.floor(Math.random() * metodosPago.length)]
    },
    calculos: {
      subTotal: subTotalVenta,
      impuestos: impuestos,
      total: total
    },
    estado: estados[Math.floor(Math.random() * estados.length)],
    fechaCreacion: fechaVenta,
    fechaActualizacion: fechaVenta
  };
  
  ventasToInsert.push(venta);
  detallesToInsert.push(...detallesEstaVenta);
}

db.Ventas.insertMany(ventasToInsert);
db.DetalleVentas.insertMany(detallesToInsert);

print("✅ " + db.Ventas.countDocuments() + " ventas insertadas.");
print("✅ " + db.DetalleVentas.countDocuments() + " detalles de ventas insertados.");
print("🎉 SCRIPT COMPLETADO EXITOSAMENTE");
