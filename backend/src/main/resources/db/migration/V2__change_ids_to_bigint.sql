-- Align database identifiers with Java Long fields.
-- Preserve existing records, primary keys, sequences, and foreign-key behavior.

ALTER TABLE pedido
    DROP CONSTRAINT fk_pedido_cliente;

ALTER TABLE item_pedido
    DROP CONSTRAINT fk_item_pedido_pedido,
    DROP CONSTRAINT fk_item_pedido_produto;

ALTER TABLE usuario
    ALTER COLUMN id TYPE BIGINT;

ALTER TABLE cliente
    ALTER COLUMN id TYPE BIGINT;

ALTER TABLE produto
    ALTER COLUMN id TYPE BIGINT;

ALTER TABLE pedido
    ALTER COLUMN id TYPE BIGINT,
    ALTER COLUMN cliente_id TYPE BIGINT;

ALTER TABLE item_pedido
    ALTER COLUMN pedido_id TYPE BIGINT,
    ALTER COLUMN produto_id TYPE BIGINT;

ALTER SEQUENCE usuario_id_seq AS BIGINT;
ALTER SEQUENCE cliente_id_seq AS BIGINT;
ALTER SEQUENCE produto_id_seq AS BIGINT;
ALTER SEQUENCE pedido_id_seq AS BIGINT;

ALTER TABLE pedido
    ADD CONSTRAINT fk_pedido_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE;

ALTER TABLE item_pedido
    ADD CONSTRAINT fk_item_pedido_pedido
        FOREIGN KEY (pedido_id)
        REFERENCES pedido(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    ADD CONSTRAINT fk_item_pedido_produto
        FOREIGN KEY (produto_id)
        REFERENCES produto(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE;
