const { Router } = require('express');
const authController = require('../controllers/authController');
const taskController = require('../controllers/taskController');

const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);


router.get('/tasks',taskController.tasks_get);
router.get('/add_task',taskController.add_task);
router.get('/update_task',taskController.update_task);
router.post('/api/tasks',taskController.create);
router.get('/api/tasks',taskController.find);
router.put('/api/tasks/:id',taskController.update);
router.post('/api/tasks/:id',taskController.delete);

router.get('/profile',authController.update_load);
router.post('/profile',authController.update_profile);

router.get('/courses', authController.courses_get);

module.exports = router;