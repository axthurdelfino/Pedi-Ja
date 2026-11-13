package application.pedija.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import application.pedija.dto.RequestOrder;
import application.pedija.dto.RequestOrderItem;
import application.pedija.dto.RequestOrderStatus;
import application.pedija.entities.Client;
import application.pedija.entities.Order;
import application.pedija.entities.OrderItem;
import application.pedija.entities.Product;
import application.pedija.entities.enums.OrderStatus;
import application.pedija.entities.enums.PaymentMethod;
import application.pedija.entities.enums.StockMovementType;
import application.pedija.mappers.OrderItemMapper;
import application.pedija.mappers.OrderMapper;
import application.pedija.repositories.ClientRepository;
import application.pedija.repositories.OrderRepository;
import application.pedija.repositories.ProductRepository;

@ExtendWith(MockitoExtension.class)
class OrderStockMovementIntegrationTest {
  @Mock ClientRepository clientRepository;
  @Mock ProductRepository productRepository;
  @Mock OrderRepository orderRepository;
  @Mock StockMovementService stockMovementService;

  @Test
  void recordsOneExitForConsolidatedOrderItemsWithoutDoubleDecrement() {
    Product product = product(4L, 10);
    Client client = client();
    when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
    when(productRepository.findById(4L)).thenReturn(Optional.of(product));
    when(orderRepository.save(any())).thenAnswer(invocation -> {
      Order order = invocation.getArgument(0);
      order.setId(15L);
      return order;
    });

    OrderService service = service();
    service.insert(orderRequest(4L, 1, 2));

    assertEquals(7, product.getEstoque());
    verify(stockMovementService).recordExistingStockChange(eq(product), eq(StockMovementType.SAIDA), eq(3), any(Order.class),
        eq("Saída gerada pelo pedido #15"));
  }

  @Test
  void cancellationRestoresStockAndRecordsOneEntry() {
    Product product = product(4L, 3);
    Order order = new Order();
    order.setId(15L);
    order.setClient(client());
    order.setOrderStatus(OrderStatus.PENDENTE);
    OrderItem item = new OrderItem();
    item.setProduto(product);
    item.setQuantidade(2);
    item.setPrecoUnitario(new BigDecimal("10.00"));
    order.addItem(item);
    when(orderRepository.findById(15L)).thenReturn(Optional.of(order));
    when(orderRepository.save(order)).thenReturn(order);

    RequestOrderStatus request = new RequestOrderStatus(OrderStatus.CANCELADO);
    service().updatedOrder(15L, request);

    assertEquals(5, product.getEstoque());
    verify(stockMovementService).recordExistingStockChange(product, StockMovementType.ENTRADA, 2, order,
        "Estorno gerado pelo cancelamento do pedido #15");
  }

  private OrderService service() {
    return new OrderService(clientRepository, productRepository, orderRepository, new OrderMapper(), new OrderItemMapper(), stockMovementService);
  }

  private Client client() {
    Client client = new Client();
    client.setId(1L);
    client.setNome("Cliente teste");
    return client;
  }

  private Product product(Long id, int stock) {
    Product product = new Product();
    product.setId(id);
    product.setNome("Produto teste");
    product.setPreco(new BigDecimal("10.00"));
    product.setEstoque(stock);
    return product;
  }

  private RequestOrder orderRequest(Long productId, int... quantities) {
    RequestOrder request = new RequestOrder();
    request.setClienteId(1L);
    request.setPaymentMethod(PaymentMethod.PIX);
    request.setItems(java.util.Arrays.stream(quantities).mapToObj(quantity -> {
      RequestOrderItem item = new RequestOrderItem();
      item.setProdutoId(productId);
      item.setQuantidade(quantity);
      return item;
    }).toList());
    return request;
  }
}
