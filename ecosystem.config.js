module.exports = {
	apps: [{
		name            : 'cdn.sefinek.net',
		script          : './index.js',

		log_date_format : 'HH:mm:ss.SSS DD.MM.YYYY',
		error_file      : '/home/ubuntu/logs/www/cdn.sefinek.net/error.log',
		out_file        : '/home/ubuntu/logs/www/cdn.sefinek.net/out.log',

		max_restarts          : 8,
		restart_delay         : 6000,
		wait_ready            : true,

		instances             : 'max',
		exec_mode             : 'cluster',
	}],
};