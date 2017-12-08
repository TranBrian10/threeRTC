var express = require('express');
var router = express.Router();

/* GET home page */
router.get('/', function(req, res) {
	res.render('index', { title: 'threeRTC' });
});

/* GET user agent */
router.get('/user-agent', function(req, res) {
	const userAgent = req.header('user-agent');

	if (/mobile/i.test(userAgent)) {
		res.send({ userAgent: 'Mobile' });
	}

	res.send({ userAgent: 'Desktop' });
});

module.exports = router;
