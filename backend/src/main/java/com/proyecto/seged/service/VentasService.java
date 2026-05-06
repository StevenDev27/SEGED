package com.proyecto.seged.service;

import com.proyecto.seged.model.Inventario;
import com.proyecto.seged.model.Producto;
import com.proyecto.seged.model.Ventas;
import com.proyecto.seged.repository.ProductoRepository;
import com.proyecto.seged.repository.VentasRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VentasService {

    @Autowired
    private VentasRepository ventasRepository;

    @Autowired
    private InventarioService inventarioService;

    @Autowired
    private ProductoRepository productoRepository;

    public Ventas save(Ventas ventas) {
        return ventasRepository.save(ventas);
    }

    @Transactional
    public Ventas crearVentaConDescuento(Ventas ventas, List<ItemVentaDTO> items) {
        // 1. Validar stock disponible ANTES de crear la venta
        for (ItemVentaDTO item : items) {
            Inventario inv = inventarioService.getByProductoId(item.getProductoId());

            if (inv == null) {
                Producto producto = productoRepository.findById(item.getProductoId()).orElse(null);
                String nombreProducto = producto != null ? producto.getNombre() : item.getProductoId();

                throw new IllegalStateException(
                        "No existe inventario para el producto: " + nombreProducto
                );
            }

            if (inv.getStockActual() < item.getCantidad()) {
                throw new IllegalStateException(
                        "Stock insuficiente para: " + inv.getProducto().getNombre() +
                                ". Disponible: " + inv.getStockActual() + ", Solicitado: " + item.getCantidad()
                );
            }
        }

        Ventas ventaCreada = ventasRepository.save(ventas);

        for (ItemVentaDTO item : items) {
            Inventario inv = inventarioService.getByProductoId(item.getProductoId());

            inventarioService.registrarMovimiento(
                    inv.getId(),
                    "salida",
                    item.getCantidad().doubleValue(),
                    "Venta #" + ventaCreada.getInformacionVenta().getNumero(),
                    ventas.getUsuario_id(),
                    ventaCreada.getId(),
                    null
            );
        }

        return ventaCreada;
    }


    public List<Ventas> getVentas() {
        return ventasRepository.findAll();
    }

    public Ventas get(String id) {
        return ventasRepository.findById(id).orElse(null);
    }

    public void delete(String id) {
        ventasRepository.deleteById(id);
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class ItemVentaDTO {
        private String productoId;
        private Integer cantidad;
    }
}
