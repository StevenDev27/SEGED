package com.proyecto.seged.service;

import com.proyecto.seged.model.Compras;
import com.proyecto.seged.model.Inventario;
import com.proyecto.seged.model.Producto;
import com.proyecto.seged.repository.ComprasRepository;
import com.proyecto.seged.repository.ProductoRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ComprasService {

    @Autowired
    private ComprasRepository comprasRepository;

    @Autowired
    private InventarioService inventarioService;

    @Autowired
    private ProductoRepository productoRepository;

    public Compras save(Compras compras) {
        return comprasRepository.save(compras);
    }

    @Transactional
    public Compras crearCompraConInventario(Compras compra, List<ItemCompraDTO> items) {
        for (ItemCompraDTO item : items) {
            Inventario inv = inventarioService.getByProductoId(item.getProductoId());

            if (inv == null) {
                Producto producto = productoRepository.findById(item.getProductoId()).orElse(null);
                String nombreProducto = producto != null ? producto.getNombre() : item.getProductoId();

                throw new IllegalStateException(
                        "No existe inventario para el producto: " + nombreProducto
                );
            }
        }

        Compras compraCreada = comprasRepository.save(compra);

        for (ItemCompraDTO item : items) {
            Inventario inv = inventarioService.getByProductoId(item.getProductoId());

            inventarioService.registrarMovimiento(
                    inv.getId(),
                    "entrada",
                    item.getCantidad().doubleValue(),
                    "Compra #" + compraCreada.getInformacionCompra().getNumero(),
                    compra.getUsuario_id(),
                    null,
                    compraCreada.getId()
            );
        }

        return compraCreada;
    }

    public List<Compras> getCompras() {
        return comprasRepository.findAll();
    }

    public Compras get(String id) {
        return comprasRepository.findById(id).orElse(null);
    }

    public void delete(String id) {
        comprasRepository.deleteById(id);
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class ItemCompraDTO {
        private String productoId;
        private Integer cantidad;
    }
}
