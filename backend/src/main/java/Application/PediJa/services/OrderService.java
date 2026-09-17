package Application.PediJa.services;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import Application.PediJa.Dto.RequestOrder;
import Application.PediJa.Dto.RequestOrderItem;
import Application.PediJa.Dto.ResponseOrder;
import Application.PediJa.Dto.ResponseOrderItem;
import Application.PediJa.Entities.Client;
import Application.PediJa.Entities.Order;
import Application.PediJa.Entities.OrderItem;
import Application.PediJa.Entities.Product;
import Application.PediJa.Exceptions.BusinessException;
import Application.PediJa.Exceptions.ResourceNotFoundException;
import Application.PediJa.Mappers.OrderItemMapper;
import Application.PediJa.Mappers.OrderMapper;
import Application.PediJa.Repositories.ClientRepository;
import Application.PediJa.Repositories.OrderRepository;
import Application.PediJa.Repositories.ProductRepository;
import jakarta.transaction.Transactional;

@Service
public class OrderService {

  private final ClientRepository clientRepository;
  private final ProductRepository productRepository;
  private final OrderRepository orderRepository;
  private final OrderMapper orderMapper;
  private final OrderItemMapper orderItemMapper;

  public OrderService(ClientRepository clientRepository, ProductRepository productRepository,
      OrderRepository orderRepository, OrderMapper orderMapper, OrderItemMapper orderItemMapper) {
    this.clientRepository = clientRepository;
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.orderMapper = orderMapper;
    this.orderItemMapper = orderItemMapper;
  }

  private ResponseOrder convertToResponse(Order order) {
    List<ResponseOrderItem> items = order.getItems().stream().map(item -> {
          BigDecimal subtotal = item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade()));

          return orderItemMapper.toResponse(item, subtotal);
        })
        .toList();

    return orderMapper.toResponse(order, items);
  }

  @Transactional
  public List<ResponseOrder> findAll() {
    return orderRepository.findAll().stream().map(this::convertToResponse).toList();
  }

  @Transactional
  public ResponseOrder findById(Long id) {
    Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order", id));

    return convertToResponse(order);
  }
  @Transactional
  public void delete(Long id) {
    Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order", id));

    orderRepository.delete(order);
  }

  @Transactional
  public ResponseOrder insert(RequestOrder dto) {

    Client client = clientRepository.findById(dto.getClienteId())
        .orElseThrow(() -> new ResourceNotFoundException("Client", dto.getClienteId()));
    Order order = orderMapper.toEntity(dto, client);
    Map<Long, Integer> quantidades = new LinkedHashMap<>();

    BigDecimal total = BigDecimal.ZERO;

    for (RequestOrderItem obj : dto.getItems()) {
      quantidades.merge(obj.getProdutoId(), obj.getQuantidade(),
          Integer::sum);
    }

    for (Map.Entry<Long, Integer> entry : quantidades.entrySet()) {
      Long produtoId = entry.getKey();
      Integer quantidade = entry.getValue();

      Product produto = productRepository.findById(produtoId)
          .orElseThrow(() -> new ResourceNotFoundException("Produto", produtoId));
      if (quantidade > produto.getEstoque()) {
        throw new BusinessException("Estoque insuficiente");
      }
      produto.setEstoque(produto.getEstoque() - quantidade);

      RequestOrderItem itemDto = new RequestOrderItem();
      itemDto.setProdutoId(produtoId);
      itemDto.setQuantidade(quantidade);

      OrderItem item = orderItemMapper.toEntity(itemDto, order, produto);

      order.addItem(item);
      BigDecimal subtotal = produto.getPreco().multiply(BigDecimal.valueOf(quantidade));
      total = total.add(subtotal);

    }

    order.setValorTotal(total);
    Order saved = orderRepository.save(order);

    return convertToResponse(saved);
  }

}
