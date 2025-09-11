-- Este ficheiro é executado automaticamente pelo Spring Boot para popular o banco de dados no arranque.
-- NOTA: Os hashes de senha para Owner/Sitter são para a senha "senha123".

-- Cria um Owner (user_type='OWNER')
INSERT INTO users (user_type, name, email, password_hash, role)
VALUES ('OWNER', 'Carlos Silva', 'carlos@petcare.com', '$2a$10$CnUrdUylE9QFftHgoSkH9.0wnY9IX/ovnm78XJo3UoR1XUmWJYp1a', 'OWNER');

-- Cria um Sitter (user_type='SITTER')
INSERT INTO users (user_type, name, email, password_hash, role)
VALUES ('SITTER', 'Maria Souza', 'maria@petcare.com', '$2a$10$CnUrdUylE9QFftHgoSkH9.0wnY9IX/ovnm78XJo3UoR1XUmWJYp1a', 'SITTER');

-- Cria um Admin (user_type='User')
-- A senha aqui é 'admin123'
INSERT INTO users (user_type, name, email, password_hash, role)
VALUES ('User', 'Administrador', 'admin@petcare.com', '$2a$10$G5n3f.i5L9Q.V8Qz.A5f7uCLveIM081jH.02w5b.xV.t3Y8r.8/aW', 'ADMIN');

-- Adiciona os TIPOS de serviço disponíveis na plataforma
INSERT INTO servicos (descricao) VALUES ('Passeio'), ('Hospedagem'), ('Babá de Pet');

-- Adiciona um Pet para o Owner 'Carlos Silva'
INSERT INTO pets (name, species, owner_id)
SELECT 'Rex', 'Cão', id FROM users WHERE email = 'carlos@petcare.com';

-- Define os serviços que a Sitter 'Maria Souza' oferece e os seus preços
-- Vincula o serviço "Passeio" à Sitter Maria com o preço 25.00
INSERT INTO sitter_servicos_precos (sitter_id, servico_id, valor)
VALUES (
    (SELECT id FROM users WHERE email = 'maria@petcare.com'),
    (SELECT id FROM servicos WHERE descricao = 'Passeio'),
    25.00
);

-- Vincula o serviço "Hospedagem" à Sitter Maria com o preço 150.00
INSERT INTO sitter_servicos_precos (sitter_id, servico_id, valor)
VALUES (
    (SELECT id FROM users WHERE email = 'maria@petcare.com'),
    (SELECT id FROM servicos WHERE descricao = 'Hospedagem'),
    150.00
);

-- Cria um agendamento de exemplo: Carlos (dono) agenda um Passeio para o pet Rex com a sitter Maria
INSERT INTO agendamentos (owner_id, sitter_id, pet_id, servico_id, data_hora_inicio, status, preco_final)
VALUES (
    (SELECT id FROM users WHERE email = 'carlos@petcare.com'),
    (SELECT id FROM users WHERE email = 'maria@petcare.com'),
    (SELECT id FROM pets WHERE name = 'Rex'),
    (SELECT id FROM servicos WHERE descricao = 'Passeio'),
    '2025-09-15 10:00:00',
    'CONFIRMADO',
    25.00
);

