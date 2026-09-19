package Application.PediJa.Entities.Enums;

public enum OrderStatus {

  PENDENTE,
  PAGO,
  ENVIADO,
  CANCELADO;

  public boolean validarTrans(OrderStatus novoStatus) {
    if (novoStatus == null) {
      return false;
    }

    if (this == novoStatus) {
      return true;
    }

    return switch (this) {
      case PENDENTE -> novoStatus == PAGO || novoStatus == CANCELADO;
      case PAGO -> novoStatus == ENVIADO;
      case ENVIADO, CANCELADO -> false;
    };
  }
}
