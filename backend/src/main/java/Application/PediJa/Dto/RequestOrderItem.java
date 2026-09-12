package Application.PediJa.Dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class RequestOrderItem {

  @NotNull
  @Positive
  private Long produtoId;

  @NotNull
  @Positive
  private Integer quantidade;

  public Integer getQuantidade() {
    return quantidade;
  }

  public void setQuantidade(Integer quantidade) {
    this.quantidade = quantidade;
  }

  public Long getProdutoId() {
    return produtoId;
  }

  public void setProdutoId(Long produtoId) {
    this.produtoId = produtoId;
  }
}
