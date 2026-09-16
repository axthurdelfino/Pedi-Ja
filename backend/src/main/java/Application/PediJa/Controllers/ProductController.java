package Application.PediJa.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Application.PediJa.Dto.RequestProduct;
import Application.PediJa.Dto.ResponseProduct;
import Application.PediJa.services.ProductService;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/products")
public class ProductController {

  @Autowired
  ProductService services;

  @GetMapping
  public ResponseEntity<List<ResponseProduct>> findAll() {

    List<ResponseProduct> list = services.findAll();
    return ResponseEntity.ok().body(list);
  }

  @GetMapping(value = "/{id}")
  @Valid
  public ResponseEntity<ResponseProduct> findById(@PathVariable Long id) {
    ResponseProduct product = services.findById(id);
    return ResponseEntity.ok().body(product);
  }

  @PostMapping
  @Valid
  public ResponseEntity<ResponseProduct> insert(@Valid @RequestBody RequestProduct obj) {
    ResponseProduct product = services.insert(obj);
    HttpStatus status = HttpStatus.CREATED;
    return ResponseEntity.status(status).body(product);
  }


}
