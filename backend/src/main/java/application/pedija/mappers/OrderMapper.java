package application.pedija.mappers;

import java.util.List;

import org.springframework.stereotype.Component;

import application.pedija.dto.RequestOrder;
import application.pedija.dto.ResponseOrder;
import application.pedija.dto.ResponseOrderItem;
import application.pedija.entities.Client;
import application.pedija.entities.Order;

@Component
public class OrderMapper {

  public Order toEntity(RequestOrder dto, Client client) {
    Order order = new Order();
    order.setClient(client);
    order.setPaymentMethod(dto.getPaymentMethod());
    return order;
  }

  public ResponseOrder toResponse(Order order, List<ResponseOrderItem> items) {
    ResponseOrder response = new ResponseOrder();
    response.setId(order.getId());
    response.setClienteId(order.getClient().getId());
    response.setClienteNome(order.getClient().getNome());
    response.setDataPedido(order.getDataPedido());
    response.setStatus(order.getOrderStatus());
    response.setPaymentMethod(order.getPaymentMethod());
    response.setValorTotal(order.getValorTotal());
    response.setItems(items);
    return response;
  }
}
