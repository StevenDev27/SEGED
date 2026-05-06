package com.proyecto.seged.controller;

import com.proyecto.seged.model.Ventas;
import com.proyecto.seged.service.VentasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ventas")
public class VentasController {

    @Autowired
    private VentasService ventasService;

    @PostMapping("/con-inventario")
    public ResponseEntity<?> crearVentaConInventario(@RequestBody VentaConDetallesRequest request) {
        try {
            List<VentasService.ItemVentaDTO> items = request.getDetalles().stream()
                    .map(d -> new VentasService.ItemVentaDTO(d.getProductoId(), d.getCantidad()))
                    .collect(Collectors.toList());

            Ventas ventaCreada = ventasService.crearVentaConDescuento(request.getVenta(), items);

            return new ResponseEntity<>(ventaCreada, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la venta: " + e.getMessage());
        }
    }

    // Mantén el endpoint original para compatibilidad
    @PostMapping
    public ResponseEntity<Ventas> save(@RequestBody Ventas ventas) {
        return new ResponseEntity<>(ventasService.save(ventas), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Ventas>> getVentas() {
        return new ResponseEntity<>(ventasService.getVentas(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ventas> get(@PathVariable String id) {
        return new ResponseEntity<>(ventasService.get(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        ventasService.delete(id);
        return new ResponseEntity<>("Venta eliminada con éxito", HttpStatus.OK);
    }

    public static class VentaConDetallesRequest {
        private Ventas venta;
        private List<DetalleRequest> detalles;

        public Ventas getVenta() { return venta; }
        public void setVenta(Ventas venta) { this.venta = venta; }
        public List<DetalleRequest> getDetalles() { return detalles; }
        public void setDetalles(List<DetalleRequest> detalles) { this.detalles = detalles; }
    }

    public static class DetalleRequest {
        private String productoId;
        private Integer cantidad;

        public String getProductoId() { return productoId; }
        public void setProductoId(String productoId) { this.productoId = productoId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }
}
