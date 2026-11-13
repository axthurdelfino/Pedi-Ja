package application.pedija.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import application.pedija.dto.RequestStockMovement;
import application.pedija.entities.Product;
import application.pedija.entities.StockMovement;
import application.pedija.entities.enums.StockMovementType;
import application.pedija.exceptions.BusinessException;
import application.pedija.exceptions.ResourceNotFoundException;
import application.pedija.mappers.StockMovementMapper;
import application.pedija.repositories.ProductRepository;
import application.pedija.repositories.StockMovementRepository;

@ExtendWith(MockitoExtension.class)
class StockMovementServiceTest {
  @Mock ProductRepository productRepository;
  @Mock StockMovementRepository stockMovementRepository;
  @Captor ArgumentCaptor<StockMovement> movementCaptor;
  StockMovementService service;
  Product product;

  @BeforeEach
  void setUp() {
    service = new StockMovementService(productRepository, stockMovementRepository, new StockMovementMapper());
    product = new Product();
    product.setId(10L);
    product.setNome("Café");
    product.setEstoque(10);
  }

  @Test
  void registersEntryAndIncrementsStock() {
    when(productRepository.findById(10L)).thenReturn(Optional.of(product));
    savedMovement();
    service.register(request(StockMovementType.ENTRADA, 4));
    org.mockito.Mockito.verify(stockMovementRepository).save(movementCaptor.capture());
    assertEquals(14, product.getEstoque());
    assertEquals(StockMovementType.ENTRADA, movementCaptor.getValue().getTipo());
    assertEquals(4, movementCaptor.getValue().getQuantidade());
  }

  @Test
  void registersExitAndDecrementsStock() {
    when(productRepository.findById(10L)).thenReturn(Optional.of(product));
    savedMovement();
    service.register(request(StockMovementType.SAIDA, 4));
    assertEquals(6, product.getEstoque());
  }

  @Test
  void rejectsInsufficientStock() {
    when(productRepository.findById(10L)).thenReturn(Optional.of(product));
    assertThrows(BusinessException.class, () -> service.register(request(StockMovementType.SAIDA, 11)));
    assertEquals(10, product.getEstoque());
  }

  @Test
  void rejectsMissingProduct() {
    when(productRepository.findById(10L)).thenReturn(Optional.empty());
    assertThrows(ResourceNotFoundException.class, () -> service.register(request(StockMovementType.ENTRADA, 1)));
  }

  @Test
  void rejectsInvalidQuantity() {
    assertThrows(BusinessException.class, () -> service.register(request(StockMovementType.ENTRADA, 0)));
  }

  private RequestStockMovement request(StockMovementType type, int quantity) {
    RequestStockMovement request = new RequestStockMovement();
    request.setProdutoId(10L);
    request.setTipo(type);
    request.setQuantidade(quantity);
    return request;
  }

  private void savedMovement() {
    when(stockMovementRepository.save(any())).thenAnswer(invocation -> {
      StockMovement movement = invocation.getArgument(0);
      movement.setId(1L);
      return movement;
    });
  }
}
