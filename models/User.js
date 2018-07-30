const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 13;
const Schema = mongoose.Schema

// Create Schema 
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        requried: true
    },
    password: {
        type: String,
        requried: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Pre save hook to hash passwords
UserSchema.pre('save', function (next) {
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            console.log(user.password);
            next();
        });
    });
});

// Helper method for password comparison promise based
UserSchema.methods.comparePassword = function(candidatePassword) {
    return new Promise((resolve, reject) => { 
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) reject(err, 'passwords not a match');
            return resolve(isMatch);
        });
    });
};

module.exports = User = mongoose.model('users', UserSchema);