import jwt from 'jsonwebtoken'
import { getDb } from '../db.js'; // Import getDb function from db.js



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

////////////////////////////////////////////////////////////////This middleware doesnt work yet
// Middleware function to check the current user
// const checkUser = (request, response, next) => {
//     const token = request.cookies.jwt;
//     if (token) {
//         // Verify the JWT token
//         jwt.verify(token, 'this is a secret, maybe need to be changed', (err, decodedToken) => {
//             if (err) {
//                 console.log(err);
//                 response.locals.user = null;
//                 next();
//             } else {
//                 // Get the database instance
//                 const db = getDb();
//                 // Find the user based on the decoded token
//                 db.collection('Users').findOne({ _id: decodedToken.id })
//                     .then(user => {
//                         // Attach the user object to response.locals
//                         response.locals.user = user;
//                         next(); // Call next middleware or route handler
//                     })
//                     .catch(err => {
//                         console.error('Error finding user:', err);
//                         response.locals.user = null;
//                         next(); // Call next middleware or route handler
//                     });
//             }
//         });
//     } else {
//         // No token found, set user to null and call next
//         response.locals.user = null;
//         next();
//     }
// };




export default {requireAuth}