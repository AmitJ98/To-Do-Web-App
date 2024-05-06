import { Db, ObjectId, Timestamp } from 'mongodb';



const show_list = (database,request,response) => {
    let tasks = [];
    console.log(database)
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
}


const post_task = (database,request,response) =>    {
    const task = request.body;
    task.createdAt = new Date()
    database.collection('tasks')
             .insertOne(task )
             .then(result => {
                 response.status(201).redirect('/lists')
             })
             .catch(err => {
                 response.status(500).json({error:'coult not create a new task'});
             })
 }


 const delete_task = (database,request,response) =>{
    const id = request.params.id;
    if (ObjectId.isValid(id)) {
        database.collection('tasks')
            .deleteOne({ _id: new ObjectId(id) })
            .then(result => {
                response.status(200).redirect('/lists');
            })
            .catch((err) => {
                response.status(500).json({ error: 'could not delete the task' });
            });
    } else {
        response.status(500).json({ error: 'NOT A VALID ID' });
    }
}


const update_task = (database,request,response) =>{
    const id = request.params.id;
    const updatedTask = request.body; 

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
 }


const task_details = (database,request,response) => {
    const id = request.params.id;
    if (ObjectId.isValid(id)){
        database.collection('tasks')
        .findOne({_id: new ObjectId(id)})
        .then(result_task => {
            response.status(200).render('task_details', {task:result_task})
        })
        .catch((err) => {
            response.status(500).json({error: 'error'}); 
        });
    }
    else {
        response.status(500).json({error: 'NOT A VALID ID'})
    }
}


export default {show_list , task_details ,post_task , delete_task, update_task};