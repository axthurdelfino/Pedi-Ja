package Application.PediJa.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Application.PediJa.Dto.RequestOrder;
import Application.PediJa.Dto.ResponseOrder;
import Application.PediJa.services.OrderService;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/pedidos")
public class OrderController {

  @Autowired
  OrderService services;

  @GetMapping
  public ResponseEntity<List<ResponseOrder>> findAll() {
    List<ResponseOrder> orders = services.findAll();

    return ResponseEntity.ok().body(orders);
  }
  @GetMapping(value = "/{id}")
  public ResponseEntity<ResponseOrder> findById(@PathVariable Long id) {
    ResponseOrder order = services.findById(id);

    return ResponseEntity.ok().body(order);
  }

  @PostMapping
  public ResponseEntity<ResponseOrder> insert(@Valid @RequestBody RequestOrder dto) {
    ResponseOrder order = services.insert(dto);
    HttpStatus status = HttpStatus.CREATED;
    return ResponseEntity.status(status).body(order);
  }

  @DeleteMapping(value = "/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    services.delete(id);
    return ResponseEntity.noContent().build();
  }
}
