package application.pedija.repositories;

import application.pedija.entities.Order;
import application.pedija.entities.enums.OrderStatus;
import application.pedija.dto.ResponsePaymentPivot;
import application.pedija.dto.ResponseSalesByProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
  @Query("select new application.pedija.dto.ResponseSalesByProduct(i.produto.id, i.produto.nome, sum(i.quantidade), "
      + "sum(i.quantidade * i.precoUnitario)) from OrderItem i where i.pedido.orderStatus in :statuses "
      + "and (:inicio is null or i.pedido.dataPedido >= :inicio) "
      + "and (:fim is null or i.pedido.dataPedido <= :fim) "
      + "group by i.produto.id, i.produto.nome order by sum(i.quantidade * i.precoUnitario) desc")
  List<ResponseSalesByProduct> salesByProduct(@Param("statuses") List<OrderStatus> statuses,
      @Param("inicio") java.time.LocalDateTime inicio, @Param("fim") java.time.LocalDateTime fim);

  @Query("select new application.pedija.dto.ResponsePaymentPivot(i.produto.id, i.produto.nome, "
      + "sum(case when i.pedido.paymentMethod = application.pedija.entities.enums.PaymentMethod.PIX then i.quantidade * i.precoUnitario else 0 end), "
      + "sum(case when i.pedido.paymentMethod = application.pedija.entities.enums.PaymentMethod.CARTAO then i.quantidade * i.precoUnitario else 0 end), "
      + "sum(case when i.pedido.paymentMethod = application.pedija.entities.enums.PaymentMethod.DINHEIRO then i.quantidade * i.precoUnitario else 0 end), "
      + "sum(i.quantidade * i.precoUnitario)) from OrderItem i where i.pedido.orderStatus in :statuses "
      + "and (:inicio is null or i.pedido.dataPedido >= :inicio) "
      + "and (:fim is null or i.pedido.dataPedido <= :fim) "
      + "group by i.produto.id, i.produto.nome order by i.produto.nome")
  List<ResponsePaymentPivot> salesPivotByPayment(@Param("statuses") List<OrderStatus> statuses,
      @Param("inicio") java.time.LocalDateTime inicio, @Param("fim") java.time.LocalDateTime fim);
  @Query("select o from Order o where (:status is null or o.orderStatus = :status) "
      + "and (:clienteId is null or o.client.id = :clienteId) "
      + "and (:minPrice is null or o.valorTotal >= :minPrice) "
      + "and (:maxPrice is null or o.valorTotal <= :maxPrice) order by o.dataPedido desc, o.id desc")
  List<Order> search(@Param("status") OrderStatus status, @Param("clienteId") Long clienteId,
      @Param("minPrice") java.math.BigDecimal minPrice, @Param("maxPrice") java.math.BigDecimal maxPrice);


  @Query("select o from Order o where o.orderStatus = :status order by o.dataPedido desc")
  List<Order> findByStatus(@Param("status") OrderStatus status);

  @Query("select o from Order o where o.client.id = :clientId order by o.dataPedido desc")
  List<Order> findByClientId(@Param("clientId") Long clientId);

  @Query("select o from Order o where o.orderStatus = :status and o.client.id = :clientId order by o.dataPedido desc")
  List<Order> findByStatusAndClientId(@Param("status") OrderStatus status, @Param("clientId") Long clientId);
}
