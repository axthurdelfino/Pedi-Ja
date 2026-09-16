package Application.PediJa.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RequestClient {

  @NotBlank
  @Size(min = 3, max = 100)
  private String nome;

  @NotBlank
  @Pattern(regexp = "(?:\\d{11}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2})")
  private String cpf;

  @NotBlank
  @Size(min = 8, max = 20)
  private String telefone;

  @NotBlank
  @Email
  @Size(max = 100)
  private String email;

  @NotBlank
  @Size(min = 10, max = 255)
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
