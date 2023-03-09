const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const rateLimit = require('express-rate-limit');
const timeout = require('express-timeout-handler');
const { notFound, internalError, rateLimited, unavailable } = require('./middlewares/errors.js');
const { version, description } = require('./package.json');

// Run express instance
const app = express();

// Set
app.set('trust proxy', 1);

// Use
app.use(helmet());

// Logger
app.use(morgan('[:status :response-time ms] :method :url :user-agent'));

// Timeout handler
const Options = { timeout: 8000, onTimeout: unavailable, disable: ['write', 'setHeaders', 'send', 'json', 'end'] };
app.use(timeout.handler(Options));

// Static directory
app.use(express.static('public'));

// Rate-limits
const limiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 124, standardHeaders: true, legacyHeaders: false, handler: rateLimited });
app.use(limiter);

// Favicon
app.use(favicon('public/favicon.png'));


// Endpoints
app.get('/', (req, res) =>
	res.type('json').send(JSON.stringify({
		success: true,
		status: 200,
		message: description,
		version,
		worker: process.pid,
		contact: 'contact@sefinek.net',
		domain: {
			main: 'https://sefinek.net',
			api: 'https://api.sefinek.net',
			cdn: 'https://cdn.sefinek.net',
		},
		path: {
			static: '/',
			gitResources: '/resources',
			images: '/images',
			temp: '/temp',
		},
		other: {
			ssl: true,
			proxy: true,
		}
	}, null, 3)),
);


/* Resources for Genshin Impact Stella Mod v2 */
app.use('/resources/v2/genshin-impact-reshade', express.static('/home/sefinek/node/www/cdn.sefinek.net/data/Genshin-Impact-ReShade_Resources'));

/* Resources for Genshin Impact Stella Mod v1 */
app.get('/resources/genshin-impact-reshade/launcher/download.exe', (req, res) => res.status(200).sendFile('/home/sefinek/node/www/cdn.sefinek.net/data/Genshin-Impact-ReShade_Resources/setup/Genshin Impact Mod Setup.exe'));

app.get('/resources/genshin-impact-reshade/reshade/config', (req, res) => res.status(200).sendFile('/home/sefinek/node/www/cdn.sefinek.net/data/Genshin-Impact-ReShade_Resources/reshade/ReShade.ini'));
app.get('/resources/genshin-impact-reshade/reshade/log', (req, res) => res.status(200).sendFile('/home/sefinek/node/www/cdn.sefinek.net/data/Genshin-Impact-ReShade_Resources/reshade/ReShade.log'));

// FPS Unlocker
app.get('/resources/genshin-impact-reshade/unlocker-config', (req, res) => res.status(200).sendFile('/home/sefinek/node/www/cdn.sefinek.net/data/Genshin-Impact-ReShade_Resources/unlocker.config.json'));



/* Other */
app.use('/resources/PiHole-Blocklist-Collection', express.static('data/PiHole-Blocklist-Collection'));


// Errors
app.use(notFound);
app.use(internalError);

// Run server
app.listen(process.env.PORT, () => {
	if (process.env.NODE_ENV === 'production') process.send('ready'); else console.log(`Website https://cdn.sefinek.net is running on http://127.0.0.1:${process.env.PORT}`);
});