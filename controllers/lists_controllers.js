import { ObjectId } from 'mongodb';
import { getDb } from '../db.js'; // Import getDb function from db.js


const show_list = (request, response) => {
    const db = getDb(); // Access the database instance using getDb
    let tasks = [];
    db.collection('tasks').find()
        .sort({ priority: -1 })
        .toArray() // Convert the cursor to an array
        .then((taskArray) => {
            tasks = taskArray; // Assign the array of tasks
            response.render('Lists', { tasks: tasks });
        })
        .catch((err) => {
            response.status(500).json({ error: 'error' }); // Handle the error
        });
};


const post_task = (request, response) => {
    const db = getDb(); // Access the database instance using getDb
    const task = request.body;
    task.priority = parseInt(task.priority);
    task.createdAt = new Date();

    db.collection('tasks')
        .insertOne(task)
        .then(result => {
            response.status(201).redirect('/lists');
        })
        .catch(err => {
            response.status(500).json({ error: 'could not create a new task' });
        });
};


const delete_task = (request, response) => {
    const db = getDb(); // Access the database instance using getDb
    const id = request.params.id;
    if (ObjectId.isValid(id)) {
        db.collection('tasks')
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
};


const update_task = (request, response) => {
    const db = getDb(); // Access the database instance using getDb
    const id = request.params.id;
    const updatedTask = request.body;
    updatedTask.priority = parseInt(updatedTask.priority);

    if (ObjectId.isValid(id)) {
        db.collection('tasks')
            .updateOne({ _id: new ObjectId(id) }, { $set: updatedTask })
            .then(result => {
                response.status(200).redirect('/lists');
            })
            .catch(err => {
                console.error('Error updating task:', err);
                response.status(500).json({ error: 'Failed to update task' });
            });
    } else {
        response.status(400).json({ error: 'Invalid task ID' });
    }
};


const task_details = (request, response) => {
    const db = getDb(); // Access the database instance using getDb
    const id = request.params.id;
    if (ObjectId.isValid(id)) {
        db.collection('tasks')
            .findOne({ _id: new ObjectId(id) })
            .then(result_task => {
                response.status(200).render('task_details', { task: result_task });
            })
            .catch((err) => {
                response.status(500).json({ error: 'error' });
            });
    } else {
        response.status(500).json({ error: 'NOT A VALID ID' });
    }
};



export default { show_list, task_details, post_task, delete_task, update_task };
