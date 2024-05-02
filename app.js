import express from 'express';
import { render } from 'ejs';


const app = express()
app.listen(3000)


app.set('view engine', 'ejs')


app.use('/public', express.static('public')); //enable css url link in the html
app.use(express.urlencoded({ extended: true }));




app.get('/' , (requset,response) => {
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
    response.redirect("/");
} );


app.get('/lists' ,(requset,response) => {
    const tasks = [{task:'clean the room' ,description:'bla bla bla bla'},
    {task:'do my homework' ,description:'who does homework'}
    ]
    response.render('Lists',{tasks: tasks});
});