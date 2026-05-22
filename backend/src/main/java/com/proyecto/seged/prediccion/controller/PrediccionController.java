/*
backend/src/main/java/com/proyecto/seged/prediccion/controller/PrediccionController.java
*/
package com.proyecto.seged.prediccion.controller;

import com.proyecto.seged.prediccion.dto.PrediccionRequestDTO;
import com.proyecto.seged.prediccion.dto.PrediccionResponseDTO;
import com.proyecto.seged.prediccion.service.ArffExporterService;
import com.proyecto.seged.prediccion.service.PredictorService;
import com.proyecto.seged.prediccion.service.PrediccionInventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/predicciones")
@RequiredArgsConstructor
public class PrediccionController {

    private final PredictorService predictorService;
    private final PrediccionInventarioService prediccionInventarioService;
    private final ArffExporterService arffExporterService;

    @GetMapping("/ping")
    public String ping() {
        return "Módulo predictivo activo";
    }

    @PostMapping("/manual")
    public PrediccionResponseDTO predecirManual(@RequestBody PrediccionRequestDTO request) {
        return predictorService.predecir(request);
    }

    @GetMapping("/producto/{id}")
    public PrediccionResponseDTO predecirPorProducto(@PathVariable("id") String productoId) {
        return prediccionInventarioService.predecirParaProducto(productoId);
    }

    @GetMapping("/todos")
    public List<PrediccionResponseDTO> predecirTodos() {
        return prediccionInventarioService.predecirTodosLosProductos();
    }

    @GetMapping("/alertas")
    public List<PrediccionResponseDTO> obtenerAlertas() {
        return prediccionInventarioService.obtenerAlertas();
    }

    @GetMapping(value = "/exportar-arff", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> exportarArff() {
        String contenido = arffExporterService.generarArff();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=demanda_productos.arff")
                .contentType(MediaType.TEXT_PLAIN)
                .body(contenido);
    }
}
