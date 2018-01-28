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
			this._colorR = 0;
			this._colorG = 0;
			this._colorB = 0;
			this._allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			this._noOfChars = noOfChars ? parseInt(noOfChars) : 5;
			this._possibleChars = possibleChars ? possibleChars : this._allowed;
			this.reload = this.reload.bind(this);
			this.addLineToPixelData = this.addLineToPixelData.bind(this);
			this.addNoiseToPixelData = this.addNoiseToPixelData.bind(this);

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
			let possibleChars = this._possibleChars;
			for(let i = 0; i < this._noOfChars; i++){
				let char = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
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
			let overlapping = [];
			let bufferLength = 20;
			let degreeOfOverlapping = 20;
			let resImgData = {};

			// define overlapping for each character
			for (let charIndex = phrase.length - 1; charIndex >= 0; charIndex--) {
				overlapping.push(Math.floor(Math.random() * degreeOfOverlapping));
			}

			for(let row = 0; row < height; row++){
				let pixelsInPrevRows = row*(phrase.length*width*4 + bufferLength*4);
				for(let charIndex = 0; charIndex < phrase.length; charIndex++){
					let pixelsInPrevChars = charIndex*width*4;
					for(let column = 0; column < width*4; column++){
						let charPixelIndex = row*width*4 + column;
						let imgPixelIndex = pixelsInPrevRows + pixelsInPrevChars + column + overlapping[charIndex]*4;
						if(!charPixelData[phrase[charIndex]]){
							throw phrase[charIndex] + " is not allowed in phrase";
						}
						if(charPixelData[phrase[charIndex]][charPixelIndex]){
							pixelData[imgPixelIndex] = charPixelData[phrase[charIndex]][charPixelIndex];
						}
					}
				}
			}
			width = width*phrase.length + bufferLength;
			pixelData = this.addNoiseToPixelData(pixelData, width, height);
			pixelData = this.addLineToPixelData(pixelData, width, height);
			pixelData = this.addLineToPixelData(pixelData, width, height); // add a second line
			resImgData = {imgData: pixelData, width: width, height: height};
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

	/**
	 * private function
	 *
	 * @param required {object} pixelData
	 * @param required {Number} width
	 * @param required {Number} height
	 * @return {object} pixelData
	 */
	addNoiseToPixelData(pixelData, width, height){
		let modifiedPixelData = pixelData;
		let noOfPixelsModified = 0;
		let maxNoise = width*height/5;

		while(noOfPixelsModified < maxNoise){
			let indexToModify = Math.floor(Math.random()*width*height)*4;
			modifiedPixelData[indexToModify] = this._colorR;
			modifiedPixelData[indexToModify + 1] = this._colorG;
			modifiedPixelData[indexToModify + 2] = this._colorB;
			modifiedPixelData[indexToModify + 3] = 255;
			noOfPixelsModified++;
		}

		return modifiedPixelData;
	}

	/**
	 * private function
	 *
	 * @param required {object} pixelData
	 * @param required {Number} width
	 * @param required {Number} height
	 * @return {object} pixelData
	 */
	addLineToPixelData(pixelData, width, height){
		let modifiedPixelData = pixelData;
		let currRow = Math.floor(Math.random()*height);
		let currColumn = 0;
		let thickness = 2;

		while(currColumn < width*4){
			let upOrDownFactor = Math.random();
			if(upOrDownFactor < 0.5 && currRow < height -1){
				currRow += 1;
			}
			else if(currRow > 0){
				currRow -= 1;
			}
			for(let i = 0; i < thickness; i++){
				modifiedPixelData[width*4*(currRow + i) + currColumn] = this._colorR;
				modifiedPixelData[width*4*(currRow + i) + currColumn + 1] = this._colorG;
				modifiedPixelData[width*4*(currRow + i) + currColumn + 2] = this._colorB;
				modifiedPixelData[width*4*(currRow + i) + currColumn + 3] = 255;
			}
			currColumn += 4;
		}

		return modifiedPixelData;
	}

}