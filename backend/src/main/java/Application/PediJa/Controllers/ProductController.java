package Application.PediJa.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Application.PediJa.Dto.ResponseProduct;
import Application.PediJa.services.ProductService;

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
  public ResponseEntity<ResponseProduct> findById(@PathVariable Long id){
    ResponseProduct product = services.findById(id);
    return ResponseEntity.ok().body(product);
  }

}
