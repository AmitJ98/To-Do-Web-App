import express from 'express';
import { render } from 'ejs';
import { connectToDb, getDb } from './db.js';
import { Db, ObjectId, Timestamp } from 'mongodb';


const app = express()

let database;

connectToDb((err) => {
    if(!err){
        app.listen(3000,()=>{console.log("connect")})
        database = getDb();
    }
})


// app.listen(3000)


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




app.get('/lists' ,(requset,response) => {
    let tasks = [];
    database.collection('tasks').find()
        .sort({priority:-1})
        .toArray() // Convert the cursor to an array
        .then((taskArray) => {
            tasks = taskArray; // Assign the array of tasks
            response.render('Lists',{tasks: tasks});
         })
        .catch((err) => {
            response.status(500).json({error: 'error'}); // Handle the error
        });

});



app.get('/lists/:id' ,(requset,response) => {
    const id = requset.params.id;
    if (ObjectId.isValid(id)){
        database.collection('tasks')
        .findOne({_id: new ObjectId(id)})
        .then(doc => {
            response.status(200).render('task_details', {task:doc})
        })
        .catch((err) => {
            response.status(500).json({error: 'error'}); 
        });
    }
    else {
        response.status(500).json({error: 'NOT A VALID ID'})
    }
});


app.post('/lists' ,(requset,response) => {
   const task = requset.body;
   task.createdAt = new Date()
   database.collection('tasks')
            .insertOne(task )
            .then(result => {
                response.status(201).redirect('/lists')
            })
            .catch(err => {
                response.status(500).json({error:'coult not create a new task'});
            })
});


app.delete('/lists/:id' ,(requset,response) => {
    const id = requset.params.id;
    if (ObjectId.isValid(id)){
        database.collection('tasks')
        .deleteOne({_id: new ObjectId(id)})
        .then(result => {
            response.status(200).redirect('/lists')
        })
        .catch((err) => {
            response.status(500).json({error: 'could not delete the task'}); 
        });
    }
    else {
        response.status(500).json({error: 'NOT A VALID ID'})
    }
    
});


app.post('/lists/:id/update' ,(requset,response) => {
    const id = requset.params.id;
    const updatedTask = requset.body; // Assuming the request body contains the updated task details

    if (ObjectId.isValid(id)) {
        database.collection('tasks')
            .updateOne({ _id: new ObjectId(id) }, { $set: updatedTask })
            .then(result => {
                response.status(200).redirect('/lists')
            })
            .catch(err => {
                console.error('Error updating task:', err);
                response.status(500).json({ error: 'Failed to update task' });
            });
    } else {
        response.status(400).json({ error: 'Invalid task ID' });
    }
 });