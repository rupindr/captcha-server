var captchaServer = require('./captcha-server');

test('Successfully generates object without parameters', () => {
	expect(new captchaServer()).not.toBeNull();
});

test('Successfully generates object with one parameter', () => {
	expect(new captchaServer(10)).not.toBeNull();
});

test('Successfully generates object with two parameters', () => {
	expect(new captchaServer(20, "ADGHJ12333")).not.toBeNull();
});

test('Successfully generates correct phrase length with one parameters', () => {
	expect(new captchaServer(15)._phrase.length).toBe(15);
});

test('Successfully generates correct phrase length with two parameters', () => {
	expect(new captchaServer(30, "")._phrase.length).toBe(30);
});

var captcha = new captchaServer();

test('Returns image data synchronously', () => {
	expect(captcha.getImageData()).not.toBeNull();
});

test('Returns image data asynchronously', (done) => {
	function callback(err, res){
		expect(res).not.toBeNull();
		done();
	}
	captcha.getImageData(callback);
});

test('Returns false on wrong answer', (done) => {
	function callback(err, res){
		expect(res).not.toBeTruthy();
		done();
	}
	captcha.test("ADNH", callback);
});

test('Returns true on right answer', (done) => {
	function callback(err, res){
		expect(res).toBeTruthy();
		done();
	}
	captcha.test(captcha._phrase, callback);
});