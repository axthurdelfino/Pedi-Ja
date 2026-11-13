CREATE TABLE movimentacao_estoque (
    id BIGSERIAL PRIMARY KEY,
    produto_id BIGINT NOT NULL,
    pedido_id BIGINT,
    tipo VARCHAR(10) NOT NULL,
    quantidade INTEGER NOT NULL,
    data_movimentacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descricao VARCHAR(255),
    CONSTRAINT fk_movimentacao_estoque_produto FOREIGN KEY (produto_id)
        REFERENCES produto(id) ON DELETE RESTRICT,
    CONSTRAINT fk_movimentacao_estoque_pedido FOREIGN KEY (pedido_id)
        REFERENCES pedido(id) ON DELETE SET NULL,
    CONSTRAINT chk_movimentacao_estoque_tipo CHECK (tipo IN ('ENTRADA', 'SAIDA')),
    CONSTRAINT chk_movimentacao_estoque_quantidade CHECK (quantidade > 0)
);

CREATE INDEX idx_movimentacao_estoque_produto ON movimentacao_estoque(produto_id);
CREATE INDEX idx_movimentacao_estoque_data ON movimentacao_estoque(data_movimentacao DESC);
CREATE INDEX idx_movimentacao_estoque_pedido ON movimentacao_estoque(pedido_id);
