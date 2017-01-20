'use strict';

const fs = require('fs');
const promisifiedReadFile = require('./utils').promisifiedReadFile;

const filepath = 'demo-poem.txt';

// // synchronous
// console.log('...synchronous...');
// console.log('- I am first -');
// try {
// 	const contents = fs.readFileSync(filepath)
// 	console.log(contents.toString());
// } catch (err) {
// 	console.error(err);
// }
// console.log('- I am last -');

// // async with callbacks
// console.log('...asynchronous with callbacks...');
// fs.readFile(filepath, function (err, contents) {
// 	if (err) console.error(err);
// 	else console.log(contents.toString());
// 	console.log('- I am last -');
// });
// console.log('- I am first -');

// // async with promises
// console.log('...asynchronous with promises...');
// promisifiedReadFile(filepath)
// .then(contents => {
// 	console.log(contents.toString());
// }, err => {
// 	console.error(err);
// })
// .then(() => {
// 	console.log('- I am last -')
// });
// console.log('- I am first -');