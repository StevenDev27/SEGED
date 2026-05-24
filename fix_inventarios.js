db = db.getSiblingDB('seged');
db.Inventario.find().forEach(inv => {
    var prod = db.Productos.findOne({_id: inv.producto.$id});
    if (prod && prod.categoria) {
        db.Inventario.updateOne({_id: inv._id}, {$set: {categoria: prod.categoria}});
    }
});
print('Inventarios actualizados con categoria ID correcto.');
