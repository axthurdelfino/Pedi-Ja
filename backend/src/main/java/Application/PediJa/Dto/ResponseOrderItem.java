package Application.PediJa.Dto;

import java.math.BigDecimal;

public class ResponseOrderItem {

  private Long produtoId;
  private String produtoNome;
  private Integer quantidade;
  private BigDecimal precoUnitario;
  private BigDecimal subtotal;

  public Long getProdutoId() {
    return produtoId;
  }

  public void setProdutoId(Long produtoId) {
    this.produtoId = produtoId;
  }
  public String getProdutoNome() {
    return produtoNome;
  }
  public void setProdutoNome(String produtoNome) {
    this.produtoNome = produtoNome;
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
  public BigDecimal getSubtotal() {
    return subtotal;
  }
  public void setSubtotal(BigDecimal subtotal) {
    this.subtotal = subtotal;
  }
  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((produtoId == null) ? 0 : produtoId.hashCode());
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
    ResponseOrderItem other = (ResponseOrderItem) obj;
    if (produtoId == null) {
      if (other.produtoId != null)
        return false;
    } else if (!produtoId.equals(other.produtoId))
      return false;
    return true;
  }


}
