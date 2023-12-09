//IMPORT MODULES
const model = require('../models/student');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');

//DATABASE PAGE
exports.getDatabase = (req,res,next) => {
    let students = model.find();

    if (students) {
        res.render('./database',{students});
    } else {
        let err = new Error("Error trying to load page.");
        
        err.status = 404;
        
        next(err);
    }
};

//NEW STUDENT FORM PAGE
exports.getCreationForm = (req,res) => {
    res.render('./new');
};

//CREATE & SAVE STUDENT MODEL
exports.createStudent = (req,res,next) => {
    let newStudent = req.body;

    if (newStudent) {
        let currentDateTime = new Date();
        newStudent.dateSigned = moment.utc(currentDateTime).tz('America/New_York').format('M/D/YYYY');
        console.log(newStudent);
        let students = model.find();

        //Checks if chosen username has already been used.
        let duplicateExists = false;
        students.forEach(student => {
            if (newStudent.username == student.username) {
                duplicateExists = true;
            }
        });

        if (duplicateExists === false) {
            //Encrypts chosen password and saves to repository.
            bcrypt.hash(newStudent.password,10)
            .then(hash => {
                newStudent.password = hash;

                //Headshot configurations.
                if (req.file == undefined) {
                    newStudent.image = '/images/default.png';
                    newStudent.caption = "Profile Pic";
                } else {
                    newStudent.image = '/images/' + req.file.filename;
                }

                if (!newStudent.caption) {
                    newStudent.caption = "Profile Pic";
                }
                
                model.save(newStudent);

                req.session.user = newStudent.username;
        
                res.redirect('/');
            });
        } else {
            req.flash('error',"This username has already been taken.");

            res.redirect('/newStudent');
        }
    } else {
        let err = new Error("Error trying to load page.");
        
        err.status = 404;
        
        next(err);
    }
};

//EDIT STUDENT PROFILE
exports.getEditForm = (req,res,next) => {
    let username = req.params.username;
    let student = model.findByUsername(username);

    if (student) {
        res.render('./edit',{student});
    }
    else {
        let err = new Error("Cannot find student with username, '" + username + "'.");

        err.status = 400;

        next(err);
    }
};

exports.updateStudent = (req,res,next) => {
    let newStudentData = req.body;
    let username = req.params.username;

    //Headshot configurations.
    if (req.file == undefined) {
        newStudentData.image = '/images/default.png';
        newStudentData.caption = "Profile Pic";
    } else {
        newStudentData.image = '/images/' + req.file.filename;
    }

    if (!newStudentData.caption) {
        newStudentData.caption = "Profile Pic";
    }

    //Updates student.
    if (model.updateByUsername(username,newStudentData)) {
        res.redirect('/');
    }
    else {
        let err = new Error("Cannot find student with username, '" + username + "'.");

        err.status = 400;

        next(err);
    }
};

//DELETE STUDENT PROFILE
exports.deleteStudent = (req,res,next) => {
    let username = req.params.username;
    
    if (model.deleteByUsername(username)) {
        if (req.session.user == "admin") {
            res.redirect('/');
        } else{
            res.redirect('/logout');
        }
    }
    else {
        let err = new Error("Cannot find student with username, '" + username + "'.");

        err.status = 400;
        
        next(err);
    }
};

//LOGIN/LOGOUT
exports.login = (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username == 'admin'){
        var user = {
            username: 'admin',
            password: '$2b$10$MNC8h2xebc4FniQS4Rf5HOL9tj8bHBhyqnQ1BKc1OvL8XgGaI4FO.' //passs0rd
        };
    } else {
        var user = model.findByUsername(username);
    }

    if (user || username == 'admin'){
        //Checks if passwords are a match.
        bcrypt.compare(password,user.password)
        .then(result => {
            if (result) {
                req.session.user = username;
                req.flash('success',"You have successfully logged in!");
            } else {
                req.flash('error',"Your username or password may be incorrect.");
            }
            
            res.redirect('/');
        });
    } else {
        req.flash('error',"Your username or password may be incorrect.");

        res.redirect('/');
    }
};

exports.logout = (req,res,next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        } else {
            res.redirect('/');  
        }  
    });
};