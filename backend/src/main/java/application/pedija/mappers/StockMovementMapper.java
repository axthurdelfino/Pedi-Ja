package application.pedija.mappers;

import org.springframework.stereotype.Component;

import application.pedija.dto.ResponseStockMovement;
import application.pedija.entities.StockMovement;

@Component
public class StockMovementMapper {
  public ResponseStockMovement toResponse(StockMovement movement) {
    ResponseStockMovement response = new ResponseStockMovement();
    response.setId(movement.getId());
    response.setProdutoId(movement.getProduto().getId());
    response.setProdutoNome(movement.getProduto().getNome());
    response.setTipo(movement.getTipo());
    response.setQuantidade(movement.getQuantidade());
    response.setDataMovimentacao(movement.getDataMovimentacao());
    response.setDescricao(movement.getDescricao());
    if (movement.getPedido() != null) response.setPedidoId(movement.getPedido().getId());
    return response;
  }
}
