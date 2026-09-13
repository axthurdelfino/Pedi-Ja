package Application.PediJa.Mappers;

import java.util.List;

import Application.PediJa.Dto.RequestOrder;
import Application.PediJa.Dto.ResponseOrder;
import Application.PediJa.Dto.ResponseOrderItem;
import Application.PediJa.Entities.Client;
import Application.PediJa.Entities.Order;
import org.springframework.stereotype.Component;

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
    response.setDataPedido(order.getDataPedido());
    response.setStatus(order.getOrderStatus());
    response.setPaymentMethod(order.getPaymentMethod());
    response.setValorTotal(order.getValorTotal());
    response.setItems(items);
    return response;
  }
}
