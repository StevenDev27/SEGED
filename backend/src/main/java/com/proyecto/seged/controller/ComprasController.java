package com.proyecto.seged.controller;

import com.proyecto.seged.model.Compras;
import com.proyecto.seged.service.ComprasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/compras")
public class ComprasController {

    @Autowired
    private ComprasService comprasService;

    @PostMapping
    public ResponseEntity<Compras> save(@RequestBody Compras compras) {
        return new ResponseEntity<>(comprasService.save(compras), HttpStatus.CREATED);
    }

    @PostMapping("/con-inventario")
    public ResponseEntity<?> crearCompraConInventario(@RequestBody CompraConDetallesRequest request) {
        try {
            List<ComprasService.ItemCompraDTO> items = request.getDetalles().stream()
                    .map(d -> new ComprasService.ItemCompraDTO(d.getProductoId(), d.getCantidad()))
                    .collect(Collectors.toList());

            Compras compraCreada = comprasService.crearCompraConInventario(request.getCompra(), items);

            return new ResponseEntity<>(compraCreada, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la compra: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Compras>> getCompras() {
        return new ResponseEntity<>(comprasService.getCompras(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compras> get(@PathVariable String id) {
        Compras compra = comprasService.get(id);
        if (compra == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(compra, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        comprasService.delete(id);
        return new ResponseEntity<>("Compra eliminada con éxito", HttpStatus.OK);
    }

    public static class CompraConDetallesRequest {
        private Compras compra;
        private List<DetalleRequest> detalles;

        public Compras getCompra() {
            return compra;
        }

        public void setCompra(Compras compra) {
            this.compra = compra;
        }

        public List<DetalleRequest> getDetalles() {
            return detalles;
        }

        public void setDetalles(List<DetalleRequest> detalles) {
            this.detalles = detalles;
        }
    }

    public static class DetalleRequest {
        private String productoId;
        private Integer cantidad;

        public String getProductoId() {
            return productoId;
        }

        public void setProductoId(String productoId) {
            this.productoId = productoId;
        }

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
    }
}
