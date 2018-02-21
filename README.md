captcha-server2.0  
==============
Ready to use CAPTCHAs for your website.  

![captcha image](https://rupindr.github.io/rupindr/images/captcha1.png "captcha generated  by captcha-server2.0")
## Features  
* Customizable phrase length and possible characters  
* Captcha will be generated on your server. Therefore, no tracking by third parties.  
* No need to write extra APIs  
* User can specify various event-handlers.  
## Getting Started
### 1. Server Side ( Back-end )
1. **install captcha-server.**  
`npm install captcha-server --save`  
if you want to use [v1.0.0](/docs/Readme1.0.0.md) then run  
`npm install captcha-server@1.0.0 --save`  
2. **create new captcha.**
    ``` 
    var captchaServer = new require('captcha-server');
    var captcha = new captchaServer(5, 'ABCDEFGHIJK012345');
    ```
    captcha constructor takes two optional parameters:
    * number of characters in captcha
    * possible characters in phrase
3. **add captcha router to your express app.**  
`app.use('/', captcha.router());`  
It adds two APIs ( for serving and tesing the captcha ) to your app.  
If you are not using Express framework, use captcha-server1.0.0  
But you have to wrrite your own APIs with v1.0.0  
4. **get information from captcha.**  
you can get information about captcha using following functions:  
    * `captcha.passed()` returns `true` or `false` based on whether user has passed the captcha or not.  
    * `captcha.failCount()` returns the number of times user has submitted wrong answer.  
    * `captcha.reloadCount()` returns the number of times captcha has been  reloaded. Note that captcha reloads automatically if user   submits wrong answer.  
5. **provide optional event listeners.**  
 captcha-server2.0.0 provides following events:  
   ```
   captcha.on('reload', function(){
    // do something everytime captcha reloads
    console.log('reloaded');
    console.log(captcha.passed(), captcha.failCount(), captcha.reloadCount());
    });

    captcha.on('test', function(isPassed){
      // do something everytime user submits an answer
      // isPassed contains true or false based on right or wrong answer.
      console.log('tested ' + isPassed);
      console.log(captcha.passed(), captcha.failCount(), captcha.reloadCount());
    });

    captcha.on('pass', function(){
      // do something when user submits right answer
      console.log('passed');
      console.log(captcha.passed(), captcha.failCount(), captcha.reloadCount());
    });

    captcha.on('fail', function(){
      // do something everytime user submits wrong answer
      console.log('failed');
      console.log(captcha.passed(), captcha.failCount(), captcha.reloadCount());
    });
   ```
   Back-end of your app is ready to serve CAPTCHAs
   
### 2. Client Side ( Front-end )
[captcha-client](https://github.com/rupindr/captcha-client) is used.
#### Installation
Add following tag to your html
  `<script src="https://cdn.jsdelivr.net/gh/rupindr/captcha-client/captcha-client-1.0.0.min.js" ></script>`
#### Usage
1. **Create a div where you want to place the captcha.**  
` <div id="captcha-container" ></div>`
2. **Create a new captcha object.**  
 It takes two parameters:
   * DOM element that is container for captcha
   * API address where captcha-server is running.
  ```
     var captcha = new CaptchaClient(document.getElementById('captcha-container'), 'https://localhost:3001');
  ```
  when object is created, div #captcha-container will be popoulated with a captcha.  

3. **Adding event listeners.**  
captcha-client provides following events:
  ```
        captcha.on('load', function(){
            console.log("Loaded");
            // do something when captcha loads first time
        });
        captcha.on('reload', function(){
            console.log("Reloaded");
            // do something when captcha is reloaded
        });
        captcha.on('pass', function(){
            alert("Passed");
            // do something when captcha test is passed by user
        });
        captcha.on('fail', function(){
            alert("Try Again");
            // do something when user enters wrong characters
        });
        captcha.on('test', function(passed){
            console.log('Tested. Result is: ' + passed);
            // do something when user clicks on the submit button of captcha
        });
   ```
    
 4. **Checking if captcha test is passed or not:**   
 Use property `isPassed`.  
    ```
        if(captcha.isPassed){ //returns true if captcha is passed
            //do something
        }
    ```
  
  Check out [Captcha Example](https://github.com/rupindr/captcha-example) to see how to integrate front-end and back-end.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.
