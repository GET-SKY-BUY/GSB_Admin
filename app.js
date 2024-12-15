"use strict";
// Importing the required modules
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const pug = require('pug');

// Initialize the express app
const app = express();
dotenv.config();

// Environment variables
const PORT = process.env.PORT;
const Cookie_Secret = process.env.COOKIE_SECRET;
const NODE_ENV = process.env.NODE_ENV;

// Protocol 
let Protocol = "http";
if (NODE_ENV === 'production') {
    Protocol = 'https';
};

// Set the view engine to pug
app.set('view engine', 'pug');
app.set('views', [
    path.join(__dirname, './Pug/Sellers'),
    path.join(__dirname, './Pug/Admin'),
    path.join(__dirname, './Pug/Common'),
    path.join(__dirname, './Pug/Sellers_Store'),
    path.join(__dirname, './Pug/Products_Assistant'),
    path.join(__dirname, './Pug/Contact_Us'),
]);

// Setup static files
app.use("/files", express.static(path.join(__dirname, './Public')));
app.use("/products/img/", express.static(path.join(__dirname, './Converted_Images')));

// Home route
app.get("/", (req, res) => {
    res.status(200).render("Home");
});

// Admin Route
app.use("/admin", require('./Routes/Admin.js'));
app.use("/sellers_assistant", require('./Routes/Sellers_Assistant.js'));
app.use("/sellers_store", require('./Routes/Sellers.js'));
app.use("/qr", require('./Routes/QR.js'));
app.use("/products_assistant", require('./Routes/Products_Assistant.js'));
app.use("/contact_us", require('./Routes/Contact_Us.js'));
app.use("/order", require('./Routes/Order.js'));


app.get("/analytics", (req, res) => {
    res.status(404).send("<h2>Coming soon <a href='/'>Go to Home</a></h2>");
});
app.get("/complaint", (req, res) => {
    res.status(404).send("<h2>Coming soon <a href='/'>Go to Home</a></h2>");
});
app.get("/payment", (req, res) => {
    res.status(404).send("<h2>Coming soon <a href='/'>Go to Home</a></h2>");
});

// Project URL
const Project_URL = `${Protocol}://${process.env.PROJECT_DOMAIN}`;

// Setup body-parser middleware for parsing JSON
app.use(bodyParser.json());

// Setup body-parser middleware for parsing URL encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser middleware for parsing cookies
app.use(cookieParser(Cookie_Secret));

// Helmet middleware for securing the app
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'" , Project_URL], // Allow resources from the same origin
            scriptSrc: ["'self'", "'unsafe-inline'", Project_URL],
            styleSrc: ["'self'", "'unsafe-inline'", Project_URL], 
            StyleSheetListSrc: ["'self'", Project_URL], // Allow stylesheets
            imgSrc: ["'self'", "data:", Project_URL],
        }
    },
    frameguard: { action: 'deny' }, // Prevent clickjacking by denying framing
    hsts: { maxAge: 31536000 }, // Enforce HTTPS for 1 year
    xssFilter: true, // Enable XSS filter in browsers
    noSniff: true, // Prevent MIME sniffing
    hidePoweredBy: true,
}));

// Setup cors middleware for cross-origin requests
app.use(cors(
    {
        origin: [
            Project_URL,
            "https://www.google.com",
            "https://google.com",
            "https://bing.com",
            "https://www.bing.com",
        ],
        credentials: true,
        optionsSuccessStatus: 200,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Length', 'X-Knowledge-Base'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }
));

// Setup middleware to remove the X-Robots-Tag header
app.use((req, res, next) => {
    // res.removeHeader("X-Robots-Tag");
    // res.set('X-Robots-Tag', 'index, follow');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    next();
});

// Error handling middleware
app.use(async(err, req, res, next) => {
    if(req.Delete_Product_Images){
        if(req.Converted_Product_Images){
            for(let i = 0; i < req.Converted_Product_Images.length; i++){
                let ImgPath = path.join(__dirname, "../Converted_Images", req.Converted_Product_Images[i]);
                await fs.unlinkSync(ImgPath);
            };
        };

        const files = Object.assign({}, req.Delete_Product_Images);
        for (let index = 1; index < 8; index++) {
            let Image = `Image${index}`;
            if (files[Image] && files[Image][0]) {
                const inputPath = path.join(__dirname, './Uploaded_Product_Images', files[Image][0].filename);
                fs.unlinkSync(inputPath);
            };
        };
    };
    const File_Path = path.join(__dirname, './Logs', 'error.log');
    fs.appendFile( File_Path, err.stack , (err) => {
        if (err) {
            console.error(err.stack);
        };
    });
    return res.status(500).json({
        Status: "Error",
        Message: "Something happened. Please try again later.",
        Error_Type: "Internal Server Error.",
    });
});

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nDisallow: /private/`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server link: ${Project_URL}`);
});