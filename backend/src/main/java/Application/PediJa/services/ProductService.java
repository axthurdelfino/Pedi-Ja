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

@org.springframework.transaction.annotation.Transactional
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

  public List<ResponseProduct> findAll(String nome) {
    List<Product> products = nome == null || nome.isBlank()
        ? productRepository.findAll()
        : productRepository.findByNomeContaining(nome);

    return products.stream().map(productMapper::toResponse).toList();
  }

  public List<ResponseProduct> findAll() {
    return findAll(null);
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

  public ResponseProduct update(Long id, RequestProduct dto) {
    Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product", id));
    productMapper.updateEntity(product, dto);
    Product updated = productRepository.save(product);

    return productMapper.toResponse(updated);
  }

  public void delete(Long id) {
    Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product", id));
    productRepository.delete(product);
  }
}
