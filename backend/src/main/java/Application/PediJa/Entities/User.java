package Application.PediJa.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import Application.PediJa.Entities.Enums.Role;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario")
public class User {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

  private String login;

  @Column(name = "senha") private String password;

  @Column(name = "data_criacao") private LocalDateTime dataCriacao;

  @Enumerated(EnumType.STRING)
  @Column(name = "role", nullable = false)
  private Role role;

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

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  @PrePersist
  private void prePersist() {
    if (dataCriacao == null) {
      dataCriacao = LocalDateTime.now();
    }
    if (role == null) {
      role = Role.USER;
    }
  }
}
