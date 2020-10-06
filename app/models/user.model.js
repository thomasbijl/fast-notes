const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    id: String,
    username: String,
    password: {
        type: String,
        required: true,
        select: false,
    },
    firstName: String,
    lastName: String,
    role: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note"
        }
    ]

}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);

// Simple explanation how the model works
// { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
