package Application.PediJa.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import Application.PediJa.Dto.RequestClient;
import Application.PediJa.Dto.ResponseClient;
import Application.PediJa.Entities.Client;
import Application.PediJa.Exceptions.ResourceNotFoundException;
import Application.PediJa.Mappers.ClientMapper;
import Application.PediJa.Repositories.ClientRepository;

@Service
public class ClientService {


  private ClientRepository clientRepository;
  private ClientMapper clientMapper;

  public ClientService(ClientRepository clientRepository, ClientMapper clientMapper) {
    this.clientRepository = clientRepository;
    this.clientMapper = clientMapper;
  }

  public List<ResponseClient> findAll() {
    return clientRepository.findAll().stream().map(clientMapper::toResponse).toList();
  }

  public ResponseClient findById(Long id) {
    Optional<Client> cliente = clientRepository.findById(id);
    Client client = cliente.orElseThrow(() -> new ResourceNotFoundException("Client", id));

    return clientMapper.toResponse(client);
  }

  public ResponseClient insert(RequestClient dto) {
    Client client = clientMapper.toEntity(dto);
    Client saved = clientRepository.save(client);

    return clientMapper.toResponse(saved);
  }

  public ResponseClient update(Long id, RequestClient dto) {
    Client cliente = clientRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Client", id));
    clientMapper.updateEntity(cliente, dto);
    Client updated = clientRepository.save(cliente);
    return clientMapper.toResponse(updated);
  }

  public void delete(Long id) {
    Client client = clientRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Client", id));
    clientRepository.delete(client);
  }
}
