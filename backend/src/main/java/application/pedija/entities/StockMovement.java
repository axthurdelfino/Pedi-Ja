package application.pedija.entities;

import java.time.LocalDateTime;

import application.pedija.entities.enums.StockMovementType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "movimentacao_estoque")
public class StockMovement {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "produto_id", nullable = false)
  private Product produto;

  @Enumerated(EnumType.STRING)
  @Column(name = "tipo", nullable = false, length = 10)
  private StockMovementType tipo;

  @Column(name = "quantidade", nullable = false)
  private Integer quantidade;

  @Column(name = "data_movimentacao", nullable = false)
  private LocalDateTime dataMovimentacao;

  @Column(name = "descricao", length = 255)
  private String descricao;

  @ManyToOne
  @JoinColumn(name = "pedido_id")
  private Order pedido;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Product getProduto() { return produto; }
  public void setProduto(Product produto) { this.produto = produto; }
  public StockMovementType getTipo() { return tipo; }
  public void setTipo(StockMovementType tipo) { this.tipo = tipo; }
  public Integer getQuantidade() { return quantidade; }
  public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
  public LocalDateTime getDataMovimentacao() { return dataMovimentacao; }
  public void setDataMovimentacao(LocalDateTime dataMovimentacao) { this.dataMovimentacao = dataMovimentacao; }
  public String getDescricao() { return descricao; }
  public void setDescricao(String descricao) { this.descricao = descricao; }
  public Order getPedido() { return pedido; }
  public void setPedido(Order pedido) { this.pedido = pedido; }

  @PrePersist
  private void prePersist() {
    if (dataMovimentacao == null) dataMovimentacao = LocalDateTime.now();
  }
}
