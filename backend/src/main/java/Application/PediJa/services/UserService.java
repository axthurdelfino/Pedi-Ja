package Application.PediJa.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import Application.PediJa.Dto.RequestUser;
import Application.PediJa.Dto.ResponseUser;
import Application.PediJa.Entities.User;
import Application.PediJa.Entities.Enums.Role;
import Application.PediJa.Exceptions.BusinessException;
import Application.PediJa.Exceptions.ResourceNotFoundException;
import Application.PediJa.Mappers.UserMapper;
import Application.PediJa.Repositories.UserRepository;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.userMapper = userMapper;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional(readOnly = true)
  public List<ResponseUser> findAll() {
    return userRepository.findAll().stream().map(userMapper::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public ResponseUser findById(Long id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User", id));
    return userMapper.toResponse(user);
  }

  @Transactional
  public ResponseUser insert(RequestUser dto) {
    if (userRepository.existsByLogin(dto.getLogin())) {
      throw new BusinessException("Login already exists");
    }

    User user = userMapper.toEntity(dto);
    user.setPassword(passwordEncoder.encode(dto.getSenha()));
    user.setRole(Role.USER);
    return userMapper.toResponse(userRepository.save(user));
  }

  @Transactional
  public ResponseUser update(Long id, RequestUser dto) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User", id));

    userRepository.findByLogin(dto.getLogin()).ifPresent(existing -> {
      if (!existing.getId().equals(id)) {
        throw new BusinessException("Login already exists");
      }
    });

    user.setLogin(dto.getLogin());
    user.setPassword(passwordEncoder.encode(dto.getSenha()));
    return userMapper.toResponse(userRepository.save(user));
  }

  @Transactional
  public void delete(Long id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User", id));
    userRepository.delete(user);
  }

}
