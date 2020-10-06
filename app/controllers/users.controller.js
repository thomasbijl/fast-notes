const userService = require('../services/user.service');
const Role = require('../_helpers/role');
const User = require('../models/user.model.js');
var bcrypt = require("bcryptjs");
const config = require('config.json');
const jwt = require('jsonwebtoken');



exports.authenticate = (req, res, next) => {
    User.findOne({ username: req.body.username }, function (err, user) {

        if (user) {
            // TODO exclude password when returning user object to client
            bcrypt.compare(req.body.password, user.password).then(function (result) {
                if (result) {

                    // TODO add exp. time for more security
                    const token = jwt.sign({ sub: user._id, role: user.role }, config.secret);
                    const { password, ...userWithoutPassword } = user;

                    res.json({ user, token });
                }
                res.status(400).json({ message: 'Username or password is incorrect' })
            });
        }
    }).select("+password");
};

exports.getAll = (req, res, next) => {
    User.find()
        .then(notes => {
            res.send(notes);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
}

// This function is only possible for admins
exports.getById = (req, res, next) => {

    const currentUser = req.user;


    // only allow admins to access other user records
    if (req.params.id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    User.findOne({ _id: req.params.id }, function (err, user) {
        if (user) {
            res.json(user);
        }
    });

    // userService.getById(req.params.id)
    //     .then(user => console.log("Controller: ", user) ? res.json(user) : res.sendStatus(404))
    //     .catch(err => next(err));

};


// Create and Save a new User
// If user is admin, in the later process is must be possible to create a user with a form using recaptha
exports.create = (req, res) => {

    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    };


    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Create a User
    const user = new User({
        username: req.body.username || "Untitled User",
        password: req.body.password || "Not content was set",
        firstName: req.body.firstName || "Not content was set",
        lastName: req.body.lastName || "Not content was set",
        role: req.body.role || "Not content was set",
    });

    // Save User in the database
    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
};