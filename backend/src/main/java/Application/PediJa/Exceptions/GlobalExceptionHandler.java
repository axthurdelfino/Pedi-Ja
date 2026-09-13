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

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<StandardError> resourceNotFound(ResourceNotFoundException e, HttpServletRequest request){
    StandardError error = new StandardError(Instant.now(), HttpStatus.NOT_FOUND.value(), "Resource not Found", e.getMessage(),
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
