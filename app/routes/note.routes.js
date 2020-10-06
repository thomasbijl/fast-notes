module.exports = (app) => {

    const notes = require('../controllers/note.controller.js');
    const role = require('../_helpers/role');
    const authorizeHelper = require('../_helpers/authorize')

    // Create a new Note
    app.post('/notes', authorizeHelper.authorize(role.Admin), notes.create);

    // Retrieve all Notes
    app.get('/notes', notes.findAll);

    // Retrieve a single Note with noteId
    app.get('/notes/:noteId', notes.findOne);

    // Update a Note with noteId
    app.put('/notes/:noteId', notes.update);

    // Delete a Note with noteId
    app.delete('/notes/:noteId', notes.delete);

}