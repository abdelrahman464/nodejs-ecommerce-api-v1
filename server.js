const path = require("path");
const express = require("express");
//middleware
const morgan = require("morgan");
//env file
const cors = require("cors");
const compression = require("compression");
const dotenv = require("dotenv");
//database
const dbConnection = require("./config/database");
//route
const mountRoutes = require("./routes");

//error class that i made in utils to handle operational error
const ApiError = require("./utils/apiError");
//GLobal error handling middleware for express
const globalError = require("./middlewares/errorMiddleware");

const { webhookCheckout } = require("./services/OrderService");

dotenv.config({ path: "config.env" });

//connect with database
dbConnection();
//express app
const app = express();
//enable other domains access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

//checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

//middlewares
app.use(express.json());
//serve static files inside 'uploads'
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(process.env.NODE_ENV);
}

// Mount Routes
mountRoutes(app);

//if there is a problem with routes
// catch the wrong routes that i never Mount
app.all("*", (req, res, next) => {
  //create error and send it to error handling middleware
  next(new ApiError(`Cant Find This Route ${req.originalUrl}`, 400));
});

app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`app running on ${PORT}`);
});

//handle Rejection out side express
//Events =>list =>callback(err)
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors :${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting Down.....");
    process.exit(1);
  });
});
