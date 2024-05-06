import express from 'express';
import { render } from 'ejs';
import { connectToDb, getDb } from './db.js';
import lists_controllers from './controllers/lists_controllers.js';


const app = express()

let database;

connectToDb((err) => {
    if(!err){
        app.listen(3000,()=>{console.log("connect")})
        database = getDb();
    }
})

// export default database;

app.set('view engine', 'ejs')


app.use('/public', express.static('public')); 
app.use(express.urlencoded({ extended: true }));


app.get('/' , (requset,response) => {
    response.redirect('/home')
});

app.get('/home', (requset,response) => {
    response.render('home');
});


app.get('/about' ,(requset,response) => {
    response.render('about');
});

app.get('/SignUp' ,(requset,response) => {
    response.render('SignUp')
});

app.post('/SignUp' ,(requset,response) => {
    console.log(requset.body);
    response.redirect("/home");
} );




app.get('/lists', (request, response) => lists_controllers.show_list(database, request, response));


app.get('/lists/:id' ,(requset,response) => lists_controllers.task_details(database,requset,response)); 


app.post('/lists', (request, response) => lists_controllers.post_task(database, request, response));


//need to be delete
app.post('/lists/:id/delete', (request, response) => lists_controllers.delete_task(database,request,response));


app.post('/lists/:id' ,(requset,response) => lists_controllers.update_task(database,requset,response));