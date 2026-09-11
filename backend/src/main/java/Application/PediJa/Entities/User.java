package Application.PediJa.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario")
public class User {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

  private String login;

  @Column(name = "senha") private String password;

  @Column(name = "data_criacao") private LocalDateTime dataCriacao;

  public User() {}

  public User(Long id, String login, String password, LocalDateTime data) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.dataCriacao = data;
  }

  public Long getId() { return id; }

  public void setId(Long id) { this.id = id; }

  public String getLogin() { return login; }

  public void setLogin(String login) { this.login = login; }

  public String getPassword() { return password; }

  public void setPassword(String password) { this.password = password; }

  public LocalDateTime getDataCriacao() { return dataCriacao; }

  public void setDataCriacao(LocalDateTime dataCriacao) {
    this.dataCriacao = dataCriacao;
  }
}
