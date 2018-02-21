/**
 * Copyright 2018 Rupinder Singh
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

/**
 * Local module dependencies.
 */
let captchaServer = require('./captcha-server/captcha-server.js');

module.exports = class captcha{

	/**
	 * create new object of captcha
	 *
	 * @param optional {Number} noOfChars
	 * @param optional {String} possibleChars
	 * @return {object}
	 */
	constructor(noOfChars, possibleChars){
		try{
			this._captcha = new captchaServer(noOfChars, possibleChars);
			this._router = require('express').Router();
			this._isPassed = false;
			this._reloadCount = -1;
			this._failCount = 0;

			// user event listener
			this.test = undefined;
			this.reload = undefined;
			this.fail = undefined;
			this.pass = undefined;

			this.addRoutes = this.addRoutes.bind(this);
			this.addRoutes();
		}
		catch(err){
			console.log(err);
		}
	}

	/**
     * add api end-points to express router
     */
	addRoutes(){
		try{
			this._router.get('/captcha-client/getcaptcha', (req, res) => {
				this._captcha.reload();
				this._reloadCount += 1;
				if(this.reload){
	                this.reload();
	            }
				this._captcha.getImageData(function(err, resCaptcha){
					if(err){
						console.log(err);
						res.json({Error: err});
					}
					else{
						res.json(resCaptcha);
					}
				});
			});

			this._router.post('/captcha-client/checkcaptcha', (req, res) => {
				let answer = req.body.answer;
				this._captcha.test(answer, (err, resCaptcha) => {
					if(err || !resCaptcha){
						this._isPassed = false;
						this._failCount += 1;
						if(this.fail){
			                this.fail();
			            }
						res.json({ status: "failed" });
					}
					if(resCaptcha){
						this._isPassed = true;
						if(this.pass){
			                this.pass();
			            }
						res.json({ status: "passed" });
					}
					if(this.test && !err){
						this.test(this._isPassed);
					}
				});
			});
		}
		catch(err){
			console.log(err);
		}
	}

	/**
     * add event listeners to captcha
     * @param required {String} event Name
	 * @param required {function} event Handler
     */
    on(eventName, callback){
    	try{
		    if(typeof callback != 'function'){
		        return;
		    }
		    if(eventName == 'test'){
		        this.test = callback;
		    }
		    if(eventName == 'fail'){
		        this.fail = callback;
		    }
		    if(eventName == 'pass'){
		        this.pass = callback;
		    }
		    if(eventName == 'reload'){
		        this.reload = callback;
		    }
		}
		catch(err){
			console.log(err);
		}
    }

    /**
     * public functions
     */
	router(){
		return this._router;
	}

	passed(){
		return this._isPassed;
	}

	failCount(){
		return this._failCount;
	}

	reloadCount(){
		return this._reloadCount;
	}

}