
package com.proyecto.seged.prediccion.service;

import com.proyecto.seged.model.Inventario;
import com.proyecto.seged.model.Producto;
import com.proyecto.seged.model.Ventas;
import com.proyecto.seged.repository.DetalleVentasRepository;
import com.proyecto.seged.repository.InventarioRepository;
import com.proyecto.seged.repository.ProductoRepository;
import com.proyecto.seged.repository.VentasRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArffExporterService {

    private final InventarioRepository inventarioRepository;
    private final DetalleVentasRepository detalleVentasRepository;
    private final ProductoRepository productoRepository;
    private final VentasRepository ventasRepository;

    public String generarArff() {
        StringBuilder salida = new StringBuilder();
        salida.append("@RELATION demanda_productos\n\n");
        salida.append("@ATTRIBUTE cantidadVendidaMes NUMERIC\n");
        salida.append("@ATTRIBUTE stockActual NUMERIC\n");
        salida.append("@ATTRIBUTE precioUnitario NUMERIC\n");
        salida.append("@ATTRIBUTE categoria STRING\n");
        salida.append("@ATTRIBUTE mesVenta {ENERO,FEBRERO,MARZO,ABRIL,MAYO,JUNIO,JULIO,AGOSTO,SEPTIEMBRE,OCTUBRE,NOVIEMBRE,DICIEMBRE}\n");
        salida.append("@ATTRIBUTE frecuenciaReposicion NUMERIC\n");
        salida.append("@ATTRIBUTE tienePromocion {false,true}\n");
        salida.append("@ATTRIBUTE demanda {ALTA,MEDIA,BAJA}\n\n");
        salida.append("@DATA\n");

        List<Inventario> inventarios = inventarioRepository.findByActivoTrue();
        Set<String> procesados = new HashSet<>();

        for (Inventario inventario : inventarios) {
            if (inventario == null || inventario.getProducto() == null) {
                continue;
            }

            Producto producto = inventario.getProducto();
            if (!procesados.add(producto.getId())) {
                continue;
            }

            int cantidadVendidaMes = calcularCantidadVendidaMes(producto.getId());
            int frecuenciaReposicion = calcularFrecuenciaReposicion(inventario);
            boolean tienePromocion = calcularTienePromocion(producto.getId());
            String categoria = producto.getCategoria() != null && producto.getCategoria().getNombre() != null
                    ? producto.getCategoria().getNombre().toUpperCase()
                    : "SIN CATEGORIA";
            String mesVenta = LocalDate.now().getMonth().name();
            String demanda = etiquetarDemanda(cantidadVendidaMes);

            salida.append(cantidadVendidaMes).append(",");
            salida.append(inventario.getStockActual() == null ? 0.0 : inventario.getStockActual()).append(",");
            salida.append(producto.getPreciounitario() == null ? 0.0 : producto.getPreciounitario()).append(",");
            salida.append(formatearString(categoria)).append(",");
            salida.append(mesVenta).append(",");
            salida.append(frecuenciaReposicion).append(",");
            salida.append(tienePromocion ? "true" : "false").append(",");
            salida.append(demanda).append("\n");
        }

        return salida.toString();
    }

    private int calcularCantidadVendidaMes(String productoId) {
        List<com.proyecto.seged.model.DetalleVentas> detalles = detalleVentasRepository.findByProducto_id(productoId);
        if (detalles.isEmpty()) {
            return 0;
        }

        Set<String> ventaIds = detalles.stream()
                .map(com.proyecto.seged.model.DetalleVentas::getVenta_id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, Ventas> ventasPorId = StreamSupport.stream(ventasRepository.findAllById(ventaIds).spliterator(), false)
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(Ventas::getId, venta -> venta));

        YearMonth mesActual = YearMonth.now();

        return detalles.stream()
                .filter(detalle -> {
                    Ventas venta = ventasPorId.get(detalle.getVenta_id());
                    if (venta == null || venta.getInformacionVenta() == null || venta.getInformacionVenta().getFecha() == null) {
                        return false;
                    }
                    Instant fecha = venta.getInformacionVenta().getFecha();
                    LocalDate fechaLocal = LocalDateTime.ofInstant(fecha, ZoneId.systemDefault()).toLocalDate();
                    return YearMonth.from(fechaLocal).equals(mesActual);
                })
                .mapToInt(com.proyecto.seged.model.DetalleVentas::getCantidad)
                .sum();
    }

    private int calcularFrecuenciaReposicion(Inventario inventario) {
        if (inventario == null || inventario.getMovimientos() == null) {
            return 0;
        }

        Date limite = Date.from(LocalDate.now().minusDays(90).atStartOfDay(ZoneId.systemDefault()).toInstant());
        return (int) inventario.getMovimientos().stream()
                .filter(Objects::nonNull)
                .filter(movimiento -> movimiento.getTipoMovimiento() != null)
                .filter(movimiento -> "entrada".
                        equalsIgnoreCase(movimiento.getTipoMovimiento()))
                .filter(movimiento -> movimiento.getFechaMovimiento() != null)
                .filter(movimiento -> !movimiento.getFechaMovimiento().before(limite))
                .count();
    }

    private boolean calcularTienePromocion(String productoId) {
        return detalleVentasRepository.findByProducto_id(productoId).stream()
                .map(com.proyecto.seged.model.DetalleVentas::getDescuento)
                .filter(Objects::nonNull)
                .anyMatch(descuento -> descuento.getValor() > 0);
    }

    private String etiquetarDemanda(int cantidadVendidaMes) {
        if (cantidadVendidaMes >= 80) {
            return "ALTA";
        }
        if (cantidadVendidaMes >= 30) {
            return "MEDIA";
        }
        return "BAJA";
    }

    private String formatearString(String valor) {
        if (valor == null) {
            return "?";
        }
        return "'" + valor.replace("'", "\\'") + "'";
    }
}
