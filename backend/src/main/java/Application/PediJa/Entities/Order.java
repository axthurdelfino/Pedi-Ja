package Application.PediJa.Entities;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import Application.PediJa.Entities.Enums.OrderStatus;
import Application.PediJa.Entities.Enums.PaymentMethod;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "pedido")
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "cliente_id", nullable = false)
  private Client client;

  @Column(name = "data_pedido")
  private Instant dataPedido;

  @Column(name = "status")
  @Enumerated(EnumType.STRING)
  private OrderStatus orderStatus;

  @Column(name = "forma_pagamento")
  @Enumerated(EnumType.STRING)
  private PaymentMethod paymentMethod;

  @Column(name = "valor_total")
  private BigDecimal valorTotal;

  @OneToMany(mappedBy = "pedido")
  List<OrderItem> items = new ArrayList<>();

  public Order(){}

  public Order(Long id, Client client, Instant dataPedido, OrderStatus orderStatus, PaymentMethod paymentMethod,
      BigDecimal total) {
    this.id = id;
    this.client = client;
    this.dataPedido = dataPedido;
    this.orderStatus = orderStatus;
    this.paymentMethod = paymentMethod;
    this.valorTotal = total;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Client getClient() {
    return client;
  }

  public void setClient(Client client) {
    this.client = client;
  }

  public Instant getDataPedido() {
    return dataPedido;
  }

  public void setDataPedido(Instant dataPedido) {
    this.dataPedido = dataPedido;
  }

  public OrderStatus getOrderStatus() {
    return orderStatus;
  }

  public void setOrderStatus(OrderStatus orderStatus) {
    this.orderStatus = orderStatus;
  }

  public PaymentMethod getPaymentMethod() {
    return paymentMethod;
  }

  public void setPaymentMethod(PaymentMethod paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  public BigDecimal getTotal() {
    BigDecimal sum = BigDecimal.ZERO;
    for (OrderItem x : items) {
      sum = sum.add(x.getPrecoUnitario().multiply(BigDecimal.valueOf(x.getQuantidade())));
    }
    return sum;
  }
  public void setTotal(BigDecimal total) {
    this.valorTotal = total;
  }
}
