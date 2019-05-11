var mongoose = require('mongoose')

//signup model
const Schema = mongoose.Schema;

let SignupSchema = new Schema({
	"firstName":String,
	"lastName":String,
	"username":String,
	"password":String,
	"bio":String,
	"email":String,
	"gender":String,
	"phoneNumber": Number,
	"address":String,
	"state":String
})

module.exports = mongoose.model('Signup', SignupSchema)