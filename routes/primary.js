//IMPORT MODULES
const express = require('express');
const controller = require('../controllers/primary');
const {fileUpload} = require('../middlewares/fileUpload');
const {isGuest,isLoggedIn,isCreator} = require('../middlewares/auth');

//CREATE ROUTER
const router = express.Router();

//ROUTES
router.get('/',controller.getDatabase);
router.get('/newStudent',isGuest,controller.getCreationForm);
router.post('/newStudent',isGuest,fileUpload,controller.createStudent);
router.get('/:username/edit',isLoggedIn,isCreator,controller.getEditForm);

router.post('/:username',isLoggedIn,isCreator,fileUpload,controller.updateStudent);
router.get('/:username/delete',isLoggedIn,isCreator,controller.deleteStudent);

router.post('/',isGuest,controller.login);
router.get('/logout',isLoggedIn,controller.logout);

//EXPORT ROUTER
module.exports = router;