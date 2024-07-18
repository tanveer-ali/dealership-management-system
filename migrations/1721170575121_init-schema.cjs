/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("dealerships", {
    id: "id",
    name: { type: "varchar(100)", notNull: true },
    parent_id: { type: "integer", references: '"dealerships"' },
  });

  pgm.createTable("vehicles", {
    id: "id",
    make: { type: "varchar(50)", notNull: true },
    model: { type: "varchar(50)", notNull: true },
    year: { type: "integer", notNull: true },
    price: { type: "decimal(10,2)", notNull: true },
    dealership_id: { type: "integer", references: '"dealerships"' },
  });

  pgm.createTable("customers", {
    id: "id",
    first_name: { type: "varchar(50)", notNull: true },
    last_name: { type: "varchar(50)", notNull: true },
    email: { type: "varchar(100)", notNull: true, unique: true },
    phone: { type: "varchar(15)", notNull: true },
  });

  pgm.createTable("sales", {
    id: "id",
    vehicle_id: { type: "integer", references: '"vehicles"' },
    customer_id: { type: "integer", references: '"customers"' },
    sale_date: { type: "date", notNull: true },
    price: { type: "decimal(10,2)", notNull: true },
  });

  // Indexes for critical queries
  pgm.createIndex("vehicles", "make");
  pgm.createIndex("vehicles", "model");
  pgm.createIndex("vehicles", "year");
  pgm.createIndex("customers", "last_name");
  pgm.createIndex("sales", ["vehicle_id", "customer_id"], { unique: true });

  pgm.sql(`INSERT INTO dealerships (id, "name", parent_id) VALUES
    (1,'Myers', null),
    (2,'Myers Barrhaven', 1),
    (3,'Myers Kanata', 1),
    (4,'Dilawri', null),
    (5,'Dilawri Orleans', 4);`);

  pgm.sql(`INSERT INTO customers (id, first_name,last_name,email,phone) VALUES
     (1,'customer 1','customer last 1','cust1@gmail.com','123456789'),
     (2,'customer 2','customer last 2','cust2@gmail.com','987654321');`);

  pgm.sql(`INSERT INTO vehicles (id, make,model,"year",price,dealership_id) VALUES
     (1,'hyundai','sonata',2020,23000.00,2),
     (2,'toyota','corolla',2020,25000.00,5);`);

  pgm.sql(`INSERT INTO sales (id, vehicle_id,customer_id,sale_date,price) VALUES
	 (1,1,1,'2024-06-01',23000.00),
   (2,2,2,'2024-07-01',25000.00);`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`DELETE FROM sales WHERE id IN (1,2);`);

  pgm.sql(`DELETE FROM vehicles WHERE id IN (1,2);`);

  pgm.sql(`DELETE FROM customers WHERE id IN (1,2);`);

  pgm.sql(`DELETE FROM dealerships WHERE id IN (2,3,5);`);
  pgm.sql(`DELETE FROM dealerships WHERE id IN (1,4);`);

  pgm.dropIndex("customers", "last_name");
  pgm.dropIndex("vehicles", "year");
  pgm.dropIndex("vehicles", "model");
  pgm.dropIndex("vehicles", "make");
  pgm.dropTable("sales");
  pgm.dropTable("customers");
  pgm.dropTable("vehicles");
  pgm.dropTable("dealerships");
};
