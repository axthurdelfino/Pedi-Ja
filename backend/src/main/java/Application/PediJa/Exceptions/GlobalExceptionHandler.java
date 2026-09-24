package Application.PediJa.Exceptions;

import java.time.Instant;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
  public ResponseEntity<StandardError> integrity(Exception e, HttpServletRequest request) {
    return failure(HttpStatus.CONFLICT, "Dados duplicados ou registro vinculado a outros dados.", request);
  }
  @ExceptionHandler(org.springframework.dao.OptimisticLockingFailureException.class)
  public ResponseEntity<StandardError> concurrent(Exception e, HttpServletRequest request) {
    return failure(HttpStatus.CONFLICT, "Os dados foram alterados por outra operação. Atualize a página e tente novamente.", request);
  }
  @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
  public ResponseEntity<StandardError> authentication(Exception e, HttpServletRequest request) {
    return failure(HttpStatus.UNAUTHORIZED, "Login ou senha inválidos.", request);
  }
  @ExceptionHandler({org.springframework.http.converter.HttpMessageNotReadableException.class,
      org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class})
  public ResponseEntity<StandardError> malformed(Exception e, HttpServletRequest request) {
    return failure(HttpStatus.BAD_REQUEST, "Verifique os tipos e os valores enviados.", request);
  }
  private ResponseEntity<StandardError> failure(HttpStatus status, String message, HttpServletRequest request) {
    return ResponseEntity.status(status).body(new StandardError(Instant.now(), status.value(),
        status.getReasonPhrase(), message, request.getRequestURI()));
  }


  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<StandardError> resourceNotFound(ResourceNotFoundException e, HttpServletRequest request) {

    StandardError error = new StandardError(Instant.now(), HttpStatus.NOT_FOUND.value(), "Resource not Found",
        e.getMessage(),
        request.getRequestURI());

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
  }

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<StandardError> businessException(BusinessException e, HttpServletRequest request) {

    StandardError error = new StandardError(Instant.now(), HttpStatus.UNPROCESSABLE_CONTENT.value(),
        "Business Exception", e.getMessage(), request.getRequestURI());

    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(error);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<StandardError> methodArgumentNotValid(
      MethodArgumentNotValidException e, HttpServletRequest request) {

    String message = e.getBindingResult().getFieldErrors().stream()
        .map(error -> error.getField() + ": " + error.getDefaultMessage())
        .collect(Collectors.joining("; "));

    StandardError error = new StandardError(Instant.now(), HttpStatus.BAD_REQUEST.value(), "Validation error", message, request.getRequestURI());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }
}
