-- Script de Creación de la BD - Centinela Web

CREATE SCHEMA seguridad
    AUTHORIZATION postgres;
	


CREATE TABLE seguridad.usuarios
(
    id_usuario integer,
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
	
	
CREATE TABLE seguridad.roles
(
	id_rol			integer,
	nombre_rol		character varying,
	activo			boolean,
	uc				character varying,
	um				character varying,
	fc				timestamp,
	fm				timestamp,
	CONSTRAINT pkrol PRIMARY KEY (id_rol)
)
WITH (
	OIDS = false
)
TABLESPACE pg_default;

ALTER TABLE seguridad.roles
	OWNER TO postgres;
	

CREATE TABLE seguridad.menu_opciones
(
	id_opcion		integer,
	nombre_opcion	varchar,
	descripcion		varchar,
	activo			boolean,
	uc				varchar,
	um				varchar,
	fc				timestamp,
	fm				timestamp,
	CONSTRAINT pk_menu_opciones PRIMARY KEY (id_opcion)
)
WITH (
	OIDS = false
)
TABLESPACE pg_default;

ALTER TABLE seguridad.menu_opciones
	OWNER TO postgres;
	
	
CREATE TABLE seguridad.menu_opciones_rol
(
	id_rol			integer REFERENCES seguridad.roles(id_rol),
	id_opcion		integer REFERENCES seguridad.menu_opciones(id_opcion),
	activo			boolean,
	uc				varchar,
	um				varchar,
	fc				timestamp,
	fm				timestamp,
	CONSTRAINT pk_menu_opciones_rol PRIMARY KEY (id_rol, id_opcion)
)
WITH (
	OIDS = false
)
TABLESPACE pg_default;

ALTER TABLE seguridad.menu_opciones_rol
	OWNER TO postgres;
		

-- FUNCTION: seguridad.sp_sel_usuarios(integer)

-- DROP FUNCTION seguridad.sp_sel_usuarios(integer);

CREATE OR REPLACE FUNCTION seguridad.sp_sel_usuarios(
	opcion integer DEFAULT 0,
	OUT p_id_usuario integer,
	OUT p_nombre character varying,
	OUT p_email character varying,
	OUT p_password character varying,
	OUT p_imagen character varying,
	OUT p_id_rol integer,
	OUT p_uc character varying,
	OUT p_um character varying,
	OUT p_fc timestamp without time zone,
	OUT p_fm timestamp without time zone)
    RETURNS SETOF record 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
	if opcion = 0 then
		return query select id_usuario, nombre, email, password, imagen, id_rol, uc, um, fc, fm from seguridad.usuarios where activo = true;
	else
		return query select id_usuario, nombre, email, password, imagen, id_rol, uc, um, fc, fm from seguridad.usuarios where id_usuario = opcion and activo = true;
	end if;
	
	return;
end;

$BODY$;

ALTER FUNCTION seguridad.sp_sel_usuarios(integer)
    OWNER TO postgres;


	
-- FUNCTION: seguridad.sp_usuarios(integer, character varying, character varying, character varying, character varying, integer, boolean, character varying, character varying)

-- DROP FUNCTION seguridad.sp_usuarios(integer, character varying, character varying, character varying, character varying, integer, boolean, character varying, character varying);

CREATE OR REPLACE FUNCTION seguridad.sp_usuarios(
	p_id_usuario integer,
	p_nombre character varying,
	p_email character varying,
	p_password character varying,
	p_imagen character varying,
	p_id_rol integer,
	p_google boolean,
	p_uc character varying,
	p_um character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE 
	id integer;

BEGIN
	IF NOT EXISTS(SELECT id_usuario FROM seguridad.usuarios WHERE id_usuario = p_id_usuario) THEN
  		
		SELECT CASE WHEN MAX(u.id_usuario) IS NULL THEN 1 ELSE MAX(u.id_usuario) + 1 END INTO id FROM seguridad.usuarios as u;
  	
		INSERT INTO seguridad.usuarios (
			id_usuario,
			nombre,
			email,
			password,
			imagen,
			id_rol,
			google,
			uc,
			um,
			fc,
			fm,
			activo
		)
		VALUES (
			id,
			p_nombre,
			p_email,
			p_password::text,
			p_imagen,
			p_id_rol,
			p_google,
			p_uc,
			p_um,
			NOW(),
			NOW(),
			true
		);
	ELSE
		ID = p_id_usuario;
		
		IF p_nombre IS NULL OR p_nombre = '' THEN
			RAISE EXCEPTION 'El campo Nombre no puede ser vacío';
		END IF;
		
		IF p_email IS NULL OR p_email = '' THEN
			RAISE EXCEPTION 'EL campo Email no puede ser vacío';
		END IF;
		
		IF p_password IS NULL OR p_password = '' THEN
			RAISE EXCEPTION 'EL campo Password no puede ser vacío';
		END IF;
		
		IF p_id_rol IS NULL OR p_id_rol = 0 THEN
			RAISE EXCEPTION 'EL campo Id Rol no puede ser vacío o igual a cero';
		END IF;
		
		UPDATE seguridad.usuarios
		SET
			nombre = p_nombre,
			email = p_email,
			password = p_password::text,
			imagen = p_imagen,
			id_rol = p_id_rol,
			google = p_google,
			um = p_um,
			fm = NOW()
		WHERE id_usuario = p_id_usuario;
	END IF;

	--id = coalesce(currval('seguridad.usuarios_id_usuario_seq'),0);
	return id;
	--id_usuario = id;
END;

$BODY$;

ALTER FUNCTION seguridad.sp_usuarios(integer, character varying, character varying, character varying, character varying, integer, boolean, character varying, character varying)
    OWNER TO postgres;

	


	

		
	
-- FUNCTION: seguridad.sp_sel_usuarios(integer)

-- DROP FUNCTION seguridad.sp_sel_usuarios(integer);

CREATE OR REPLACE FUNCTION seguridad.sp_sel_roles(
	opcion 					integer DEFAULT 0,
	OUT p_id_rol 			integer,
	OUT p_nombre_rol 		character varying,
	OUT p_activo		 	boolean,
	OUT p_uc 				character varying,
	OUT p_um 				character varying,
	OUT p_fc 				timestamp without time zone,
	OUT p_fm 				timestamp without time zone)
    RETURNS SETOF record 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
	if opcion = 0 then
		return query select id_rol, nombre_rol, activo, uc, um, fc, fm from seguridad.roles where activo = true;
	else
		return query select id_rol, nombre_rol, activo, uc, um, fc, fm from seguridad.roles where id_rol = opcion and activo = true;
	end if;
	
	return;
end;

$BODY$;

ALTER FUNCTION seguridad.sp_sel_roles(integer)
    OWNER TO postgres;


CREATE OR REPLACE FUNCTION seguridad.sp_roles(
	p_id_rol integer,
	p_nombre_rol character varying,
	p_activo boolean,
	p_uc character varying,
	p_um character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE 
	id integer;

BEGIN
	IF NOT EXISTS(SELECT id_rol FROM seguridad.roles WHERE id_rol = p_id_rol) THEN
  		
		SELECT CASE WHEN MAX(u.id_rol) IS NULL THEN 1 ELSE MAX(u.id_rol) + 1 END INTO id FROM seguridad.roles as u;
  	
		INSERT INTO seguridad.roles (
			id_rol,
			nombre_rol,
			activo,
			uc,
			um,
			fc,
			fm
		)
		VALUES (
			id,
			p_nombre_rol,
			p_activo,
			p_uc,
			p_um,
			NOW(),
			NOW()
		);
	ELSE
		ID = p_id_rol;
		
		IF p_nombre_rol IS NULL OR p_nombre_rol = '' THEN
			RAISE EXCEPTION 'El campo Nombre del Rol no puede ser vacío';
		END IF;
		
		UPDATE seguridad.roles
		SET
			nombre_rol = p_nombre_rol,
			activo = p_activo,
			um = p_um,
			fm = NOW()
		WHERE id_rol = p_id_rol;
	END IF;

	return id;
END;

$BODY$;

ALTER FUNCTION seguridad.sp_roles(integer, character varying, boolean, character varying, character varying)
    OWNER TO postgres;
	


-- FUNCTION: seguridad.sp_del_usuarios(integer, character varying)

-- DROP FUNCTION seguridad.sp_del_usuarios(integer, character varying);

CREATE OR REPLACE FUNCTION seguridad.sp_del_roles(
	p_id_rol		integer,
	p_um			varchar
)
	RETURNS integer
	LANGUAGE 'plpgsql'

	COST 100
	VOLATILE 
AS $BODY$

BEGIN
	UPDATE seguridad.roles
	SET
		activo = false,
		um = p_um,
		fm = NOW()
	WHERE id_rol = p_id_rol;
	return p_id_rol;
END;

$BODY$;

ALTER FUNCTION seguridad.sp_del_roles(integer, character varying)
    OWNER TO postgres;


-- FUNCTION: seguridad.sp_sel_roles(integer)

-- DROP FUNCTION seguridad.sp_sel_roles(integer);

CREATE OR REPLACE FUNCTION seguridad.sp_sel_menu_opciones(
	opcion integer DEFAULT 0,
	OUT p_id_opcion integer,
	OUT p_nombre_opcion character varying,
	OUT p_activo boolean,
	OUT p_uc character varying,
	OUT p_um character varying,
	OUT p_fc timestamp without time zone,
	OUT p_fm timestamp without time zone)
    RETURNS SETOF record 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
	if opcion = 0 then
		return query select id_opcion, nombre_opcion, activo, uc, um, fc, fm from seguridad.menu_opciones where activo = true;
	else
		return query select id_opcion, nombre_opcion, activo, uc, um, fc, fm from seguridad.menu_opciones where id_opcion = opcion and activo = true;
	end if;
	
	return;
end;

$BODY$;

ALTER FUNCTION seguridad.sp_sel_menu_opciones(integer)
    OWNER TO postgres;


-- FUNCTION: seguridad.sp_roles(integer, character varying, boolean, character varying, character varying)

-- DROP FUNCTION seguridad.sp_roles(integer, character varying, boolean, character varying, character varying);

CREATE OR REPLACE FUNCTION seguridad.sp_menu_opciones(
	p_id_opcion integer,
	p_nombre_opcion character varying,
	p_descripcion character varying,
	p_activo boolean,
	p_uc character varying,
	p_um character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE 
	id integer;

BEGIN
	IF NOT EXISTS(SELECT id_opcion FROM seguridad.menu_opciones WHERE id_opcion = p_id_opcion) THEN
  		
		SELECT CASE WHEN MAX(u.id_opcion) IS NULL THEN 1 ELSE MAX(u.id_opcion) + 1 END INTO id FROM seguridad.menu_opciones as u;
  	
		INSERT INTO seguridad.menu_opciones (
			id_opcion,
			nombre_opcion,
			descripcion,
			activo,
			uc,
			um,
			fc,
			fm
		)
		VALUES (
			id,
			p_nombre_opcion,
			p_descripcion,
			p_activo,
			p_uc,
			p_um,
			NOW(),
			NOW()
		);
	ELSE
		ID = p_id_opcion;
		
		IF p_nombre_opcion IS NULL OR p_nombre_opcion = '' THEN
			RAISE EXCEPTION 'El campo Nombre de la Opción del Menú, no puede ser vacío';
		END IF;
		
		IF p_descripcion IS NULL OR p_descripcion = '' THEN
			RAISE EXCEPTION 'El campo Descripción de la Opción del Menú, no puede ser vacío';
		END IF;
		
		UPDATE seguridad.menu_opciones
		SET
			nombre_opcion = p_nombre_opcion,
			descripcion = p_descripcion,
			activo = p_activo,
			um = p_um,
			fm = NOW()
		WHERE id_opcion = p_id_opcion;
	END IF;

	return id;
END;

$BODY$;

ALTER FUNCTION seguridad.sp_menu_opciones(integer, character varying, character varying, boolean, character varying, character varying)
    OWNER TO postgres;


	-- FUNCTION: seguridad.sp_del_roles(integer, character varying)

-- DROP FUNCTION seguridad.sp_del_roles(integer, character varying);

CREATE OR REPLACE FUNCTION seguridad.sp_del_menu_opciones(
	p_id_opcion integer,
	p_um character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

BEGIN
	UPDATE seguridad.menu_opciones
	SET
		activo = false,
		um = p_um,
		fm = NOW()
	WHERE id_opcion = p_id_opcion;
	return p_id_opcion;
END;

$BODY$;

ALTER FUNCTION seguridad.sp_del_menu_opciones(integer, character varying)
    OWNER TO postgres;


ALTER TABLE seguridad.usuarios
	ADD COLUMN img CHARACTER VARYING;
	

