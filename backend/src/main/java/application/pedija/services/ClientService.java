package application.pedija.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import application.pedija.dto.RequestClient;
import application.pedija.dto.ResponseClient;
import application.pedija.entities.Client;
import application.pedija.exceptions.ResourceNotFoundException;
import application.pedija.mappers.ClientMapper;
import application.pedija.repositories.ClientRepository;

@org.springframework.transaction.annotation.Transactional
@Service
public class ClientService {


  private ClientRepository clientRepository;
  private ClientMapper clientMapper;

  public ClientService(ClientRepository clientRepository, ClientMapper clientMapper) {
    this.clientRepository = clientRepository;
    this.clientMapper = clientMapper;
  }

  public List<ResponseClient> findAll(String nome) {
    List<Client> clients = nome == null || nome.isBlank()
        ? clientRepository.findAll()
        : clientRepository.findByNomeContaining(nome);

    return clients.stream().map(clientMapper::toResponse).toList();
  }

  public List<ResponseClient> findAll() {
    return findAll(null);
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
