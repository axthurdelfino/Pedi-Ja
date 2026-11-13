package application.pedija.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import application.pedija.dto.RequestStockMovement;
import application.pedija.dto.ResponseStockMovement;
import application.pedija.entities.enums.StockMovementType;
import application.pedija.services.StockMovementService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/stock-movements")
public class StockMovementController {
  private final StockMovementService stockMovementService;

  public StockMovementController(StockMovementService stockMovementService) {
    this.stockMovementService = stockMovementService;
  }

  @PostMapping
  public ResponseEntity<ResponseStockMovement> register(@Valid @RequestBody RequestStockMovement request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(stockMovementService.register(request));
  }

  @GetMapping
  public ResponseEntity<List<ResponseStockMovement>> search(@RequestParam(required = false) Long produtoId,
      @RequestParam(required = false) StockMovementType tipo,
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE_TIME) LocalDateTime inicio,
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE_TIME) LocalDateTime fim) {
    return ResponseEntity.ok(stockMovementService.search(produtoId, tipo, inicio, fim));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ResponseStockMovement> findById(@PathVariable Long id) {
    return ResponseEntity.ok(stockMovementService.findById(id));
  }
}
