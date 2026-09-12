package Application.PediJa.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RequestUser {

  @NotBlank
  @Size(min = 5)
  private String login;

  @NotBlank
  @Size(min = 8)
  private String senha;

  public String getLogin() {
    return login;
  }

  public void setLogin(String login) {
    this.login = login;
  }

  public String getSenha() {
    return senha;
  }

  public void setSenha(String senha) {
    this.senha = senha;
  }
}
