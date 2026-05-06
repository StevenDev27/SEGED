package com.proyecto.seged.controller;

import com.proyecto.seged.model.Inventario;
import com.proyecto.seged.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventarios")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @PostMapping
    public ResponseEntity<Inventario> save(@RequestBody Inventario inventario) {
        return new ResponseEntity<>(inventarioService.save(inventario), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Inventario>> getInventarios() {
        return new ResponseEntity<>(inventarioService.getInventarios(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventario> get(@PathVariable String id) {
        Inventario inv = inventarioService.get(id);
        if (inv == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(inv, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        inventarioService.delete(id);
        return new ResponseEntity<>("Eliminación exitosa", HttpStatus.OK);
    }

    @PostMapping("/{id}/movimientos")
    public ResponseEntity<Inventario> registrarMovimiento(
            @PathVariable String id,
            @RequestBody MovimientoRequest req
    ) {
        Inventario actualizado = inventarioService.registrarMovimiento(
                id,
                req.getTipoMovimiento(),
                req.getCantidad(),
                req.getMotivo(),
                req.getUsuarioId(),
                req.getVentaId(),
                req.getCompraId()
        );
        return new ResponseEntity<>(actualizado, HttpStatus.OK);
    }


    public static class MovimientoRequest {
        private String tipoMovimiento;
        private Double cantidad;
        private String motivo;
        private String usuarioId;
        private String ventaId;
        private String compraId;

        public String getTipoMovimiento() { return tipoMovimiento; }
        public void setTipoMovimiento(String tipoMovimiento) { this.tipoMovimiento = tipoMovimiento; }
        public Double getCantidad() { return cantidad; }
        public void setCantidad(Double cantidad) { this.cantidad = cantidad; }
        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }
        public String getUsuarioId() { return usuarioId; }
        public void setUsuarioId(String usuarioId) { this.usuarioId = usuarioId; }
        public String getVentaId() { return ventaId; }
        public void setVentaId(String ventaId) { this.ventaId = ventaId; }
        public String getCompraId() { return compraId; }
        public void setCompraId(String compraId) { this.compraId = compraId; }
    }
}
