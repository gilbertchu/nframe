const express = require('express');
const router = express.Router();
//const bodyParser = require('body-parser');

router.get('/', function (req, res, next) {
	res.status(200).json({message:"got test"});
});


//testing raw-body
const getRawBody = require('raw-body');
//const contentType = require('content-type')

router.post('/', function (req, res, next) {
	getRawBody(req, {
		length: req.headers['content-length'],
		limit: '10kb',
		encoding: 'utf-8'
		//encoding: contentType.parse(req).parameters.charset
	}, function (err, bstring) {
		if (err) {
			console.log("[ptest rbody]", e);
			res.status(500).json({error:"parse error",});
			return;
		}

		if (typeof bstring !== "string" || !bstring.length) {
			res.status(200).json({message:"invalid body", data:bstring});
			return;
		}

		var bjson;
		try {
			bjson = JSON.parse(bstring);
		} catch (e) {
			console.log("[ptest json]", bstring, e);
			res.status(400).json({error:"invalid json"});
			return;
		}

		res.status(200).json({message:"post success", data:bjson});
	});
});

module.exports = router;