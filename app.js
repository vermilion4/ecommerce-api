var express = require('express')
var formidable = require('formidable')
var bodyParser = require('body-parser')

const multer = require('multer')

var Signup = require('./model/signup')
var Login = require('./model/login')

var mongoose = require('mongoose')
const nodemailer = require('nodemailer')

var fs = require('fs')
const upload = multer({dest: __dirname + '/uploads/'});

var app = express()

var port = 8080 || process.env.port



const dbURI = `mongodb+srv://Vermilion4:${encodeURIComponent('Godisgood1%24')}@express-mongodb-iixat.mongodb.net/ecommerceapi?retryWrites=true`
const options = {
	reconnectTries:Number.MAX_VALUE,
	poolSize:10
}

mongoose.connect(dbURI, options) .then( 
	()=>{
	console.log('Database connection established');
},
err => {
	console.log('Database connection error due to: ', err) 
}
);

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
 
// parse application/json
app.use(bodyParser.json())

app.post('/signup', function(req, res){
	// i am expecting data from a form from the server, so i will use body parser.

	var signupData = req.body

	//then save the data inside my database
	var dataTosave = new Signup(req.body)
	// dataTosave = req.body
	dataTosave.save((err, data) => {
		if(err){ res.send(err)}
			else{
				//save login to database
				var saveLoginData = new Login({password: req.body.password, username : req.body.username})

				saveLoginData.save((err, data) =>{
					if(err){ res.send(err)}
						else{ res.json(data) }
				})
			 }
	})

	
})

app.post('/login', function(req, res){
	//extract the data that is coming in from your response

	var loginData = req.body

	// check if your login credentials is correct in your database
	 Login.find({ username: req.body.username, password: req.body.password}, function (err, data) {
		if (err){
			res.send('login error')
		}
		else{
			console.log(data)
			if(data[0]){
				res.send('Login successful')
				}
				else{ res.send("user does not exist")}
			
		}
	});

	
})


app.get('/', function(req, res){

	var signupName = req.body.firstName
	Signup.find({ firstName: signupName}, function (err, data) {

		if(err) {
			res.send('login error')
		}
		else{
			console.log(data)
		res.send(`welcome ${signupName} to the homepage`)
	}
	});

	
})

app.post('/sendmail', (req, res)=>{
	
	
	let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          // should be replaced with real sender's account
          user: 'user@gmail.com',
          pass: '********'
      }
  });
  let mailOptions = {
      // should be replaced with real recipient's account
      to: req.body.email,
      subject: req.body.subject,
      text: req.body.text
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
      res.send(info)
  });
  res.writeHead(301);
  return res.end();
});

app.post('/upload', upload.single('image'), (req,res)=>{

if(req.file) {
        res.json(req.file);

    }
    else throw 'error';
});

app.patch('/update/:profileId', function(req, res){

	var update = req.body

	//update your database
	
		Signup.findByIdAndUpdate({_id:req.params.profileId}, update, function(err, data){
			if(err){
				res.send(err)
			}
			
				res.send(data)
			
		})
		
	

	//send your response

})

//app.delete('/delete/upload')
app.delete('/delete/:profileId', (req, res)=>{

	//get the task id
	var profileId = {_id:req.params.profileId}//req.params is made available by the body parser module.

	//search for task in the database using its id, and delete if found
	Signup.findByIdAndDelete(profileId, function(err, data){

	if(err){
		res.send(err)
	}

	//send response to client
	console.log(data)
	res.send('Profile successfully deleted')
})
})

		
		

app.get('/logout', (req, res)=>{
	res.send('Log out successful.')
})





app.listen(port, () => console.log(`listening on port ${port}`))
