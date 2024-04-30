import express from 'express';


const app = express()
app.listen(3000)

app.get('/' , (requset,response) => {
    console.log("the app is working")
    response.sendFile('C:\\Users\\Amit Joseph\\Desktop\\Java_Script\\To-Do-Web-App\\views\\home_page.html')
});