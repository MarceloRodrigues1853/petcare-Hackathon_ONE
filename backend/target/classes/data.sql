-- Usuário ADMIN
INSERT INTO users (name, email, password_hash, role)
VALUES ('Administrador', 'admin@petcare.com',
'$2a$10$CnUrdUylE9QFftHgoSkH9.0wnY9IX/ovnm78XJo3UoR1XUmWJYp1a', 'ADMIN');

-- Usuário dono (OWNER)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Carlos Silva', 'carlos@petcare.com',
'$2a$10$CnUrdUylE9QFftHgoSkH9.0wnY9IX/ovnm78XJo3UoR1XUmWJYp1a', 'OWNER');

-- Usuário sitter (SITTER)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Maria Souza', 'maria@petcare.com',
'$2a$10$CnUrdUylE9QFftHgoSkH9.0wnY9IX/ovnm78XJo3UoR1XUmWJYp1a', 'SITTER');

-- Vincula Maria (sitter) à tabela sitters
INSERT INTO sitters (id)
SELECT id FROM users WHERE email = 'maria@petcare.com';

-- Pet de Carlos
INSERT INTO pets (name, type, owner_id)
SELECT 'Rex', 'Dog', id FROM users WHERE email = 'carlos@petcare.com';

-- Reserva inicial (Carlos -> Maria)
INSERT INTO bookings (pet_id, sitter_id, start_date, end_date, status)
VALUES (
    (SELECT id FROM pets WHERE name = 'Rex'),
    (SELECT id FROM sitters s JOIN users u ON u.id = s.id WHERE u.email = 'maria@petcare.com'),
    NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 'CONFIRMED'
);