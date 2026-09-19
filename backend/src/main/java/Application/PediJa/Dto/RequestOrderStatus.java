package Application.PediJa.Dto;

import Application.PediJa.Entities.Enums.OrderStatus;
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
