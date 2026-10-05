package application.pedija.dto;

import application.pedija.entities.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class RequestOrderStatus {

  @NotNull
  private OrderStatus status;

  public RequestOrderStatus(){};
  public RequestOrderStatus(OrderStatus status) {
    this.status = status;
  }

  public void setStatus(OrderStatus status) {
    this.status = status;
  }

  public OrderStatus getStatus() {
    return status;
  }

}
