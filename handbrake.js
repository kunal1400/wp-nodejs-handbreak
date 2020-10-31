const hbjs = require('handbrake-js')
const path = require('path');
const fs = require('fs');

const convertFileExtenstion = ( file, extenstion="mp4" ) => {
	var pos = file.lastIndexOf(".");
	return file.substr(0, pos < 0 ? file.length : pos) + "." + extenstion;
}

const processVideoFile = ( uploadedDirectory, uploadedFileName, mimeType, cb ) => {
	let renamedFile = convertFileExtenstion(uploadedFileName, "mp4")
	if ( uploadedDirectory ) {
		let spawnData = {
			input: `${uploadedDirectory}/${uploadedFileName}`,
			output: `${uploadedDirectory}/${renamedFile}`,
			quality: 23
		}

		console.log("1.", spawnData, "spawnData")

		new Promise(function(resolve, reject) {
			//STEP 3: Rename the uploaded file and put old suffix
			//fs.rename(spawnData.input, spawnData.output, (err) => {
			//	if (!err) {
			//		resolve('Rename complete!')
			//	}
			//	else {
			//		reject(err);
			//	}
			//});
			hbjs.spawn(spawnData)
            .on("begin",function(){
                console.log('begin')
            })
            .on('error', err => {
                // invalid user input, no video found etc
                console.log(err, "err")
                reject(err)
            })
            .on('progress', progress => {
                console.log('Percent complete: %s, ETA: %s', progress.percentComplete, progress.eta)
                // Writing the progress in file
                writeInFile(uploadedFileName, progress.percentComplete, progress.eta, function(error, data) {
                	console.log(error, data)
                })
            })
            .on("complete", function (complete) {
                console.log('complete');
                resolve({modified_file: renamedFile, 
					original_file: uploadedFileName, 
					modified_filepath:`${uploadedDirectory}/${renamedFile}`, 
					original_filepath:`${uploadedDirectory}/${uploadedFileName}`
				})
            })
		})
		.then(function(data) {
			console.log("2. Data is ready for callback Success!!", data)
			fs.unlinkSync(data.original_filepath)
			writeInFile("", "", "", function(error, data) {
	                      	console.log(error, data)
                	})
			cb(null, data)
		})
		.catch(function(errorData) {
			console.log("3. ", errorData);
			writeInFile("", "", "", function(error, data) {
                           console.log(error, data)
                        })
			cb(errorData, null)
		})
	}
	else {
		console.log("2. File not found")
	}
}

const processAudioFile = ( uploadedDirectory, uploadedFileName, mimeType, cb ) => {
	let renamedFile = convertFileExtenstion(uploadedFileName, "mp3")
	if ( uploadedDirectory ) {
		let spawnData = {
			input: `${uploadedDirectory}/${uploadedFileName}`,
			output: `${uploadedDirectory}/${renamedFile}`
		}

		console.log("1.", spawnData, "spawnData")

		new Promise(function(resolve, reject) {
			//STEP 3: Rename the uploaded file and put old suffix
			//fs.rename(spawnData.input, spawnData.output, (err) => {
			//	if (!err) {
			//		resolve('Rename complete!')
			//	}
			//	else {
			//		reject(err);
			//	}
			//});
			hbjs.spawn(spawnData)
            .on("begin",function(){
                console.log('begin')
            })
            .on('error', err => {
                // invalid user input, no video found etc
                console.log(err, "err")
                reject(err)
            })
            .on('progress', progress => {
                console.log('Percent complete: %s, ETA: %s', progress.percentComplete, progress.eta)
                // Writing the progress in file
                writeInFile(uploadedFileName, progress.percentComplete, progress.eta, function(error, data) {
                	console.log(error, data)
                })
            })
            .on("complete", function (complete) {
                console.log('complete');
                resolve({modified_file: renamedFile, 
					original_file: uploadedFileName, 
					modified_filepath:`${uploadedDirectory}/${renamedFile}`, 
					original_filepath:`${uploadedDirectory}/${uploadedFileName}`
				})
            })
		})
		.then(function(data) {
			console.log("2. Data is ready for callback Success!!", data)
			fs.unlinkSync(data.original_filepath)
			cb(null, data)
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

/**
* Writing in file
**/
const writeInFile = (filename="", percentagecomplete="", eta="", cb) => {
	var jsonToWrite = {filename, percentagecomplete, eta}

	fs.writeFile('views/index.html', JSON.stringify(jsonToWrite), function (err) {
		if (err) {
			cb(err, null)
		} else {
			cb(null, "saved")
		}
	});
}

module.exports = {
	processVideoFile,
	processAudioFile,
	writeInFile
}
