package Application.PediJa.Exceptions;

public class ResourceNotFoundException extends RuntimeException {

  public ResourceNotFoundException(String resource, Object id) {
    super(resource + " not found. Id: " + id);
  }
}
