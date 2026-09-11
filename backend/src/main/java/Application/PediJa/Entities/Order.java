package Application.PediJa.Entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import Application.PediJa.Entities.Enums.OrderStatus;
import Application.PediJa.Entities.Enums.PaymentMethod;
import jakarta.persistence.CascadeType;
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
  private LocalDateTime dataPedido;

  @Column(name = "status")
  @Enumerated(EnumType.STRING)
  private OrderStatus orderStatus;

  @Column(name = "forma_pagamento")
  @Enumerated(EnumType.STRING)
  private PaymentMethod paymentMethod;

  @Column(name = "valor_total")
  private BigDecimal valorTotal;

  @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> items = new ArrayList<>();

  public Order(){}

  public Order(Long id, Client client, LocalDateTime dataPedido, OrderStatus orderStatus, PaymentMethod paymentMethod,
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

  public LocalDateTime getDataPedido() {
    return dataPedido;
  }

  public void setDataPedido(LocalDateTime dataPedido) {
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

  public BigDecimal getValorTotal() {
    return valorTotal;
  }

  public void setValorTotal(BigDecimal valorTotal) {
    this.valorTotal = valorTotal;
  }

  public void removerItem(OrderItem item) {
    items.remove(item);
    item.setPedido(null);
  }

  public void addItem(OrderItem item) {
    items.add(item);
    item.setPedido(this);
  }

  public List<OrderItem> getItems() {
    return items;
  }
}
