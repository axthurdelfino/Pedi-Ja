package Application.PediJa.Dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class RequestProduct {

  @NotBlank
  @Size(min = 3, max = 100)
  private String nome;

  @NotBlank
  @Size(min = 5, max = 100)
  private String descricao;

  @NotNull
  @DecimalMin("0.00")
  @Digits(integer = 8, fraction = 2)
  private BigDecimal preco;

  @NotNull
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
