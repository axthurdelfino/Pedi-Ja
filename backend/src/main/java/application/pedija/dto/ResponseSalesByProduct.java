package application.pedija.dto;

import java.math.BigDecimal;

public record ResponseSalesByProduct(Long produtoId, String produtoNome, Long quantidadeVendida, BigDecimal valorTotal) {}
