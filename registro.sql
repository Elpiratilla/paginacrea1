create database registros;
use registros;
create table usuarios(
id int auto_increment primary key,
nombre varchar(25) not null,
correo varchar(45) not null unique,
contraseña varchar(255) not null,
verificado tinyint(1) default 0,
token_verification varchar(64),
creado_en timestamp default current_timestamp
);
create table intentos_login (
id int auto_increment primary key,
correo varchar(45),
ip varchar(45),
fecha timestamp default current_timestamp
);
