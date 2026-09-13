package Application.PediJa.Mappers;

import java.math.BigDecimal;

import Application.PediJa.Dto.RequestOrderItem;
import Application.PediJa.Dto.ResponseOrderItem;
import Application.PediJa.Entities.Order;
import Application.PediJa.Entities.OrderItem;
import Application.PediJa.Entities.Product;
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
