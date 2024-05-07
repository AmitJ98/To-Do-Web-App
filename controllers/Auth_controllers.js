
import bcrypt from 'bcrypt';

const sign_up_get  = (request,response) => {
    response.render('SignUp');

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
                                .then(result => 
                                response.status(201).redirect('/home') )
                                .catch(err => {
                                    response.status(500).json({error:'error: could not create the user'});
                                })

}


export default {sign_up_get, create_new_acount}