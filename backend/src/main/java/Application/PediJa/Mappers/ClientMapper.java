package Application.PediJa.Mappers;

import Application.PediJa.Dto.RequestClient;
import Application.PediJa.Dto.ResponseClient;
import Application.PediJa.Entities.Client;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

  public Client toEntity(RequestClient dto) {
    Client client = new Client();
    client.setNome(dto.getNome());
    client.setCpf(dto.getCpf());
    client.setTelefone(dto.getTelefone());
    client.setEmail(dto.getEmail());
    client.setEndereco(dto.getEndereco());
    return client;
  }

  public ResponseClient toResponse(Client client) {
    ResponseClient response = new ResponseClient();
    response.setId(client.getId());
    response.setNome(client.getNome());
    response.setCpf(client.getCpf());
    response.setTelefone(client.getTelefone());
    response.setEmail(client.getEmail());
    response.setEndereco(client.getEndereco());
    response.setDataCadastro(client.getDataCadastro());
    return response;
  }
}
