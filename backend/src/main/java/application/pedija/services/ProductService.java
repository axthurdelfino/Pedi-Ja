package application.pedija.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import application.pedija.dto.RequestProduct;
import application.pedija.dto.ResponseProduct;
import application.pedija.entities.Product;
import application.pedija.entities.enums.StockMovementType;
import application.pedija.exceptions.ResourceNotFoundException;
import application.pedija.mappers.ProductMapper;
import application.pedija.repositories.ProductRepository;

@org.springframework.transaction.annotation.Transactional
@Service
public class ProductService {

  private ProductRepository productRepository;
  private ProductMapper productMapper;
  private StockMovementService stockMovementService;

  public ProductService(

    ProductRepository productRepository,
    ProductMapper productMapper,
    StockMovementService stockMovementService) {

    this.productRepository = productRepository;
    this.productMapper = productMapper;
    this.stockMovementService = stockMovementService;
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
    if (saved.getEstoque() > 0) {
      stockMovementService.recordExistingStockChange(saved, StockMovementType.ENTRADA, saved.getEstoque(), null,
          "Entrada gerada pela criação do produto");
    }

    return productMapper.toResponse(saved);
  }

  public ResponseProduct update(Long id, RequestProduct dto) {
    Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product", id));
    int estoqueAnterior = product.getEstoque();
    productMapper.updateEntity(product, dto);
    Product updated = productRepository.save(product);
    int diferenca = updated.getEstoque() - estoqueAnterior;
    if (diferenca > 0) {
      stockMovementService.recordExistingStockChange(updated, StockMovementType.ENTRADA, diferenca, null,
          "Entrada gerada pelo ajuste do produto");
    } else if (diferenca < 0) {
      stockMovementService.recordExistingStockChange(updated, StockMovementType.SAIDA, -diferenca, null,
          "Saída gerada pelo ajuste do produto");
    }

    return productMapper.toResponse(updated);
  }

  public void delete(Long id) {
    Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product", id));
    productRepository.delete(product);
  }
}
