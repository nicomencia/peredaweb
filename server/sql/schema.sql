-- Saneamientos Pereda — MySQL schema.
-- Column set derived from the LIVE exported data (migration-data/*.json),
-- not the historical migration files. UUIDs kept as CHAR(36).
-- All columns are nullable or have defaults so imports are strict-mode-safe.

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS product_photos;
DROP TABLE IF EXISTS ambiente_photos;
DROP TABLE IF EXISTS tienda_photos;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS ambientes;
DROP TABLE IF EXISTS tiendas;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS denuncias;
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS presupuesto_requests;
DROP TABLE IF EXISTS cliente_requests;
DROP TABLE IF EXISTS admin_users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE products (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category VARCHAR(64) NOT NULL DEFAULT 'bano',
  price DECIMAL(10,2) DEFAULT NULL,
  image_url TEXT,
  secondary_image_url TEXT,
  thumbnail_url TEXT,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  sold TINYINT(1) NOT NULL DEFAULT 0,
  color TEXT,
  size INT DEFAULT NULL,
  product_type VARCHAR(64) NOT NULL DEFAULT 'bano',
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE product_photos (
  id CHAR(36) NOT NULL PRIMARY KEY,
  product_id CHAR(36) NOT NULL,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_product_photos (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE brands (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  category VARCHAR(64) DEFAULT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ambientes (
  id CHAR(36) NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  specs JSON,
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ambiente_photos (
  id CHAR(36) NOT NULL PRIMARY KEY,
  ambiente_id CHAR(36) NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_ambiente_photos (ambiente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tiendas (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  postal_code VARCHAR(16) DEFAULT '',
  phone VARCHAR(32) DEFAULT '',
  hours_tienda TEXT,
  hours_fontaneria TEXT,
  hours_sabados TEXT,
  hours_verano TEXT,
  emails JSON,
  lat DOUBLE DEFAULT NULL,
  lon DOUBLE DEFAULT NULL,
  cover_image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tienda_photos (
  id CHAR(36) NOT NULL PRIMARY KEY,
  tienda_id CHAR(36) NOT NULL,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_tienda_photos (tienda_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE site_settings (
  id CHAR(36) NOT NULL PRIMARY KEY,
  `key` VARCHAR(191) NOT NULL UNIQUE,
  value TEXT,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE denuncias (
  id CHAR(36) NOT NULL PRIMARY KEY,
  pin VARCHAR(32) NOT NULL UNIQUE,
  hechos TEXT NOT NULL,
  seccion_lugar TEXT,
  vinculacion TEXT,
  personas_involucradas TEXT,
  momento TEXT,
  documentos_info TEXT,
  estado VARCHAR(32) NOT NULL DEFAULT 'pendiente',
  respuesta TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE job_applications (
  id CHAR(36) NOT NULL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(32) DEFAULT '',
  mensaje TEXT,
  cv_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE presupuesto_requests (
  id CHAR(36) NOT NULL PRIMARY KEY,
  nombre TEXT NOT NULL,
  localidad TEXT,
  email VARCHAR(255) NOT NULL,
  asunto TEXT,
  mensaje TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE cliente_requests (
  id CHAR(36) NOT NULL PRIMARY KEY,
  nombre TEXT NOT NULL,
  empresa TEXT,
  cif VARCHAR(32) DEFAULT '',
  localidad TEXT,
  telefono VARCHAR(32) DEFAULT '',
  email VARCHAR(255) NOT NULL,
  actividad TEXT,
  mensaje TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE admin_users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
