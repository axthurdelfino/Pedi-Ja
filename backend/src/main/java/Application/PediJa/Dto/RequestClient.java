package Application.PediJa.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RequestClient {

  @NotBlank
  @Size(min = 3)
  private String nome;

  @NotBlank
  @Size(min = 11, max = 14)
  private String cpf;

  @NotBlank
  @Size(min = 8, max = 14)
  private String telefone;

  @NotBlank
  @Email
  private String email;

  @NotBlank
  @Size(min = 10)
  private String endereco;

  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public String getCpf() {
    return cpf;
  }

  public void setCpf(String cpf) {
    this.cpf = cpf;
  }

  public String getTelefone() {
    return telefone;
  }

  public void setTelefone(String telefone) {
    this.telefone = telefone;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getEndereco() {
    return endereco;
  }

  public void setEndereco(String endereco) {
    this.endereco = endereco;
  }
}
