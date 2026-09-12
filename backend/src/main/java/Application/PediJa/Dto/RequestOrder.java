package Application.PediJa.Dto;

import java.util.List;

import Application.PediJa.Entities.Enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class RequestOrder {

  @NotNull
  private Long clienteId;

  @NotNull
  private PaymentMethod paymentMethod;

  @NotEmpty
  @Valid
  private List<RequestOrderItem> items;

  public Long getClienteId() {
    return clienteId;
  }

  public void setClienteId(Long clienteId) {
    this.clienteId = clienteId;
  }

  public PaymentMethod getPaymentMethod() {
    return paymentMethod;
  }

  public void setPaymentMethod(PaymentMethod paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  public List<RequestOrderItem> getItems() {
    return items;
  }

  public void setItems(List<RequestOrderItem> items) {
    this.items = items;
  }
}
