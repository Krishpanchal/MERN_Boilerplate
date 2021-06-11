const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Database connection successful!"))
  .catch((err) => {
    console.log(err.message);
  });

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Sever listening on port ${PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection 💥 Shutting Down");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
