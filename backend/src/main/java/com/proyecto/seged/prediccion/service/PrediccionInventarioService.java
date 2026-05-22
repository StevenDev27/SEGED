/*
backend/src/main/java/com/proyecto/seged/prediccion/service/PrediccionInventarioService.java
*/
package com.proyecto.seged.prediccion.service;

import com.proyecto.seged.model.Inventario;
import com.proyecto.seged.model.Producto;
import com.proyecto.seged.model.Ventas;
import com.proyecto.seged.prediccion.dto.PrediccionRequestDTO;
import com.proyecto.seged.prediccion.dto.PrediccionResponseDTO;
import com.proyecto.seged.repository.DetalleVentasRepository;
import com.proyecto.seged.repository.InventarioRepository;
import com.proyecto.seged.repository.ProductoRepository;
import com.proyecto.seged.repository.VentasRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
public class PrediccionInventarioService {

    private final DetalleVentasRepository detalleVentasRepository;
    private final InventarioRepository inventarioRepository;
    private final ProductoRepository productoRepository;
    private final VentasRepository ventasRepository;
    private final PredictorService predictorService;

    public PrediccionResponseDTO predecirParaProducto(String productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

        List<Inventario> inventarios = inventarioRepository.findByProducto_Id(productoId);
        Inventario inventario = inventarios.stream()
                .filter(inv -> Boolean.TRUE.equals(inv.getActivo()))
                .findFirst()
                .orElse(inventarios.stream().findFirst().orElse(null));

        if (inventario == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventario no encontrado para el producto");
        }

        PrediccionRequestDTO request = construirPrediccionRequest(producto, inventario);
        return predictorService.predecir(request);
    }

    public List<PrediccionResponseDTO> predecirTodosLosProductos() {
        List<Inventario> inventarios = inventarioRepository.findByActivoTrue();
        Set<String> vistos = new HashSet<>();

        List<PrediccionResponseDTO> predicciones = inventarios.stream()
                .map(Inventario::getProducto)
                .filter(Objects::nonNull)
                .filter(producto -> vistos.add(producto.getId()))
                .map(producto -> predecirParaProducto(producto.getId()))
                .sorted(this::ordenarPorAlerta)
                .collect(Collectors.toList());

        return predicciones;
    }

    public List<PrediccionResponseDTO> obtenerAlertas() {
        return predecirTodosLosProductos().stream()
                .filter(prediccion -> !"NORMAL".equalsIgnoreCase(prediccion.getNivelAlerta()))
                .collect(Collectors.toList());
    }

    private int ordenarPorAlerta(PrediccionResponseDTO a, PrediccionResponseDTO b) {
        return Integer.compare(prioridadAlerta(a.getNivelAlerta()), prioridadAlerta(b.getNivelAlerta()));
    }

    private int prioridadAlerta(String nivelAlerta) {
        if ("CRITICA".equalsIgnoreCase(nivelAlerta)) {
            return 0;
        }
        if ("ADVERTENCIA".equalsIgnoreCase(nivelAlerta)) {
            return 1;
        }
        return 2;
    }

    private PrediccionRequestDTO construirPrediccionRequest(Producto producto, Inventario inventario) {
        String categoria = producto.getCategoria() != null && producto.getCategoria().getNombre() != null
                ? producto.getCategoria().getNombre().toUpperCase()
                : "SIN CATEGORIA";

        String mesVenta = LocalDate.now().getMonth().name();
        int cantidadVendidaMes = calcularCantidadVendidaMes(producto.getId());
        int frecuenciaReposicion = calcularFrecuenciaReposicion(inventario);
        boolean tienePromocion = calcularTienePromocion(producto.getId());

        return new PrediccionRequestDTO(
                producto.getId(),
                producto.getNombre(),
                cantidadVendidaMes,
                inventario.getStockActual(),
                producto.getPreciounitario(),
                categoria,
                mesVenta,
                frecuenciaReposicion,
                tienePromocion
        );
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
                .filter(movimiento -> movimiento != null)
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
}
