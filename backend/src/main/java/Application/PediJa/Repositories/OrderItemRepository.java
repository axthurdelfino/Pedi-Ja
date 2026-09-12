package Application.PediJa.Repositories;

import Application.PediJa.Entities.OrderItem;
import Application.PediJa.Entities.PK.OrderItemPK;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemPK> {
}
