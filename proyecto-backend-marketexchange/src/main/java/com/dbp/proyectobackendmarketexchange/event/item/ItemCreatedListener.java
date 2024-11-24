package com.dbp.proyectobackendmarketexchange.event.item;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.context.event.EventListener;

@Component
public class ItemCreatedListener {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Async  // Hacerlo asíncrono para no bloquear el flujo principal
    @EventListener
    public void manejarItemCreatedEvent(ItemCreatedEvent event) throws MessagingException {
        // Obtener datos del ítem creado
        String emailUsuario = event.getItem().getUsuario().getEmail();
        String itemName = event.getItem().getName();
        String categoryName = event.getItem().getCategory().getName();

        // Preparar el contexto para Thymeleaf
        Context context = new Context();
        context.setVariable("itemName", itemName);
        context.setVariable("categoryName", categoryName);
        context.setVariable("emailUsuario", emailUsuario);

        // Procesar la plantilla HTML de Thymeleaf
        String contenidoHtml = templateEngine.process("item-created-email", context);

        // Enviar el correo al usuario que publicó el ítem
        enviarCorreo(emailUsuario, contenidoHtml);

        System.out.println("Correo enviado a: " + emailUsuario + " por la creación del ítem.");
    }

    private void enviarCorreo(String email, String contenidoHtml) throws MessagingException {
        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, "utf-8");

        helper.setTo(email);
        helper.setSubject("¡Has creado una nueva publicación en MarketExchange!");
        helper.setText(contenidoHtml, true);

        mailSender.send(mensaje);
    }
}