package Application.PediJa.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Application.PediJa.Dto.RequestOrder;
import Application.PediJa.Dto.RequestOrderStatus;
import Application.PediJa.Dto.ResponseOrder;
import Application.PediJa.Entities.Enums.OrderStatus;
import Application.PediJa.services.OrderService;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/pedidos")
public class OrderController {

  OrderService services;

  public OrderController(OrderService services){
      this.services = services;
  }

  @GetMapping
  public ResponseEntity<List<ResponseOrder>> findAll(
      @RequestParam(required = false) OrderStatus status,
      @RequestParam(required = false) Long clienteId) {
    List<ResponseOrder> orders;

    if (status != null && clienteId != null) {
      orders = services.findByStatusAndClientId(status, clienteId);
    } else if (status != null) {
      orders = services.findByStatus(status);
    } else if (clienteId != null) {
      orders = services.findByClientId(clienteId);
    } else {
      orders = services.findAll();
    }

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

  @PatchMapping(value = "/{id}/status")
  public ResponseEntity<ResponseOrder> updatedStatus(@PathVariable Long id, @Valid @RequestBody RequestOrderStatus dto) {
    ResponseOrder atualizar = services.updatedOrder(id, dto);
    HttpStatus status = HttpStatus.OK;
    return ResponseEntity.status(status).body(atualizar);
  }
}
