import jwt from 'jsonwebtoken'
import { getDb } from '../db.js'; 
import { ObjectId } from 'mongodb';




//check jason web token exists & if is original
const requireAuth = (request,response,next) => {
    const token = request.cookies.jwt;
    if (token){
        jwt.verify(token,'this is a secret, maybe need to be changed',(err,decodedToken) => {
            if(err) {
                console.log(err);
                response.redirect('/login')
            } else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else{
        response.redirect('/login')
    }
}


const checkUser = (request, response, next) => {
    const token = request.cookies.jwt;
    if (token) {
        // Verify the JWT token
        jwt.verify(token, 'this is a secret, maybe need to be changed', async (err, decodedToken) => {
            if (err) {
                console.log('JWT verification error:', err);
                response.locals.user = null;
                return next();
            }

            try {
                // Get the database instance
                const db = getDb();
                // Find the user based on the decoded token
                const user = await db.collection('Users').findOne({ _id: new ObjectId(decodedToken.id) }, { projection: { Password: 0 } });
                if (user) {
                    console.log('User found:', user._id); // Print the user to the log
                } else {
                    console.log('No user found with the given ID');
                }
                response.locals.user = user;
            } catch (dbError) {
                console.error('Error finding user:', dbError);
                response.locals.user = null;
            }

            // Call next middleware or route handler
            next();
        });
    } else {
        // No token found, set user to null and call next
        response.locals.user = null;
        next();
    }
};


export default {requireAuth,checkUser}