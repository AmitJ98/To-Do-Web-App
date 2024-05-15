
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';



const maxAge = 60*60; //one hour

const createToken = (id) => {
    return jwt.sign({id} , 'this is a secret, maybe need to be changed',
                    {expiresIn: maxAge });

}





const sign_up_get  = (request,response) => {
    response.render('SignUp');

}



const logIn_get  = (request,response) => {
    response.render('logIn');
}



const create_new_acount  = async (database,request,response) => {
    const user = request.body;

    const hashedPassword = await bcrypt.hash(user.Password , 10);
    user.Password = hashedPassword;
    delete user.confirm_password;
    
    
    const existingUser = await database.collection('Users').findOne({Email:user.Email});
    if(existingUser){
        return response.status(400).json({ error: "User with this email already exists" });
    }

    await database.collection('Users').insertOne(user)
                                .then(result => {
                                    const token = createToken(result.insertedId);
                                    response.cookie('jwt' , token , {httpOnly: true , maxAge: maxAge *1000});
                                    response.status(201).redirect('/home'); })
                                .catch(err => {
                                    response.status(500).json({error:'error: could not create the user'});
                                })

}



const user_log_in = async (database,request,response) => {
    const email = request.body.Email;
    const Password = request.body.Password;

    const user = await database.collection('Users').findOne({Email:email});
    if(user){
        const auth = await bcrypt.compare(Password,user.Password);
        if(auth){
            const token = createToken(user._id);
            response.cookie('jwt' , token , {httpOnly: true , maxAge: maxAge *1000});
            response.status(201).json({user:user._id});
        }

    }
    else {
        response.status(201).json({user:"there is no user like this"});
    }


}




export default {sign_up_get, create_new_acount ,logIn_get, user_log_in}