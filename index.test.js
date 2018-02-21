var captchaServer = require('./index');

test('Successfully generates object without parameters', () => {
	expect(new captchaServer()).not.toBeNull();
});

test('Successfully generates object with one parameter', () => {
	expect(new captchaServer(10)).not.toBeNull();
});

test('Successfully generates object with two parameters', () => {
	expect(new captchaServer(20, "ADGHJ12333")).not.toBeNull();
});

test('Successfully returns router', () => {
	expect(new captchaServer().router()).not.toBeNull();
});

test('Successfully returns passed', () => {
	expect(new captchaServer().passed()).not.toBeNull();
});

test('Successfully returns failCount', () => {
	expect(new captchaServer().failCount()).not.toBeNull();
});

test('Successfully returns reloadCount', () => {
	expect(new captchaServer().reloadCount()).not.toBeNull();
});