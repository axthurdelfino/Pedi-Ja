ALTER TABLE usuario
    ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER';

ALTER TABLE usuario
    ADD CONSTRAINT chk_usuario_role
        CHECK (role IN ('USER', 'ADMIN'));
