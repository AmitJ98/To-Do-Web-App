import express from 'express';
import lists_controllers from '../controllers/lists_controllers.js';

const router = express.Router();

router.get('/', (request, response) => lists_controllers.show_list(request, response));
router.get('/:id', (request, response) => lists_controllers.task_details(request, response));
router.post('/', (request, response) => lists_controllers.post_task(request, response));
router.post('/:id/delete', (request, response) => lists_controllers.delete_task(request, response));
router.post('/:id', (request, response) => lists_controllers.update_task(request, response));

export default router;
