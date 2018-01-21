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
let charPixelData = JSON.parse(require('./char-pixel-data.js'));

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
			this._phrase = "";
			this._height = 30;
			this._width = 30;
			this._allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			this._noOfChars = noOfChars ? parseInt(noOfChars) : 5;
			this._possibleChars = possibleChars ? possibleChars : this._allowed;
			this.reload = this.reload.bind(this);

			if(this._noOfChars > 50){
				this._noOfChars = 50;
			}

			this.reload();
		}
		catch(err){
			console.log(err);
		}
	}

	/**
	 * assign new phrase to captcha
	 */
	reload(){
		try{
			let phrase = "";
			let char = ""
			let possibleChars = this._possibleChars;
			for(let i = 0; i < this._noOfChars; i++){
				char = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
				// check if character is allowed
				if(this._allowed.indexOf(char) !== -1){
					phrase += char;
				}
				else{
					i--;
					possibleChars = possibleChars.replace(char, '');
					if(possibleChars.length < 1){
						break;
					}
				}
			}
			this._phrase = phrase;
		}
		catch(err){
			this._phrase = "";
			console.log(err);
		}
	}

	/**
	 * get pixel data of current capthca
	 *
	 * @param optional {function} callback
	 * @return {object} if callback is not provided
	 */
	getImageData(callback){
		try{
			let phrase = this._phrase;
			let height = this._height;
			let width = this._width;
			let pixelData = {};
			let imgPixelIndex = 0;
			let overlapping = [];
			let bufferLength = 20;
			let degreeOfOverlapping = 20;
			let charIndex = 0;
			let pixelsInPrevRows = 0;
			let bufferPixel = 0;
			let row = 0;
			let column = 0;
			let charPixelIndex = 0;
			let pixelsInPrevChars = 0;
			let resImgData = {};

			// define overlapping for each character
			for (charIndex = phrase.length - 1; charIndex >= 0; charIndex--) {
				overlapping.push(Math.floor(Math.random() * degreeOfOverlapping));
			}

			for(row = 0; row < height; row++){
				pixelsInPrevRows = row*(phrase.length*width*4 + bufferLength*4);
				for(charIndex = 0; charIndex < phrase.length; charIndex++){
					pixelsInPrevChars = charIndex*width*4;
					for(column = 0; column < width*4; column++){
						charPixelIndex = row*width*4 + column;
						imgPixelIndex = pixelsInPrevRows + pixelsInPrevChars + column + overlapping[charIndex]*4;
						if(!charPixelData[phrase[charIndex]]){
							throw phrase[charIndex] + " is not allowed in phrase";
						}
						if(charPixelData[phrase[charIndex]][charPixelIndex]){
							pixelData[imgPixelIndex] = charPixelData[phrase[charIndex]][charPixelIndex];
						}
					}
				}
			}
			resImgData = {imgData: pixelData, width: width*phrase.length + bufferLength, height: height};
			if(typeof callback === "function"){
				callback(null, resImgData);
			}
			else{
				return resImgData;
			}
		}
		catch(err){
			if(typeof callback === "function"){
				callback(err);
			}
		}
	}

	/**
	 * test user response with actual phrase
	 *
	 * @param required {String} answer
	 * @param optional {function} callback
	 * @return {boolean} if callback is not provided
	 */
	test(answer, callback){
		try{
			if(!answer) throw "No answer provided!";
			if(typeof answer !== "string") throw "Answer is not a string!";
			// remove spaces from answer
			answer = answer.replace(/\s+/g, '');
			let res = false;
			if(answer === this._phrase){
				res = true;
			}
			if(typeof callback === "function"){
				callback(null, res);
			}
			else{
				return res;
			}
		}
		catch(err){
			if(typeof callback === "function"){
				callback(err);
			}
		}
	}

}