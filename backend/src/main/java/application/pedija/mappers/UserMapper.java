package application.pedija.mappers;

import application.pedija.dto.RequestUser;
import application.pedija.dto.ResponseUser;
import application.pedija.entities.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

  public User toEntity(RequestUser dto) {
    User user = new User();
    user.setLogin(dto.getLogin());
    user.setPassword(dto.getSenha());
    return user;
  }

  public ResponseUser toResponse(User user) {
    ResponseUser response = new ResponseUser();
    response.setId(user.getId());
    response.setLogin(user.getLogin());
    response.setDataCriacao(user.getDataCriacao());
    response.setRole(user.getRole());
    return response;
  }
}
