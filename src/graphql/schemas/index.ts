import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Dealership {
    id: ID!
    name: String!
    parent_id: ID
    rooftops: [Dealership]
  }

  type Vehicle {
    id: ID!
    make: String!
    model: String!
    year: Int!
    price: Float!
    vin: String!
    dealership_id: ID!
  }

  type Customer {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    phone: String!
  }

  type Sale {
    id: ID!
    vehicle_id: ID!
    customer_id: ID!
    sale_date: String!
    price: Float!
  }

  type Query {
    dealerships: [Dealership]
    vehicles(make: String, model: String, year: Int): [Vehicle]
    customers(last_name: String): [Customer]
  }

  type Mutation {
    addVehicle(make: String!, model: String!, year: Int!, price: Float!, vin: String!, dealership_id: ID!): Vehicle
    updateVehicle(id: ID!, make: String, model: String, year: Int, price: Float, vin: String!): Vehicle
    recordSale(vehicle_id: ID!, customer_id: ID!, sale_date: String!, price: Float!): Sale
  }

  type Error {
    message: String!
  }

  type DealershipsResult {
    dealerships: [Dealership]
    error: Error
  }

  type VehiclesResult {
    vehicles: [Vehicle]
    error: Error
  }

  type CustomersResult {
    customers: [Customer]
    error: Error
  }

  union VehicleResult = Vehicle | Error
  union SaleResult = Sale | Error
`;
