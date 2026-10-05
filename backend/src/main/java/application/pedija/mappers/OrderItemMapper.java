package application.pedija.mappers;

import java.math.BigDecimal;

import application.pedija.dto.RequestOrderItem;
import application.pedija.dto.ResponseOrderItem;
import application.pedija.entities.Order;
import application.pedija.entities.OrderItem;
import application.pedija.entities.Product;
import org.springframework.stereotype.Component;

@Component
public class OrderItemMapper {

  public OrderItem toEntity(RequestOrderItem dto, Order order, Product product) {
    OrderItem item = new OrderItem();
    item.setPedido(order);
    item.setProduto(product);
    item.setQuantidade(dto.getQuantidade());
    item.setPrecoUnitario(product.getPreco());
    return item;
  }

  public ResponseOrderItem toResponse(OrderItem item, BigDecimal subtotal) {
    ResponseOrderItem response = new ResponseOrderItem();
    response.setProdutoId(item.getProduto().getId());
    response.setProdutoNome(item.getProduto().getNome());
    response.setQuantidade(item.getQuantidade());
    response.setPrecoUnitario(item.getPrecoUnitario());
    response.setSubtotal(subtotal);
    return response;
  }
}
