-- ============================================================
-- PEDIJA - INITIAL SCHEMA
-- Version: V1
-- ============================================================


-- ============================================================
-- USUARIO
-- ============================================================

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- CLIENTE
-- ============================================================

CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    endereco VARCHAR(255),
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- PRODUTO
-- ============================================================

CREATE TABLE produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,

    CONSTRAINT chk_produto_preco
        CHECK (preco >= 0),

    CONSTRAINT chk_produto_estoque
        CHECK (estoque >= 0)
);


-- ============================================================
-- PEDIDO
-- ============================================================

CREATE TABLE pedido (
    id SERIAL PRIMARY KEY,

    cliente_id INT NOT NULL,

    data_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',

    forma_pagamento VARCHAR(50),

    valor_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

    CONSTRAINT chk_pedido_status
        CHECK (
            status IN (
                'PENDENTE',
                'PAGO',
                'ENVIADO',
                'CANCELADO'
            )
        ),

    CONSTRAINT chk_pedido_valor_total
        CHECK (valor_total >= 0),

    CONSTRAINT fk_pedido_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);


-- ============================================================
-- ITEM_PEDIDO
-- ============================================================

CREATE TABLE item_pedido (
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,

    quantidade INT NOT NULL,

    preco_unitario DECIMAL(10, 2) NOT NULL,

    CONSTRAINT pk_item_pedido
        PRIMARY KEY (pedido_id, produto_id),

    CONSTRAINT chk_item_pedido_quantidade
        CHECK (quantidade > 0),

    CONSTRAINT chk_item_pedido_preco
        CHECK (preco_unitario >= 0),

    CONSTRAINT fk_item_pedido_pedido
        FOREIGN KEY (pedido_id)
        REFERENCES pedido(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_item_pedido_produto
        FOREIGN KEY (produto_id)
        REFERENCES produto(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
