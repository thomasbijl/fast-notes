module.exports = (app) => {

    const users = require('../controllers/users.controller.js');
    const notes = require('../controllers/note.controller.js');
    const role = require('../_helpers/role');
    const authorizeHelper = require('../_helpers/authorize')


    // Authentication endpoint, returns jwt-token
    app.post('/users/authenticate', users.authenticate);

    //Get all users if role is administrator
    app.get('/users',
        authorizeHelper.authorize(role.Admin),
        users.getAll);

    // Get user by id
    app.get('/users/:id',
        authorizeHelper.authorize(role.User),
        users.getById);

    // Create a new User, only if role is administrator
    app.post('/users',
        authorizeHelper.authorize(role.Admin),
        users.create);


    // Create a new Note, only a manager should have the possibility to create a note
    app.post('/notes', authorizeHelper.authorize([role.Manager, role.Admin]), notes.create);

    // Retrieve all Notes, every logged in user should access all notes
    app.get('/notes', notes.findAll);

    // Retrieve a single Note with noteId, e
    app.get('/notes/:noteId', notes.findOne);

    // Update a Note with noteId, only 
    app.put('/notes/:noteId', notes.update);

    // Delete a Note with noteId, only 
    app.delete('/notes/:noteId', notes.delete);

}