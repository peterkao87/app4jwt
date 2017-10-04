const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

app.use(express.static('public'))    // no install needed, it is a build-in middleware
var path = require('path')           // install needed

const jsonWebToken = require('jsonwebtoken')   //  create and decode the JWT tokens
const myJWTSecretKey = 'jd-secret-key'   

// declare a function
var verifyToken = (token) => {
    console.log('11:52 before verify')
    try {
        //jsonWebToken.verify(req.params.token, myJWTSecretKey)
        console.log('token = ' + token)
        jsonWebToken.verify(token, myJWTSecretKey)
        console.log('after verify, it is good')
        return true
    } catch (error) {
        console.log('after verify, it is bad')
        return false
    }  
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/home.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/login.html'))
})

app.post('/login', (req, res) => {
    var msg

    // 1. get the posting data
    const p_username = req.body.username
    const p_password = req.body.password
    console.log('p_userName = ' + p_username + ' , p_password = ' + p_password)
    
    // 2. verify the data in the database, 
    //     if not match, return error message
    //     if match, sign it
    if (p_username !== 'wiwi'){
        console.log('not found, please login')
        msg = 'username_error'
        res.json({message: msg})
        return
    }

    if (p_password !== 'iwiw'){
        console.log('password not correct, please try again')
        msg = 'password_error'
        res.json({message: msg})
        return
    }

    // 3. sign
    var token
    const user = {
                username: p_username,
                id: 1,
                name: 'John Doe'
                //expiresIn:  3 * 60    3 minutes     not work
            };
    // sign with default (HMAC SHA256) 
    token = jsonWebToken.sign(user, myJWTSecretKey, {expiresIn:  8 * 60 * 60}) 

    // 4. sign error
    if (token === undefined){
        console.log('token sign error')
        msg = 'token_error'
        res.json({message: msg})
        return
    }

    // 5.  return the status and the user data
    console.log('sign ok')
    res.json({
          token: token
     })
})

app.get('/public', 
        (req, res) => {
             res.send('hello from public') 
        }
)

app.get('/private', 
    (req, res) => {
        res.sendFile(path.join(__dirname + '/public/html/private.html'))
    }
)

app.post('/private', (req, res) => {
    console.log('enter private')
    
    // get the token
    const token = req.body.token
    console.log('test 11:40, in private, token = ' + token)
    
    // call a function to verify
    var result = verifyToken(token)

    var msg
    if (result === false){
        msg =  'no token or invalid token, please login again'
    } else {  
        msg = 'This is the data from private route'
    }
    // return data
    res.json({
          message: msg
     })
})

app.get('/private/detail', 
    (req, res) => {
        res.sendFile(path.join(__dirname + '/public/html/private_detail.html'))
    }
)

app.post('/private/detail', (req, res) => {
    console.log('enter private detail')
    
    // get the token
    const token = req.body.token
    console.log('test 2:40, in private, token = ' + token)
    
    // call a function to verify
    var result = verifyToken(token)

    var msg
    if (result === false){
        msg =  'no token or invalid token, please login again'
    } else {  
        msg = 'This is the data from private detail route'
    }
    // return data
    res.json({
          message: msg
     })
})

app.listen(3000, () => {
        console.log('Server is running at: 3000, 930-622')
})