require("dotenv").config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "127.0.0.1",

    port: process.env.DB_PORT || 3306,

    dialect: "mysql",

    logging: false,

    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

/* TEST CONNECTION */
const connectDB = async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ MySQL Connected Successfully");

  } catch (error) {
    console.error(
      "❌ Database connection failed:",
      error.message
    );

    process.exit(1);
  }
};

connectDB();

module.exports = sequelize;