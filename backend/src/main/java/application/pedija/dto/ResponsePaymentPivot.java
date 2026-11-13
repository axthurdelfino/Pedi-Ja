package application.pedija.dto;

import java.math.BigDecimal;

public record ResponsePaymentPivot(Long produtoId, String produtoNome, BigDecimal pix, BigDecimal cartao,
    BigDecimal dinheiro, BigDecimal total) {}
