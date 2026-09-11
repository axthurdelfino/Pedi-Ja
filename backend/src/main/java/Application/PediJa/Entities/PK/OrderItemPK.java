package Application.PediJa.Entities.PK;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class OrderItemPK implements Serializable{

  private static final long serialVersionUID = 1L;

    @Column(name = "pedido_id", nullable = false)
    private Long pedidoId;
    @Column(name = "produto_id", nullable = false)
    private Long produtoId;

    public OrderItemPK(){}

    public OrderItemPK(Long pedidoId, Long produtoId) {
      this.pedidoId = pedidoId;
      this.produtoId = produtoId;
    }

    public Long getPedidoId() {
      return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
      this.pedidoId = pedidoId;
    }

    public Long getProdutoId() {
      return produtoId;
    }

    public void setProdutoId(Long produtoId) {
      this.produtoId = produtoId;
    }

    @Override
    public int hashCode() {
      final int prime = 31;
      int result = 1;
      result = prime * result + ((pedidoId == null) ? 0 : pedidoId.hashCode());
      result = prime * result + ((produtoId == null) ? 0 : produtoId.hashCode());
      return result;
    }
    @Override
    public boolean equals(Object obj) {
      if (this == obj)
        return true;
      if (obj == null)
        return false;
      if (getClass() != obj.getClass())
        return false;
      OrderItemPK other = (OrderItemPK) obj;
      if (pedidoId == null) {
        if (other.pedidoId != null)
          return false;
      } else if (!pedidoId.equals(other.pedidoId))
        return false;
      if (produtoId == null) {
        if (other.produtoId != null)
          return false;
      } else if (!produtoId.equals(other.produtoId))
        return false;
      return true;
    }
}
