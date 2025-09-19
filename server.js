import express from 'express';

import { fileURLToPath } from 'url'; // gives the _filename
import path from 'path'; // gives the _dirname
// combinedly these are used to find out the _dirname and set view engine as ejs.

import dotenv from 'dotenv'; // configure environment variables(env).

// used to parse data coming with post request
import bodyParser from 'body-parser'; // form data
import cookieParser from "cookie-parser"; // data coming with cookie like jwt token and user info (user id).

import connectDB from './config/db.js'; // make connection to db

// routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

// authorization
import {requireAuth} from './middleware/requireAuth.js';

const app = express();

const PORT = process.env.PORT || 3000;

dotenv.config();

connectDB();

// Get the current file's path for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs'); // set view engine as 'ejs'
app.set('views', path.join(__dirname, 'views'));

//******* middlewares *************

// parsing middlewares
app.use(bodyParser.urlencoded({ extended: true })); // for form data
app.use(express.json()); // for json data
app.use(cookieParser()); // cookie parsing 

// serve public files
app.use(express.static(path.join(__dirname, 'public'))); 

// auth middleware (custom created) will run each time a request start with user or blogs
app.use('/user', requireAuth);
app.use('/blogs', requireAuth);

// routing
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/blogs', blogRoutes);

app.get('/', (req, res) => {
    res.render('index');
});


// // You can access it from your own machine (http://localhost:PORT). But other devices on the same network cannot reach your server.
// app.listen(process.env.PORT, () => {
//     console.log(`Server running on http://localhost:${process.env.PORT}`);
// });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});