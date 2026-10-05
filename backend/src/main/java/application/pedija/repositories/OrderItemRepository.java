package application.pedija.repositories;

import application.pedija.entities.OrderItem;
import application.pedija.entities.pk.OrderItemPK;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemPK> {
}
