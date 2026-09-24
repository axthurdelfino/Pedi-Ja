package Application.PediJa.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Application.PediJa.Dto.RequestUser;
import Application.PediJa.Dto.ResponseUser;
import Application.PediJa.services.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public ResponseEntity<List<ResponseUser>> findAll() {
    return ResponseEntity.ok(userService.findAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ResponseUser> findById(@PathVariable Long id) {
    return ResponseEntity.ok(userService.findById(id));
  }

  @PostMapping
  public ResponseEntity<ResponseUser> insert(@Valid @RequestBody RequestUser dto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(userService.insert(dto));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ResponseUser> update(
      @PathVariable Long id, @Valid @RequestBody RequestUser dto) {
    return ResponseEntity.ok(userService.update(id, dto));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
