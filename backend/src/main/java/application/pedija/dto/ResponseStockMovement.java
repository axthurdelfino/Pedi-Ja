package application.pedija.dto;

import java.time.LocalDateTime;

import application.pedija.entities.enums.StockMovementType;

public class ResponseStockMovement {
  private Long id;
  private Long produtoId;
  private String produtoNome;
  private StockMovementType tipo;
  private Integer quantidade;
  private LocalDateTime dataMovimentacao;
  private String descricao;
  private Long pedidoId;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Long getProdutoId() { return produtoId; }
  public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }
  public String getProdutoNome() { return produtoNome; }
  public void setProdutoNome(String produtoNome) { this.produtoNome = produtoNome; }
  public StockMovementType getTipo() { return tipo; }
  public void setTipo(StockMovementType tipo) { this.tipo = tipo; }
  public Integer getQuantidade() { return quantidade; }
  public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
  public LocalDateTime getDataMovimentacao() { return dataMovimentacao; }
  public void setDataMovimentacao(LocalDateTime dataMovimentacao) { this.dataMovimentacao = dataMovimentacao; }
  public String getDescricao() { return descricao; }
  public void setDescricao(String descricao) { this.descricao = descricao; }
  public Long getPedidoId() { return pedidoId; }
  public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }
}
