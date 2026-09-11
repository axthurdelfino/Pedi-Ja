package Application.PediJa.Entities.PK;

import java.io.Serializable;

import jakarta.persistence.Embeddable;

@Embeddable
public class OrderItemPK implements Serializable{

  private static final long serialVersionUID = 1L;

    private Long pedidoId;
    private Long produtoId;

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
