const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    registration_date:{
        type: Date,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
    },
    verificationString: {
        type: String,
        required: true,
    },
    purchase_history: {
        type: Array,
        required: true,
    },
    cart: {
        type: Array,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true,
    },
});

module.exports = mongoose.model("User", userSchema);