import jwt from 'jsonwebtoken'


const requireAuth = (request,response,next) => {
    const token = request.cookies.jwt;
    if (token){
        jwt.verify(token,'this is a secret, maybe need to be changed',(err,decodedToken)=> {
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

export default {requireAuth}