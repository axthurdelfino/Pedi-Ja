package Application.PediJa.Mappers;

import Application.PediJa.Dto.RequestProduct;
import Application.PediJa.Dto.ResponseProduct;
import Application.PediJa.Entities.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

  public Product toEntity(RequestProduct dto) {
    Product product = new Product();
    product.setNome(dto.getNome());
    product.setDescricao(dto.getDescricao());
    product.setPreco(dto.getPreco());
    product.setEstoque(dto.getEstoque());
    return product;
  }

  public ResponseProduct toResponse(Product product) {
    ResponseProduct response = new ResponseProduct();
    response.setId(product.getId());
    response.setNome(product.getNome());
    response.setDescricao(product.getDescricao());
    response.setPreco(product.getPreco());
    response.setEstoque(product.getEstoque());
    return response;
  }
}
