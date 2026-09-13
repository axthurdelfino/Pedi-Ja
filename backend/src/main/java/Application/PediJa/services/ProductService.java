package Application.PediJa.services;

import java.util.List;

import org.springframework.stereotype.Service;

import Application.PediJa.Dto.ResponseProduct;
import Application.PediJa.Entities.Product;
import Application.PediJa.Exceptions.ResourceNotFoundException;
import Application.PediJa.Mappers.ProductMapper;
import Application.PediJa.Repositories.ProductRepository;

@Service
public class ProductService {

  private ProductRepository productRepository;
  private ProductMapper productMapper;

  public ProductService(

      ProductRepository productRepository,
      ProductMapper productMapper) {

    this.productRepository = productRepository;
    this.productMapper = productMapper;
  }

  public List<ResponseProduct> findAll() {
    return productRepository.findAll().stream().map(productMapper::toResponse).toList();
  }

  public ResponseProduct findById(Long id) {
    Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product", id));

    return productMapper.toResponse(product);
  }
}
