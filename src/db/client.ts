import pg from 'pg';

const { Client } = pg;

export const client = new Client();

export const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1);
    }
};
