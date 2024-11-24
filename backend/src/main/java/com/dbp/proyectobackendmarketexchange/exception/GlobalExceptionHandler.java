package com.dbp.proyectobackendmarketexchange.exception;

import com.dbp.proyectobackendmarketexchange.auth.exception.UserAlreadyExistException;
import com.dbp.proyectobackendmarketexchange.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;


@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }


    @ExceptionHandler(InvalidUserFieldException.class)
    public ResponseEntity<String> handleInvalidUserFieldException(InvalidUserFieldException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UnauthorizeOperationException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public String handleUnauthorizeOperationException(UnauthorizeOperationException e) {return e.getMessage();}

    @ExceptionHandler(UserAlreadyExistException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String handleUserAlreadyExistException(UserAlreadyExistException e) {return e.getMessage();}
}
