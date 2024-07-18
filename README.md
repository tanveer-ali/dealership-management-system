# Dealership Management System (DMS)

## Description

This project is a backend system to manage operations for automotive dealerships. It provides a GraphQL API to handle dealerships, vehicles, customers, and sales.

## Technologies

- TypeScript
- Apollo Server
- PostgreSQL

## Setup Instructions

### Notes

- PostgreSQL database is run on docker for convenience.
- Postgres database schema migrations are handled using `node-pg-migrate` package.
- All pending migrations are automatically run when the DMS server starts.

### Prerequisites

- Node.js v20
- Docker
- PostgreSQL (running on docker for convenience)

### Installation

- Clone the repository:

  ```
  git clone https://github.com/tanveer-ali/dealership-management-system.git
  cd dealership-management-system
  ```

#### Running code in docker using docker-compose

1. Running the graphql server using Docker compose

   ```
   docker-compose up --build -d
   ```

2. The server will be running at `http://localhost:4000`.

#### Running code locally

1. Install dependencies:

   ```
   npm install
   ```

2. Start the PostgreSQL database:

   - Run postgresql database using docker-compose for convenience:

   ```
    docker-compose up postgres -d
   ```

3. Set up the PostgreSQL database connection in the API:

   - Create a `.env` file in the root directory and add your database connection string for running migrations:

     ```
     DATABASE_URL=postgresql://dms_user:secretpassword@localhost:5432/dms_db
     ```

   - Add the following postgresql connection parameter keys for connecting to the database within the graphQL API

     ```
     PGUSER=dms_user
     PGPASSWORD=secretpassword
     PGHOST=localhost
     PGPORT=5432
     PGDATABASE=dms_db
     ```

4. Run the database migrations to set up the schema:

   ```
   npm run migrate up
   ```

5. Start the server:

   ```
   npm run start:local
   ```

6. The server will be running at `http://localhost:4000`.

## API Endpoints

### Queries

#### Dealerships

- Retrieve a list of all dealerships.

**Request:**

```graphql
query {
  dealerships {
    id
    name
    parent_id
    rooftops {
      id
      name
    }
  }
}
```

**Response:**

```json
{
  "data": {
    "dealerships": [
      {
        "id": "1",
        "name": "parent dealer 1",
        "parent_id": null,
        "rooftops": [
          {
            "id": "2",
            "name": "child dealer 1 - parent 1"
          }
        ]
      }
    ]
  }
}
```

#### Vehicles

- Retrieve a list of vehicles filtered by make, model, or year.

**Request:**

```graphql
query {
  vehicles(make: "Toyota", model: "Corolla", year: 2020) {
    id
    make
    model
    year
    price
    dealership_id
  }
}
```

**Response:**

```json
{
  "data": {
    "vehicles": [
      {
        "id": "1",
        "make": "hyundai",
        "model": "sonata",
        "year": 2020,
        "price": 25000,
        "dealership_id": "1"
      }
    ]
  }
}
```

#### Customers

- Retrieve a list of customers filtered by last name.

**Request:**

```graphql
query {
  customers(last_name: "customer last 1") {
    id
    first_name
    last_name
    email
    phone
  }
}
```

**Response:**

```json
{
  "data": {
    "customers": [
      {
        "id": "1",
        "first_name": "customer 1",
        "last_name": "customer last 1",
        "email": "cust1@gmail.com",
        "phone": "123456789"
      }
    ]
  }
}
```

### Mutations

#### Add Vehicle

- Add a new vehicle.

**Request:**

```

graphql
mutation {
  addVehicle(make: "Toyota", model: "Corolla", year: 2020, price: 20000, dealership_id: 4) {
    id
    make
    model
    year
    price
    dealership_id
  }
}
```

**Response:**

```json
{
  "data": {
    "addVehicle": {
      "id": "2",
      "make": "Toyota",
      "model": "Corolla",
      "year": 2020,
      "price": 20000,
      "dealership_id": "4"
    }
  }
}
```

#### Update Vehicle

- Update an existing vehicle.

**Request:**

```graphql
mutation {
  updateVehicle(id: "2", make: "Toyota", model: "Camry", year: 2021, price: 22000) {
    id
    make
    model
    year
    price
  }
}
```

**Response:**

```json
{
  "data": {
    "updateVehicle": {
      "id": "2",
      "make": "Toyota",
      "model": "Camry",
      "year": 2021,
      "price": 22000
    }
  }
}
```

#### Record Sale

- Record a sale.

**Request:**

```graphql
mutation {
  recordSale(vehicle_id: 1, customer_id: 2, sale_date: "2023-07-14", price: 20000) {
    id
    vehicle_id
    customer_id
    sale_date
    price
  }
}
```

**Response:**

```json
{
  "data": {
    "recordSale": {
      "id": "2",
      "vehicle_id": "1",
      "customer_id": "2",
      "sale_date": "1689307200000",
      "price": 20000
    }
  }
}
```

## Error Handling

- Custom error classes DatabaseError and NotFoundError are used to handle database-related errors and not found errors, respectively.

- The API returns meaningful error messages for various failure scenarios. For example, if a vehicle update fails because the vehicle is not found, the response will indicate this:

```json
{
  "errors": [
    {
      "message": "Vehicle Id: [30] not found.",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["updateVehicle"],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
        "stacktrace": [
          "NotFoundError: Vehicle Id: [30] not found.",
          "    at Object.updateVehicle (file:///dealership-management-system/dist/index.js:144:27)",
          "    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
        ]
      }
    }
  ],
  "data": {
    "updateVehicle": null
  }
}
```
