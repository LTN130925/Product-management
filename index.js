const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const systemConfig = require("./config/system");
const database = require("./config/database");
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

require("dotenv").config();

database.connect();

const app = express();
const port = process.env.PORT;

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Flash message

app.use(cookieParser("keyboard cat"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

// End flash message

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

app.use(express.static(`${__dirname}/public`));

app.use(methodOverride("_method"));

// Routes
routeClient(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});