package application.pedija.dto;

import application.pedija.entities.enums.StockMovementType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class RequestStockMovement {
  @NotNull
  @Positive
  private Long produtoId;

  @NotNull
  private StockMovementType tipo;

  @NotNull
  @Positive
  private Integer quantidade;

  @Size(max = 255)
  private String descricao;

  public Long getProdutoId() { return produtoId; }
  public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }
  public StockMovementType getTipo() { return tipo; }
  public void setTipo(StockMovementType tipo) { this.tipo = tipo; }
  public Integer getQuantidade() { return quantidade; }
  public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
  public String getDescricao() { return descricao; }
  public void setDescricao(String descricao) { this.descricao = descricao; }
}
