//IMPORT MODULES
const path = require('path');
const fs = require('fs');

var studentRepo = require('../public/docs/student_repository.json');
var filePath = path.join('public/docs','student_repository.json');

//SAVE MODEL TO REPOSITORY (ASCENDING ALPAHBETICALLY)
exports.save = (newStudent) => { 
    studentRepo.push(newStudent);

    studentRepo.sort((a,b) => a.lName.localeCompare(b.lName));
    
    fs.writeFile(filePath,JSON.stringify(studentRepo,null,4),(err) => {
        if (err) {
            console.error('Error writing file:',err);
        }
    });
}

//GET ALL MODELS
exports.find = () => studentRepo;

//GET MODEL BY USERNAME
exports.findByUsername = (username) => {
    return studentRepo.find(student => student.username === username);
}

//UPDATE MODEL BY USERNAME
exports.updateByUsername = (username,newStudentData) => {
    let student = studentRepo.find(student => student.username === username);

    if (student) {
        student.fName = newStudentData.fName;
        student.mInitial = newStudentData.mInitial;
        student.lName = newStudentData.lName;
        student.preferedName = newStudentData.preferedName;
        student.companyName = newStudentData.companyName;
        student.image = newStudentData.image;
        student.caption = newStudentData.caption;
        student.personalBackground = newStudentData.personalBackground;
        student.professionalBackground = newStudentData.professionalBackground;
        student.academicBackground = newStudentData.academicBackground;
        student.subjectBackground = newStudentData.subjectBackground;
        student.platform = newStudentData.platform;
        student.course1 = newStudentData.course1;
        student.course2 = newStudentData.course2;
        student.course3 = newStudentData.course3;
        student.course4 = newStudentData.course4;
        student.course5 = newStudentData.course5;
        student.courseReason1 = newStudentData.courseReason1;
        student.courseReason2 = newStudentData.courseReason2;
        student.courseReason3 = newStudentData.courseReason3;
        student.courseReason4 = newStudentData.courseReason4;
        student.courseReason5 = newStudentData.courseReason5;
        student.somethingInteresting = newStudentData.somethingInteresting;
        student.elseToShare = newStudentData.elseToShare;

        studentRepo.sort((a,b) => a.lName.localeCompare(b.lName));

        fs.writeFile(filePath,JSON.stringify(studentRepo,null,4),(err) => {
            if (err) {
                console.error('Error writing file:',err);
            }
        });

        return true;
    }
    else {
        return false;
    }
}

//DELETE MODEL BY USERNAME
exports.deleteByUsername = function(username) {
    let index = studentRepo.findIndex(student => student.username === username);
    
    if (index !== -1) {
        studentRepo.splice(index,1);

        fs.writeFile(filePath,JSON.stringify(studentRepo,null,4),(err) => {
            if (err) {
                console.error('Error writing file:',err);
            }
        });

        return true;
    }
    else {
        return false;
    }
}