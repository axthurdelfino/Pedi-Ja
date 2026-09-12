package Application.PediJa.Dto;

import java.time.LocalDateTime;

public class ResponseUser {

  private Long id;
  private String login;
  private LocalDateTime dataCriacao;

  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public String getLogin() {
    return login;
  }
  public void setLogin(String login) {
    this.login = login;
  }
  public LocalDateTime getData_criacao() {
    return data_criacao;
  }
  public void setData_criacao(LocalDateTime data_criacao) {
    this.data_criacao = data_criacao;
  }
  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((id == null) ? 0 : id.hashCode());
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
    ResponseUser other = (ResponseUser) obj;
    if (id == null) {
      if (other.id != null)
        return false;
    } else if (!id.equals(other.id))
      return false;
    return true;
  }
}
