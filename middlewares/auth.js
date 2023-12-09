const model = require('../models/student');

//CHECKS IS USER IS A GUEST (NOT LOGGED IN)
exports.isGuest = (req,res,next) => {
    if (!req.session.user) {
        return next();
    } else {
        let err = new Error("Unauthorized access.");
            
        err.status = 401;

        return next(err);
    }
};

//CHECKS IS USER IS CURRENTLY LOGGED IN
exports.isLoggedIn = (req,res,next) => {
    if (req.session.user) {
        return next();
    } else {
        let err = new Error("Unauthorized access.");
            
        err.status = 401;

        return next(err);
    }
};

//CHECKS IF THE LOGGED IN USER IS THE CREATOR
exports.isCreator = (req,res,next) => {
    let username = req.params.username;
    let student = model.findByUsername(username);

    if (student) {
        if (req.session.user == student.username || req.session.user == 'admin') {
            return next();
        } else {
            let err = new Error("Unauthorized access.");
            
            err.status = 401;

            return next(err);
        }
    } else {
        let err = new Error("Cannot Find student with username, " + username);

        err.status = 404;
        
        next(err);
    }
};