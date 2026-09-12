package Application.PediJa.Dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class RequestProduct {

  @NotBlank
  @Size(min = 3)
  private String nome;

  @NotBlank
  @Size(min = 5)
  private String descricao;

  @NotNull
  @Positive
  private BigDecimal preco;

  @NotBlank
  @PositiveOrZero
  private Integer estoque;

  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public String getDescricao() {
    return descricao;
  }

  public void setDescricao(String descricao) {
    this.descricao = descricao;
  }

  public BigDecimal getPreco() {
    return preco;
  }

  public void setPreco(BigDecimal preco) {
    this.preco = preco;
  }

  public Integer getEstoque() {
    return estoque;
  }

  public void setEstoque(Integer estoque) {
    this.estoque = estoque;
  }
}
