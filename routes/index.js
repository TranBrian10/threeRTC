var express = require('express');
var router = express.Router();

/* GET desktop page */
router.get('/', function(req, res) {
	// Redirect for mobile devices
	const userAgent = req.header('user-agent');

	if (/mobile/i.test(userAgent)) {
		res.redirect('/mobile');
	}

	res.render('desktop', { title: 'Interactive RTC' });
});

/* GET mobile page */
router.get('/mobile', function(req, res) {
	res.render('mobile', { title: 'Interactive RTC' });
});

module.exports = router;
