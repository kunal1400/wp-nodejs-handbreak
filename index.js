const express = require('express')
const app = express()
const port = 3000
const hb = require('./handbrake')
const videoMimeTypes = ['video','video/x-flv', 'video/mp4', 'application/x-mpegURL', 'video/MP2T', 'video/3gpp', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/avi']
const audioMimeTypes = ['audio', 'audio/basic','auido/L24','audio/mid','audio/mpeg','audio/mp4','audio/x-aiff','audio/x-mpegurl','audio/vnd.rn-realaudio','audio/vnd.rn-realaudio','audio/ogg','audio/vorbis','audio/vnd.wav']

app.get('/', (req, res) => {

	// STEP 1: Get the uploaded file root path (this we get from request data)
	let uploadedFilePath = req.query.fullsizepath
	let mimetype = req.query.mimetype
console.log(req.query, uploadedFilePath, mimetype, "oppo")
	if ( !uploadedFilePath ) {
		res.send({status: false, msg: "uploadedFilePath param is required"})
	} 
	else if( !mimetype ) {
		res.send({status: false, msg: "mimetype param is required"})
	}
	else {
		let uploadedFileName  = ""
		let uploadedDirectory = []
console.log(uploadedFilePath, "uploadedFilePath")
		if (uploadedFilePath) {

			let splitedArray = uploadedFilePath.split("/")
			if (splitedArray.length > 0) {
				uploadedFileName  = splitedArray[splitedArray.length - 1]
				for (var i = 0; i < splitedArray.length - 1; i++) {
					uploadedDirectory.push(splitedArray[i])
				}
			}

			// If uploaded file is video
			if ( videoMimeTypes.indexOf(mimetype) !== -1 ) {
				console.log(mimetype, "videoMimeTypes")
				hb.processVideoFile( uploadedDirectory.join("/"), uploadedFileName, mimetype, function(error, data) {
					if (!error) {
						res.send({status:true, data, mimetype:'video/mp4'})
					}
					else {
						res.send({status:false, error})
					}
				})
			}
			else if ( audioMimeTypes.indexOf(mimetype) !== -1 ) {
				console.log(mimetype, "audioMimeTypes")
				// If uploaded file is video
				hb.processAudioFile( uploadedDirectory.join("/"), uploadedFileName, mimetype, function(error, data) {
					if (!error) {
						res.send({status:true, data, mimetype:'audio/mpeg'})
					}
					else {
						res.send({status:false, error})
					}
				})
			}
			else {
				res.send({status:false, msg: "Invalid mime type"})
			}
		}
	}
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
