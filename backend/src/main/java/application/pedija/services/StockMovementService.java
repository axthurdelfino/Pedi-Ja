package application.pedija.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import application.pedija.dto.ResponseStockMovement;
import application.pedija.entities.Order;
import application.pedija.entities.Product;
import application.pedija.entities.StockMovement;
import application.pedija.entities.enums.StockMovementType;
import application.pedija.exceptions.BusinessException;
import application.pedija.exceptions.ResourceNotFoundException;
import application.pedija.mappers.StockMovementMapper;
import application.pedija.repositories.ProductRepository;
import application.pedija.repositories.StockMovementRepository;

@Service
public class StockMovementService {
  private final ProductRepository productRepository;
  private final StockMovementRepository stockMovementRepository;
  private final StockMovementMapper stockMovementMapper;

  public StockMovementService(ProductRepository productRepository, StockMovementRepository stockMovementRepository,
      StockMovementMapper stockMovementMapper) {
    this.productRepository = productRepository;
    this.stockMovementRepository = stockMovementRepository;
    this.stockMovementMapper = stockMovementMapper;
  }

  /** Records a stock change already made by its calling business workflow. */
  public void recordExistingStockChange(Product product, StockMovementType type, Integer quantity, Order order, String description) {
    validateQuantity(quantity);
    stockMovementRepository.save(createMovement(product, type, quantity, description, order));
  }

  @Transactional(readOnly = true)
  public List<ResponseStockMovement> search(Long produtoId, StockMovementType tipo, LocalDateTime inicio, LocalDateTime fim) {
    if (inicio != null && fim != null && inicio.isAfter(fim)) throw new BusinessException("Período inválido");
    return stockMovementRepository.search(produtoId, tipo, inicio, fim).stream().map(stockMovementMapper::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public ResponseStockMovement findById(Long id) {
    StockMovement movement = stockMovementRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("StockMovement", id));
    return stockMovementMapper.toResponse(movement);
  }

  private StockMovement createMovement(Product product, StockMovementType type, Integer quantity, String description, Order order) {
    StockMovement movement = new StockMovement();
    movement.setProduto(product);
    movement.setTipo(type);
    movement.setQuantidade(quantity);
    movement.setDescricao(description == null || description.isBlank() ? null : description.trim());
    movement.setPedido(order);
    return movement;
  }

  private void validateQuantity(Integer quantity) {
    if (quantity == null || quantity <= 0) throw new BusinessException("Quantidade deve ser positiva");
  }
}
