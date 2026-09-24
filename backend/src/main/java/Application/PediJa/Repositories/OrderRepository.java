package Application.PediJa.Repositories;

import Application.PediJa.Entities.Order;
import Application.PediJa.Entities.Enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
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
