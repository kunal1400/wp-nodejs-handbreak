const hbjs = require('handbrake-js')
const path = require('path');
const fs = require('fs');

const convertFileExtenstion = ( file, extenstion="mp4" ) => {
	var pos = file.lastIndexOf(".");
	return file.substr(0, pos < 0 ? file.length : pos) + "." + extenstion;
}

const processFile = ( uploadedDirectory, uploadedFileName, cb ) => {
	let renamedFile = convertFileExtenstion(uploadedFileName)
	if ( uploadedDirectory ) {
		let spawnData = {
			input: `${uploadedDirectory}/${uploadedFileName}`,
			output: `${uploadedDirectory}/${renamedFile}`
		}

		console.log("1.", spawnData, "spawnData")

		new Promise(function(resolve, reject) {
			//STEP 3: Rename the uploaded file and put old suffix
			fs.rename(spawnData.input, spawnData.output, (err) => {
				if (!err) {
					resolve('Rename complete!')
				}
				else {
					reject(err);
				}
			});
		})
		.then(function(rename) {
			console.log("2. File renamed", spawnData);
			return spawnData
		})
		.then(function(data) {
			hbjs.spawn(spawnData)
			.on("begin",function(){
	            		console.log('begin')
	        	})
			.on('error', err => {
				// invalid user input, no video found etc
				console.log(err, "err")
	                        cb(err, null)
			})
			.on('progress', progress => {
				console.log('Percent complete: %s, ETA: %s', progress.percentComplete, progress.eta)
			})
			.on("complete", function (complete) {
	            		console.log('complete');
	                        cb(null, {modified_file: renamedFile, original_file: uploadedFileName, modified_filepath:`${uploadedDirectory}/${renamedFile}`})
	        	})
		})
		.catch(function(errorData) {
			console.log("3. ", errorData);
			cb(errorData, null)
		})
	}
	else {
		console.log("2. File not found")
	}
}

module.exports = {
	processFile
}
