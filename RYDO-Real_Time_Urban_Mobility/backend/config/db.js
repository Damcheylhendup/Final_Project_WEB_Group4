const { Sequelize } = require('sequelize');
require('dotenv').config();

// Supabase connection via full connection string.
// Get this from: Supabase Dashboard -> Project Settings -> Database
// -> Connection string. Use the "Connection pooling" string (port 6543)
// for your deployed app (Render, etc), and/or the direct connection
// string (port 5432) for local development.
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

module.exports = sequelize;

/*
.env example:

DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

Your old DB_NAME / DB_USER / DB_PASSWORD / DB_HOST / DB_PORT vars
are no longer used — DATABASE_URL replaces all of them.

Also update package.json:
  npm uninstall mysql2
  npm install pg pg-hstore
*/