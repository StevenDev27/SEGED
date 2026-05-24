db = db.getSiblingDB('seged');
db.Inventario.find().forEach(inv => {
    // How to access the id of the DBRef?
    // Try both .oid and .$id, or just look up the whole product by matching the ref.
    var pId = null;
    if (inv.producto && inv.producto.oid) pId = inv.producto.oid;
    else if (inv.producto && inv.producto['$id']) pId = inv.producto['$id'];
    else pId = inv.producto; // fallback
    
    var prod = db.Productos.findOne({_id: pId});
    if (prod && prod.categoria) {
        db.Inventario.updateOne({_id: inv._id}, {$set: {categoria: prod.categoria}});
    }
});
print('Inventarios corregidos.');
