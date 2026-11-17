package application.pedija.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import application.pedija.entities.StockMovement;
import application.pedija.entities.enums.StockMovementType;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
  @Query("select m from StockMovement m "
      + "where (:produtoId is null or m.produto.id = :produtoId) "
      + "and (:tipo is null or m.tipo = :tipo) "
      + "and m.dataMovimentacao >= :inicio "
      + "and m.dataMovimentacao <= :fim "
      + "order by m.dataMovimentacao desc, m.id desc")
  List<StockMovement> search(@Param("produtoId") Long produtoId,
      @Param("tipo") StockMovementType tipo,
      @Param("inicio") LocalDateTime inicio,
      @Param("fim") LocalDateTime fim);
}
