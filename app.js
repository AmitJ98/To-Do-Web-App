import express from 'express';
import { render } from 'ejs';
import { connectToDb, getDb } from './db.js';
import lists_controllers from './controllers/lists_controllers.js';
import Auth_controllers from './controllers/auth_controllers.js';
import cookieParser from 'cookie-parser';
import auth_middleware from './middleware/auth_middleware.js';

const app = express();

connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log("Connected to database. Server is running on port 3000.");
        });
    } else {
        console.error("Failed to connect to database:", err);
    }
});


app.set('view engine', 'ejs');

//middleware
app.use('/public', express.static('public'));
app.use('/scripts', express.static('scripts'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.get('*',auth_middleware.checkUser)


//info routes
app.get('/', (request, response) => {
response.redirect('/home');
});

app.get('/home', (request, response) => {
    response.render('home');
});

app.get('/about', (request, response) => {
    response.render('about');
});


// Sign up routes
app.get('/signUp', Auth_controllers.sign_up_get);
app.post('/signUp', (request, response) => Auth_controllers.create_new_acount(request, response));

// Log in routes
app.get('/login', Auth_controllers.logIn_get);
app.post('/login', (request, response) => Auth_controllers.user_log_in(request, response));

// Log out route
app.get('/logout', Auth_controllers.user_logout);


// User/profile routes





// Task list routes
app.get('/lists', auth_middleware.requireAuth, (request, response) => lists_controllers.show_list(request, response));
app.get('/lists/:id', (request, response) => lists_controllers.task_details(request, response));
app.post('/lists', (request, response) => lists_controllers.post_task(request, response));
app.post('/lists/:id/delete', (request, response) => lists_controllers.delete_task(request, response));
app.post('/lists/:id', (request, response) => lists_controllers.update_task(request, response));
