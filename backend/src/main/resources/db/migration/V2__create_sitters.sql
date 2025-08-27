CREATE TABLE sitters (
    id BIGINT PRIMARY KEY,
    -- no futuro pode adicionar campos específicos (ex: disponibilidade, experiência)
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);
