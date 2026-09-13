package Application.PediJa.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import Application.PediJa.Dto.RequestProduct;
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
    Optional<Product> result = productRepository.findById(id);
    Product product = result.orElseThrow(() -> new ResourceNotFoundException("Product", id));

    return productMapper.toResponse(product);
  }

  public ResponseProduct insert(RequestProduct dto) {
    Product pro = productMapper.toEntity(dto);
    Product saved = productRepository.save(pro);

    return productMapper.toResponse(saved);
  }
}
