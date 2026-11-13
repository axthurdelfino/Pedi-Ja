-- Dados demonstrativos para apresentação: clientes, produtos, pedidos e estoque.
-- A guarda evita duplicação caso a base já tenha recebido esta carga manualmente.
DO $$
DECLARE
    cliente_ana_id BIGINT;
    cliente_bruno_id BIGINT;
    cliente_carla_id BIGINT;
    cafe_id BIGINT;
    acucar_id BIGINT;
    leite_id BIGINT;
    pedido_pix_id BIGINT;
    pedido_cartao_id BIGINT;
    pedido_dinheiro_id BIGINT;
BEGIN
    IF EXISTS (SELECT 1 FROM cliente WHERE email = 'ana.demo@pedija.local') THEN
        RETURN;
    END IF;

    INSERT INTO cliente (nome, cpf, telefone, email, endereco)
    VALUES ('Ana Demonstração', '11111111111', '18999990001', 'ana.demo@pedija.local', 'Rua das Flores, 100')
    RETURNING id INTO cliente_ana_id;

    INSERT INTO cliente (nome, cpf, telefone, email, endereco)
    VALUES ('Bruno Demonstração', '22222222222', '18999990002', 'bruno.demo@pedija.local', 'Avenida Central, 200')
    RETURNING id INTO cliente_bruno_id;

    INSERT INTO cliente (nome, cpf, telefone, email, endereco)
    VALUES ('Carla Demonstração', '33333333333', '18999990003', 'carla.demo@pedija.local', 'Praça do Mercado, 300')
    RETURNING id INTO cliente_carla_id;

    INSERT INTO produto (nome, descricao, preco, estoque)
    VALUES ('Demo - Café Especial', 'Café torrado e moído para demonstração', 20.00, 42)
    RETURNING id INTO cafe_id;

    INSERT INTO produto (nome, descricao, preco, estoque)
    VALUES ('Demo - Açúcar Refinado', 'Açúcar refinado para demonstração', 8.00, 25)
    RETURNING id INTO acucar_id;

    INSERT INTO produto (nome, descricao, preco, estoque)
    VALUES ('Demo - Leite Integral', 'Leite integral para demonstração', 6.00, 36)
    RETURNING id INTO leite_id;

    INSERT INTO pedido (cliente_id, data_pedido, status, forma_pagamento, valor_total)
    VALUES (cliente_ana_id, CURRENT_TIMESTAMP - INTERVAL '8 days', 'PAGO', 'PIX', 124.00)
    RETURNING id INTO pedido_pix_id;

    INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
    VALUES (pedido_pix_id, cafe_id, 5, 20.00), (pedido_pix_id, acucar_id, 3, 8.00);

    INSERT INTO pedido (cliente_id, data_pedido, status, forma_pagamento, valor_total)
    VALUES (cliente_bruno_id, CURRENT_TIMESTAMP - INTERVAL '4 days', 'ENVIADO', 'CARTAO', 84.00)
    RETURNING id INTO pedido_cartao_id;

    INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
    VALUES (pedido_cartao_id, cafe_id, 3, 20.00), (pedido_cartao_id, leite_id, 4, 6.00);

    INSERT INTO pedido (cliente_id, data_pedido, status, forma_pagamento, valor_total)
    VALUES (cliente_carla_id, CURRENT_TIMESTAMP - INTERVAL '1 day', 'PENDENTE', 'DINHEIRO', 16.00)
    RETURNING id INTO pedido_dinheiro_id;

    INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
    VALUES (pedido_dinheiro_id, acucar_id, 2, 8.00);

    INSERT INTO movimentacao_estoque (produto_id, tipo, quantidade, data_movimentacao, descricao)
    VALUES
        (cafe_id, 'ENTRADA', 50, CURRENT_TIMESTAMP - INTERVAL '10 days', 'Estoque inicial demonstrativo'),
        (acucar_id, 'ENTRADA', 30, CURRENT_TIMESTAMP - INTERVAL '10 days', 'Estoque inicial demonstrativo'),
        (leite_id, 'ENTRADA', 40, CURRENT_TIMESTAMP - INTERVAL '10 days', 'Estoque inicial demonstrativo');

    INSERT INTO movimentacao_estoque (produto_id, pedido_id, tipo, quantidade, data_movimentacao, descricao)
    VALUES
        (cafe_id, pedido_pix_id, 'SAIDA', 5, CURRENT_TIMESTAMP - INTERVAL '8 days', 'Saída gerada pelo pedido demonstrativo'),
        (acucar_id, pedido_pix_id, 'SAIDA', 3, CURRENT_TIMESTAMP - INTERVAL '8 days', 'Saída gerada pelo pedido demonstrativo'),
        (cafe_id, pedido_cartao_id, 'SAIDA', 3, CURRENT_TIMESTAMP - INTERVAL '4 days', 'Saída gerada pelo pedido demonstrativo'),
        (leite_id, pedido_cartao_id, 'SAIDA', 4, CURRENT_TIMESTAMP - INTERVAL '4 days', 'Saída gerada pelo pedido demonstrativo'),
        (acucar_id, pedido_dinheiro_id, 'SAIDA', 2, CURRENT_TIMESTAMP - INTERVAL '1 day', 'Saída gerada pelo pedido demonstrativo');
END $$;
