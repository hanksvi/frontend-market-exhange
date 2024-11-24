package com.dbp.proyectobackendmarketexchange.exception;

public class UnauthorizeOperationException extends RuntimeException{
  public UnauthorizeOperationException(String message) {
    super(message);
  }
}