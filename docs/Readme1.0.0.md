captcha-server
===========
It provides easy access to *Completely Automated Public Turing test to tell Computers and Humans Apart (CAPTCHA)*

## Installation
  npm install captcha-server --save
## Usage
**1.Require captcha-server module.**
  

    var captchaServer = require('captcha-server');
  
**2.Create new captcha object. It takes two optional parameters i.e. Number of characters in the captcha, Possible characters in the phrase. For Example:**  

    var captcha = new captchaServer();
    var captcha1 = new captchaServer(5);
    var captcha2 = new captchaServer(5, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    var captcha3 = new captchaServer(5, "012345ABCDEF");
**3.Sending image data to client.**  
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

 **4.Testing user response against captcha:**    
 Async (recommended):
 

    captcha.test(userResponse, (err, resCaptcha) => {
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
   **5.Reloading captcha:**
   

    captcha.reload(); // this will assign new phrase to captcha

**6.Check out [Captcha Example](https://github.com/rupindr/captcha-example) to see how to integrate with front-end.**

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.\* Initial release  
* 1.0.\* Version One Stable