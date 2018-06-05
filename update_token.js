var watson = require('watson-developer-cloud');
var fs = require('fs')

var jsonCredential = JSON.parse(fs.readFileSync('credential.json'))

var authorization = new watson.AuthorizationV1({
  username: jsonCredential.username,
  password: jsonCredential.password,
  url: jsonCredential.url
});
 
authorization.getToken(function (err, token) {
  if (!token) {
    console.log('error:', err);
  } else {
    console.log(token)
    fs.writeFile('lib/token', token, function(err){
    	console.log('error: ', err)
    })
    console.log('token saved!')
  }
});