package Application.PediJa.Exceptions;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<StandardError> resourceNotFound(ResourceNotFoundException e, HttpServletRequest request){
    StandardError error = new StandardError(Instant.now(), HttpStatus.NOT_FOUND.value(), "Resource not Found", e.getMessage(),
        request.getRequestURI());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
  }
  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<StandardError> businessException(BusinessException e, HttpServletRequest request) {
    StandardError error = new StandardError(Instant.now(), HttpStatus.UNPROCESSABLE_ENTITY.value(),
        "Businnes Exception", e.getMessage(), request.getRequestURI());
    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(error);
  }
}
