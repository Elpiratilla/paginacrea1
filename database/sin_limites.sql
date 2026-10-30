CREATE DATABASE IF NOT EXISTS sin_limites;
USE sin_limites;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(25) NOT NULL,
    correo VARCHAR(45) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    verificado TINYINT(1) DEFAULT 0,
    token_verification VARCHAR(64),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS intentos_login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(45),
    ip VARCHAR(45),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Login.php cuenta los intentos fallidos por correo y fecha
    INDEX idx_correo_fecha (correo, fecha)
);

-- comentarios del teclado: antes vivían en el navegador de cada persona
CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    pagina VARCHAR(30) NOT NULL,
    texto VARCHAR(1000) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pagina_fecha (pagina, creado_en),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) DEFAULT CHARSET = utf8mb4;
