package Application.PediJa.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import Application.PediJa.Dto.RequestClient;
import Application.PediJa.Dto.ResponseClient;
import Application.PediJa.services.ClientService;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/clientes")
public class ClientController {

  @Autowired
  private ClientService service;

  @GetMapping
  public ResponseEntity<List<ResponseClient>> findAll() {
    List<ResponseClient> clients = service.findAll();

    return ResponseEntity.ok().body(clients);
  }

  @GetMapping(value = "/{id}")
  public ResponseEntity<ResponseClient> findById(@PathVariable Long id){
    ResponseClient client = service.findById(id);
    return ResponseEntity.ok().body(client);
  }

  @PostMapping
  public ResponseEntity<ResponseClient> insert(@Valid @RequestBody RequestClient dto) {
    ResponseClient cliente = service.insert(dto);
    HttpStatus status = HttpStatus.CREATED;
    return ResponseEntity.status(status).body(cliente);
  }

  @PutMapping(value = "/{id}")
  public ResponseEntity<ResponseClient> update(@PathVariable Long id, @Valid @RequestBody RequestClient dto) {
    ResponseClient cliente = service.update(id, dto);
    return ResponseEntity.ok().body(cliente);
  }

  @DeleteMapping(value = "/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }

}
