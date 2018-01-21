captcha-server
===========
A simple Node module that provides Completely Automated Public Turing test to tell Computers and Humans Apart (CAPTCHA)

## Installation
	npm install captcha-server --save
## Usage
Require captcha-server module.
	

    var captchaServer = require('captcha-server');
	
Create new captcha object. You can provide one or both of the optional parameters.( Number of characters in the captcha, Possible characters in the phrase. )  Following are few examples:  

    var captcha = new captchaServer();
    var captcha = new captchaServer(5);
    var captcha = new captchaServer(5, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    var captcha = new captchaServer(5, "012345ABCDEF");
Sending image data to client.  
	Async (recommended):
	

    captcha.getImageData(function(err, resCaptcha){
   		if(err){
   			console.log(err);
   		}
   		else{
   			// do something with resCaptcha.
   		}
    });  
    
	

Sync:
	

    var imageData = captcha.getImageData();
    // send imageData to client

 Testing user response against captcha:  
 Async (recommended):
 

    cap.test(userResponse, (err, resCaptcha) => {
   		if(err || !resCaptcha){
	   		// send negative response to client.
   			res.json({ status: "failed" });
   		}
   		if(resCaptcha){
	   		// send positive response to client.
   			res.json({ status: "passed" });
   		}
   	});
Sync:

    var isCaptchaTestPassed = captcha.test(userResponse);
    // do something with isCaptchaTestPassed
   Reloading captcha:
   

    captcha.reload(); // this will assign new phrase to captcha

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.0 Initial release
