import { client } from '../../db/client';
import { DatabaseError } from '../../errors/DatabaseError';
import { NotFoundError } from '../../errors/NotFoundError';

export const resolvers = {
    Query: {
        dealerships: async () => {
            try {
                const res = await client.query('SELECT * FROM dealerships');
                return res.rows;
            } catch (err) {
                throw new DatabaseError('Failed to fetch dealerships');
            }
        },
        vehicles: async (_: any, args: any) => {
            try {
                const query = 'SELECT * FROM vehicles WHERE make = $1 OR model = $2 OR year = $3';
                const values = [args.make, args.model, args.year];
                const res = await client.query(query, values);
                return res.rows;
            } catch (err) {
                throw new DatabaseError('Failed to fetch vehicles');
            }
        },
        customers: async (_: any, args: any) => {
            try {
                const query = 'SELECT * FROM customers WHERE last_name = $1';
                const values = [args.last_name];
                const res = await client.query(query, values);
                return res.rows;
            } catch (err) {
                throw new DatabaseError('Failed to fetch customers');
            }
        },
    },
    Mutation: {
        addVehicle: async (_: any, args: any) => {
            try {
                const query = 'INSERT INTO vehicles (make, model, year, price, vin, dealership_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
                const values = [args.make, args.model, args.year, args.price, args.vin, args.dealership_id];
                const res = await client.query(query, values);
                return res.rows[0];
            } catch (err) {
                throw new DatabaseError('Failed to add vehicle');
            }
        },
        updateVehicle: async (_: any, args: any) => {
            try {
                const query = 'UPDATE vehicles SET make = $1, model = $2, year = $3, price = $4, vin = $5 WHERE id = $6 RETURNING *';
                const values = [args.make, args.model, args.year, args.price, args.vin, args.id];
                const res = await client.query(query, values);
                if (res.rowCount === 0) {
                    throw new NotFoundError(`Vehicle Id: [${args.id}] not found.`);
                }
                return res.rows[0];
            } catch (err) {
                if (err instanceof NotFoundError) throw err;
                throw new DatabaseError('Failed to update vehicle');
            }
        },
        recordSale: async (_: any, args: any) => {
            try {
                const query = 'INSERT INTO sales (vehicle_id, customer_id, sale_date, price) VALUES ($1, $2, $3, $4) RETURNING *';
                const values = [args.vehicle_id, args.customer_id, args.sale_date, args.price];
                const res = await client.query(query, values);
                return res.rows[0];
            } catch (err) {
                throw new DatabaseError('Failed to record sale');
            }
        },
    },
    Dealership: {
        rooftops: async (parent: any) => {
            try {
                const query = 'SELECT * FROM dealerships WHERE parent_id = $1';
                const values = [parent.id];
                const res = await client.query(query, values);
                return res.rows;
            } catch (err) {
                throw new DatabaseError('Failed to fetch rooftops');
            }
        },
    },
    VehicleResult: {
        __resolveType(obj: any) {
            if (obj instanceof Error) return 'Error';
            return 'Vehicle';
        },
    },
    DealershipsResult: {
        __resolveType(obj: any) {
            if (obj instanceof Error) return 'Error';
            return 'Dealership';
        },
    },
    CustomersResult: {
        __resolveType(obj: any) {
            if (obj instanceof Error) return 'Error';
            return 'Customer';
        },
    },
    SaleResult: {
        __resolveType(obj: any) {
            if (obj instanceof Error) return 'Error';
            return 'Sale';
        },
    },
};
