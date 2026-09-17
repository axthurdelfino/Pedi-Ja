package Application.PediJa.Entities;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import Application.PediJa.Entities.PK.OrderItemPK;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "item_pedido")
public class OrderItem {

  @EmbeddedId
  private OrderItemPK id = new OrderItemPK();

  @JsonIgnore
  @ManyToOne(optional = false)
  @MapsId("pedidoId")
  @JoinColumn(name = "pedido_id", nullable = false)
  private Order pedido;

  @ManyToOne(optional = false)
  @MapsId("produtoId")
  @JoinColumn(name = "produto_id", nullable = false)

  private Product produto;

  @Column(name = "quantidade", nullable = false)
  private Integer quantidade;

  @Column(name = "preco_unitario", nullable = false, precision = 10, scale = 2)
  private BigDecimal precoUnitario;

  public OrderItem() {
  }


  public OrderItem(Order pedido, Product produto, Integer quantidade, BigDecimal precoUnitario) {
    this.pedido = pedido;
    this.produto = produto;
    this.quantidade = quantidade;
    this.precoUnitario = precoUnitario;
  }


  public OrderItemPK getId() {
    return id;
  }

  public void setId(OrderItemPK id) {
    this.id = id;
  }

  public Order getPedido() {
    return pedido;
  }

  public void setPedido(Order pedido) {
    this.pedido = pedido;
  }

  public Product getProduto() {
    return produto;
  }

  public void setProduto(Product produto) {
    this.produto = produto;
  }

  public Integer getQuantidade() {
    return quantidade;
  }

  public void setQuantidade(Integer quantidade) {
    this.quantidade = quantidade;
  }

  public BigDecimal getPrecoUnitario() {
    return precoUnitario;
  }

  public void setPrecoUnitario(BigDecimal precoUnitario) {
    this.precoUnitario = precoUnitario;
  }
}
