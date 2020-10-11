const express = require('express')
const app = express()
const port = 3000
const hb = require('./handbrake')

app.get('/', (req, res) => {

	// STEP 1: Get the uploaded file root path (this we get from request data)
	let uploadedFilePath = req.query.fullsizepath
	
	if (!uploadedFilePath) {
		res.send({status: false, msg: "uploadedFilePath param is required"})
	}
	else {
		let uploadedFileName  = ""
		let uploadedDirectory = []

		if (uploadedFilePath) {
			let splitedArray = uploadedFilePath.split("/")
			
			if (splitedArray.length > 0) {
				uploadedFileName  = splitedArray[splitedArray.length - 1]
				for (var i = 0; i < splitedArray.length - 1; i++) {
					uploadedDirectory.push(splitedArray[i])
				}			
			}

			hb.processFile( uploadedDirectory.join("/"), uploadedFileName, function(error, data) {
				if (!error) {
					res.send({status:true, data})
				} 
				else {
					res.send({status:false, error})
				}
			})
		}
	}
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})