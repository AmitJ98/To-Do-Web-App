import express from 'express';


const app = express()

//enable css url link in the html
app.use('/public', express.static('public'));

app.listen(3000)



app.get('/' , (requset,response) => {
    console.log("home page")
    response.sendFile('C:\\Users\\Amit Joseph\\Desktop\\Java_Script\\To-Do-Web-App\\views\\home.html')
});


app.get('/about' ,(requset,response) => {
    console.log("about page")
    response.sendFile('C:\\Users\\Amit Joseph\\Desktop\\Java_Script\\To-Do-Web-App\\views\\About.html')
});


app.get('/SignUp' ,(requset,response) => {
    console.log("signup page")
    response.sendFile('C:\\Users\\Amit Joseph\\Desktop\\Java_Script\\To-Do-Web-App\\views\\SignUp.html')
});