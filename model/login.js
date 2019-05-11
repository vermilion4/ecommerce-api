var mongoose = require('mongoose')

const Schema = mongoose.Schema;

let LoginSchema = new Schema({
	"username":String,
	"password":String
})

module.exports = mongoose.model('Login', LoginSchema)