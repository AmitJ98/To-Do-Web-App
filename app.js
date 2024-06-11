import express from 'express';
import { render } from 'ejs';
import cookieParser from 'cookie-parser';
import { connectToDb, getDb } from './db.js';
import Auth_controllers from './controllers/auth_controllers.js';
import auth_middleware from './middleware/auth_middleware.js';
import listRoutes from './Routes/ListRoutes.js'

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
app.use(['/lists'], auth_middleware.requireAuth);


app.use('/lists', listRoutes); // all the list routes



app.get('*',auth_middleware.checkUser)


//info routes
app.get('/', (request, response) => {
response.redirect('/home');
});

app.get('/home', (request, response) => {
    let username;
    if (response.locals.user != null)
        {
        username = response.locals.user.UserName;
        }
    
    response.render('home',{uname:username});
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
app.get('/profile',(request, response) => {
    response.redirect('home');
    })
