import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { getDb } from '../db.js'; 


const maxAge = 60 * 60; //one hour


const createToken = (id) => {
    return jwt.sign({ id }, 'this is a secret, maybe need to be changed', {
        expiresIn: maxAge
    });
};


const sign_up_get = (request, response) => {
    response.render('SignUp');
};


const logIn_get = (request, response) => {
    response.render('logIn');
};


const create_new_acount = async (request, response) => {
    const user = request.body;
    const db = getDb(); // Access the database instance using getDb

    const hashedPassword = await bcrypt.hash(user.Password, 10);
    user.Password = hashedPassword;
    delete user.confirm_password;

    const existingUser = await db.collection('Users').findOne({ Email: user.Email });
    if (existingUser) {
        return response.status(400).json({ error: "User with this email already exists" });
    }

    await db.collection('Users').insertOne(user)
        .then(result => {
            const token = createToken(result.insertedId);
            response.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            response.status(201).redirect('/home');
        })
        .catch(err => {
            response.status(500).json({ error: 'error: could not create the user' });
        });
};


const user_log_in = async (request, response) => {
    const email = request.body.Email;
    const Password = request.body.Password;
    const db = getDb(); // Access the database instance using getDb

    const user = await db.collection('Users').findOne({ Email: email });
    if (user) {
        const auth = await bcrypt.compare(Password, user.Password);
        if (auth) {
            const token = createToken(user._id);
            response.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            response.status(201).redirect('/home');
        }
    } else {
        response.status(201).json({ user: "there is no user like this" });
    }
};


const user_logout = (request, response) => {
    response.cookie('jwt', '', { maxAge: 1 });
    response.redirect('/home');
};



export default { sign_up_get, create_new_acount, logIn_get, user_log_in, user_logout };
