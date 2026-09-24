package Application.PediJa.Repositories;

import Application.PediJa.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

  @Query("select u from User u where u.login = :login")
  Optional<User> findByLogin(@Param("login") String login);

  @Query("select case when count(u) > 0 then true else false end from User u where u.login = :login")
  boolean existsByLogin(@Param("login") String login);
}
