package Application.PediJa.Dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import Application.PediJa.Entities.Enums.OrderStatus;
import Application.PediJa.Entities.Enums.PaymentMethod;

public class ResponseOrder {

  private Long id;
  private Long clienteId;
  private String clienteNome;
  public String getClienteNome() { return clienteNome; }
  public void setClienteNome(String clienteNome) { this.clienteNome = clienteNome; }
  private LocalDateTime dataPedido;
  private OrderStatus status;
  private PaymentMethod paymentMethod;
  private BigDecimal valorTotal;
  private List<ResponseOrderItem> items;



  public BigDecimal getValorTotal() {
    return valorTotal;
  }
  public void setValorTotal(BigDecimal valorTotal) {
    this.valorTotal = valorTotal;
  }
  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public Long getClienteId() {
    return clienteId;
  }
  public void setClienteId(Long clienteId) {
    this.clienteId = clienteId;
  }
  public LocalDateTime getDataPedido() {
    return dataPedido;
  }
  public void setDataPedido(LocalDateTime dataPedido) {
    this.dataPedido = dataPedido;
  }
  public OrderStatus getStatus() {
    return status;
  }
  public void setStatus(OrderStatus status) {
    this.status = status;
  }
  public PaymentMethod getPaymentMethod() {
    return paymentMethod;
  }
  public void setPaymentMethod(PaymentMethod paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  public List<ResponseOrderItem> getItems() {
    return items;
  }
  public void setItems(List<ResponseOrderItem> items) {
    this.items = items;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((id == null) ? 0 : id.hashCode());
    return result;
  }
  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    ResponseOrder other = (ResponseOrder) obj;
    if (id == null) {
      if (other.id != null)
        return false;
    } else if (!id.equals(other.id))
      return false;
    return true;
  }



}
