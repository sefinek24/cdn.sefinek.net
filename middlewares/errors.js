exports.notFound = (req, res) => {
	res.status(404).json({ success: false, status: 404, message: 'Not Found' });
};

exports.rateLimited = (req, res, next, options) => {
	res.status(options.statusCode).send({ success: false, status: options.statusCode, message: options.message });
};

exports.internalError = (err, req, res, next) => {
	res.status(500).json({ success: false, status: 500, message: 'Internal Server Error' });

	if (err) console.error(err);
	return next;
};

exports.unavailable = (req, res) => {
	res.status(503).json({ success: false, status: 503, message: 'Service Unavailable' });
};