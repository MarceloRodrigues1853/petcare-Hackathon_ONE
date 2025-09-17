-- Este ficheiro popula o banco com dados iniciais de forma segura (idempotente).
-- Senhas: "senha123" para carlos/maria, "admin123" para admin.

-- ===================== USUÁRIOS =====================
-- Usando o padrão INSERT ... SELECT ... WHERE NOT EXISTS para todos os inserts
INSERT INTO users (user_type, name, email, password_hash, role, status)
SELECT 'OWNER', 'Carlos Silva', 'carlos@petcare.com', '$2a$10$CnUrdUylE9QFftHgoSkH9.0wnY9IX/ovnm78XJo3UoR1XUmWJYp1a', 'OWNER', 'APPROVED'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'carlos@petcare.com');

INSERT INTO users (user_type, name, email, password_hash, role, status)
SELECT 'SITTER', 'Maria Souza', 'maria@petcare.com', '$2a$10$CnUrdUylE9QFftHgoSkH9.0wnY9IX/ovnm78XJo3UoR1XUmWJYp1a', 'SITTER', 'APPROVED'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'maria@petcare.com');

INSERT INTO users (user_type, name, email, password_hash, role, status)
SELECT 'ADMIN', 'Admin Principal', 'admin@petcare.com', '$2a$10$G5n3f.i5L9Q.V8Qz.A5f7uCLveIM081jH.02w5b.xV.t3Y8r.8/aW', 'ADMIN', 'APPROVED'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@petcare.com');

-- ===================== SERVIÇOS =====================
INSERT INTO servicos (id, descricao) SELECT 1, 'Passeio' WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE id = 1);
INSERT INTO servicos (id, descricao) SELECT 2, 'Hospedagem' WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE id = 2);
INSERT INTO servicos (id, descricao) SELECT 3, 'Babá de Pet' WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE id = 3);

-- ===================== PET DO CARLOS =====================
INSERT INTO pets (nome, especie, idade, owner_id)
SELECT 'Rex', 'Cão', 5, u.id FROM users u
WHERE u.email = 'carlos@petcare.com' AND NOT EXISTS (SELECT 1 FROM pets p WHERE p.nome = 'Rex' AND p.owner_id = u.id);

-- ===================== PREÇOS DA SITTER MARIA =====================
INSERT INTO sitter_servicos_precos (sitter_id, servico_id, valor)
SELECT u.id, s.id, 25.00 FROM users u JOIN servicos s ON s.descricao = 'Passeio'
WHERE u.email = 'maria@petcare.com' AND NOT EXISTS (SELECT 1 FROM sitter_servicos_precos x WHERE x.sitter_id = u.id AND x.servico_id = s.id);

INSERT INTO sitter_servicos_precos (sitter_id, servico_id, valor)
SELECT u.id, s.id, 150.00 FROM users u JOIN servicos s ON s.descricao = 'Hospedagem'
WHERE u.email = 'maria@petcare.com' AND NOT EXISTS (SELECT 1 FROM sitter_servicos_precos x WHERE x.sitter_id = u.id AND x.servico_id = s.id);

-- ===================== AGENDAMENTO EXEMPLO =====================
INSERT INTO agendamentos (owner_id, sitter_id, pet_id, sitter_servico_preco_id, data_inicio, data_fim, status)
SELECT o.id, s.id, p.id, ssp.id, '2025-09-20 10:00:00', '2025-09-20 11:00:00', 'AGENDADO'
FROM users o
JOIN users s ON s.email = 'maria@petcare.com'
JOIN pets p ON p.nome = 'Rex' AND p.owner_id = o.id
JOIN sitter_servicos_precos ssp ON ssp.sitter_id = s.id
JOIN servicos sv ON sv.id = ssp.servico_id AND sv.descricao = 'Passeio'
WHERE o.email = 'carlos@petcare.com' AND NOT EXISTS (SELECT 1 FROM agendamentos a WHERE a.pet_id = p.id AND a.data_inicio = '2025-09-20 10:00:00');