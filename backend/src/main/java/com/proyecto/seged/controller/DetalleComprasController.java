package com.proyecto.seged.controller;

import com.proyecto.seged.model.DetalleCompras;
import com.proyecto.seged.service.DetalleComprasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle_compras")
public class DetalleComprasController {

    @Autowired
    private DetalleComprasService detalleComprasService;

    @PostMapping
    public ResponseEntity<DetalleCompras> save(@RequestBody DetalleRequest request) {
        DetalleCompras detalle = new DetalleCompras();

        detalle.setCompra_id(request.getCompraId());
        detalle.setProducto_id(request.getProductoId());
        detalle.setCantidad(request.getCantidad());
        detalle.setPrecioUnitario(request.getPrecioUnitario());
        detalle.setSubtotal(request.getSubtotal());

        DetalleCompras.Descuentos desc = new DetalleCompras.Descuentos();
        desc.setTipo(request.getDescuentoTipo() != null ? request.getDescuentoTipo() : "");
        desc.setValor(request.getDescuentoValor() != null ? request.getDescuentoValor() : 0.0);
        detalle.setDescuentos(desc);

        return new ResponseEntity<>(detalleComprasService.save(detalle), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DetalleCompras>> getDetalleCompras() {
        return new ResponseEntity<>(detalleComprasService.getDetalleCompras(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleCompras> get(@PathVariable String id) {
        return new ResponseEntity<>(detalleComprasService.get(id), HttpStatus.OK);
    }

    @GetMapping("/compra/{compraId}")
    public ResponseEntity<List<DetalleCompras>> getByCompraId(@PathVariable String compraId) {
        return new ResponseEntity<>(detalleComprasService.getByCompraId(compraId), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        detalleComprasService.delete(id);
        return new ResponseEntity<>("Eliminación exitosa", HttpStatus.OK);
    }

    public static class DetalleRequest {
        private String compraId;
        private String productoId;
        private Integer cantidad;
        private Double precioUnitario;
        private String descuentoTipo;
        private Double descuentoValor;
        private Double subtotal;

        public String getCompraId() { return compraId; }
        public void setCompraId(String compraId) { this.compraId = compraId; }

        public String getProductoId() { return productoId; }
        public void setProductoId(String productoId) { this.productoId = productoId; }

        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

        public Double getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }

        public String getDescuentoTipo() { return descuentoTipo; }
        public void setDescuentoTipo(String descuentoTipo) { this.descuentoTipo = descuentoTipo; }

        public Double getDescuentoValor() { return descuentoValor; }
        public void setDescuentoValor(Double descuentoValor) { this.descuentoValor = descuentoValor; }

        public Double getSubtotal() { return subtotal; }
        public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    }
}
