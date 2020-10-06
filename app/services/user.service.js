const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('../_helpers/role');
const User = require('../models/user.model.js');
var bcrypt = require("bcryptjs");





module.exports = {
    authenticate,
    getAll,



};

async function authenticate({ username, password }) {
    User.findOne({ username: username }, function (err, user) {

        console.log("Gebruiker zonder regel:", user);

        if (user) {
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
                    const { password, ...userWithoutPassword } = user;


                    console.log('Result van bcrypt: ', result);
                    console.log('Gebruiker zonder wachtwoord: ', ...userWithoutPassword);
                    // Gaat iets mis bij het omzetten naar een user object, kijken hoe dit verholpen kan worden.

                    // Token wordt al gegenereerd
                    // console.log('Gebruiker: ',
                    //     { ...userWithoutPassword }
                    // );
                    return {
                        ...userWithoutPassword,
                        token
                    };
                }
            });
        }
    });




}

async function getAll() {
    return User.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}


