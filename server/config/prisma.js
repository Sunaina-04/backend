const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prismaInstance = new PrismaClient({
    adapter,
    log: ['error', 'warn']
});

// Explicitly export it
module.exports = prismaInstance;