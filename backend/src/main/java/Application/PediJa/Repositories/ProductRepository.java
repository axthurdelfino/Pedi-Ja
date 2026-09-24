package Application.PediJa.Repositories;

import Application.PediJa.Entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

  @Query("select p from Product p where lower(p.nome) like lower(concat('%', :nome, '%')) order by p.nome")
  List<Product> findByNomeContaining(@Param("nome") String nome);
}
