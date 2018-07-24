-- Script de Creación de la BD - Centinela Web

CREATE SCHEMA seguridad
    AUTHORIZATION postgres;
	


CREATE TABLE seguridad.usuarios
(
    id_usuario serial,
    nombre character varying(150),
    email character varying(350),
    password character varying(200),
    imagen character varying(300),
    id_rol integer,
    google boolean,
    uc character varying(50),
    um character varying(50),
    fc timestamp without time zone,
    fm timestamp without time zone,
    CONSTRAINT pkusuario PRIMARY KEY (id_usuario)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE seguridad.usuarios
    OWNER to postgres;
	

-- Column: seguridad.usuarios.nombre

-- ALTER TABLE seguridad.usuarios DROP COLUMN nombre;

ALTER TABLE seguridad.usuarios
    ADD CONSTRAINT unic_email UNIQUE (email);
	
-- Column: seguridad.usuarios.nombre

-- ALTER TABLE seguridad.usuarios DROP COLUMN nombre;

ALTER TABLE seguridad.usuarios
    ADD CONSTRAINT unic_nombre UNIQUE (nombre);
	
CREATE OR REPLACE FUNCTION seguridad."sp_sel_usuarios" ()
RETURNS "refcursor"
AS
$$
  DECLARE result_cursor REFCURSOR;
BEGIN
  OPEN result_cursor FOR SELECT 
    "id_usuario",
    "nombre",
    "email",
    "password",
    "imagen",
    "id_rol",
    "google",
    "uc",
    "um",
    "fc",
    "fm"
  FROM 
    "seguridad"."usuarios";
  RETURN result_cursor;
END;
$$
LANGUAGE 'plpgsql';



CREATE OR REPLACE FUNCTION seguridad."sp_upd_usuarios" ( 
  IN "p_id_usuario" integer,
  IN "p_nombre" varchar(150),
  IN "p_email" varchar(350),
  IN "p_password" varchar(200),
  IN "p_imagen" varchar(300),
  IN "p_id_rol" integer,
  IN "p_google" boolean,
  IN "p_uc" varchar(50),
  IN "p_um" varchar(50),
  IN "p_fc" timestamp without time zone,
  IN "p_fm" timestamp without time zone  
)
RETURNS void
AS
$$
BEGIN
  UPDATE "seguridad"."usuarios" SET
    "nombre" = "p_nombre",
    "email" = "p_email",
    "password" = "p_password",
    "imagen" = "p_imagen",
    "id_rol" = "p_id_rol",
    "google" = "p_google",
    "uc" = "p_uc",
    "um" = "p_um",
    "fc" = "p_fc",
    "fm" = "p_fm"
  WHERE 
    ("id_usuario" = "p_id_usuario") ;
END;
$$
LANGUAGE 'plpgsql';    
  


CREATE OR REPLACE FUNCTION seguridad."sp_ins_usuarios" ( 
  IN "p_id_usuario" integer,
  IN "p_nombre" varchar(150),
  IN "p_email" varchar(350),
  IN "p_password" varchar(200),
  IN "p_imagen" varchar(300),
  IN "p_id_rol" integer,
  IN "p_google" boolean,
  IN "p_uc" varchar(50),
  IN "p_um" varchar(50),
  IN "p_fc" timestamp without time zone,
  IN "p_fm" timestamp without time zone
)
RETURNS void 
AS
$$
BEGIN
  INSERT INTO "seguridad"."usuarios" (
    "id_usuario",
    "nombre",
    "email",
    "password",
    "imagen",
    "id_rol",
    "google",
    "uc",
    "um",
    "fc",
    "fm"
  )
  VALUES (
    "p_id_usuario",
    "p_nombre",
    "p_email",
    "p_password",
    "p_imagen",
    "p_id_rol",
    "p_google",
    "p_uc",
    "p_um",
    "p_fc",
    "p_fm"
  );
END;
$$
LANGUAGE 'plpgsql';



CREATE OR REPLACE FUNCTION seguridad."sp_del_usuarios" ( 
  IN "p_id_usuario" integer  
)
RETURNS void
AS
$$
BEGIN
  DELETE FROM "seguridad"."usuarios"
  WHERE 
    ("id_usuario" = "p_id_usuario") ;
END;
$$
LANGUAGE 'plpgsql';