package Application.PediJa.Repositories;

import Application.PediJa.Entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {

  @Query("select c from Client c where lower(c.nome) like lower(concat('%', :nome, '%')) order by c.nome")
  List<Client> findByNomeContaining(@Param("nome") String nome);
}
