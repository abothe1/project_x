// note we should probably tell clients we use cookies
const PRODUCTION = false; // this /must/ be set to true so things become secure

// `express` is used to serve up webpages
// `redis` is used to store user sessions
// `mongodb` is used to store more heavy-duty objects

const EXPRESS_APP_PORT = 80,
      WEBPAGES_ROOT_DIR = '../public',
      REDIS_APP_HOST = 'localhost',
      REDIS_APP_PORT = 6379;

const express = require('express'),
      redis = require("redis"),
      session = require('express-session'),
      redis_store = require('connect-redis')(session),
      body_parser = require('body-parser'),
      cookie_parser = require('cookie-parser'),
      users = require('./users');

var client = redis.createClient();
var app = express();
var router = express.Router();

app.use(express.static(WEBPAGES_ROOT_DIR, {
	extensions: ['html']
}))

app.set('views', WEBPAGES_ROOT_DIR);
app.engine('html', require('ejs').renderFile);

// this is how sessions are handled
app.use(session({
		secret: 'secret password here ;p',
		store: new redis_store({ // store sessions with redis
			host: REDIS_APP_HOST,
			port: REDIS_APP_HOST,
			client: client,
			ttl: 260
		}),
		saveUninitialized: false,
		resave: false,
		cookie: {
			secure: PRODUCTION, 
			axAge: 86400000
		}
}));

// not sure what these do
app.use(cookie_parser("lol my secret $c5%ookie parser 0nu@mber thingy 12038!@"));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

/** These are the different paths **/

// redirect `/` to `/index`, unless we're logged in
router.get('/', (req, res) => { //(_, res) => res.render('index.html'));
	console.log(JSON.stringify(req.session));
	if (req.session.key) {
		res.redirect('/home')
	} else {
		res.redirect('/index')
	}
})

router.get('/index', (_req, res) => res.render('index.html'));

router.get('/home', (req, res) => {
	if (req.session.key) { // if logged in, display home
		res.render('home.html', { username : req.session.key['username']});
	} else {
		res.redirect('/'); // otherwise, show base page
	}
});

router.get('/register', (req, res) => {
	if (req.session.key) { // if logged in, redirect home
		res.redirect('/home')
	} else {
		res.render('register.html')
	}
});

router.get('/login', (req, res) => {
	console.log(JSON.stringify(req.session.key));
	if (req.session.key) { // if logged in, redirect to home
		res.redirect('/home')
	} else {
		res.render('login.html')
	}
});

router.get('/logout', (req, res) => {
	if(req.session.key) {
		req.session.destroy(() => res.redirect('/'))
	} else {
		res.json({ success: false, cause: 'Not logged in' })
    	res.redirect('/');
    }
})

router.get('/__get_statuses', (req, res) => {
	if (!req.session.key) {
		res.json({ success: false, cause: 'Not logged in' });
	} else {
		var username = req.session.key.username;
		require('./database').connect(db => {
			db.db('users').collection('__statuses').find({ username: username }).toArray((err, result) => {
				if(err) {
					res.json({ success: false, cause: `error with getting status: ${err}`})
				} else {
					res.json({ success: true, statuses: result })
				}
				db.close();
			})
		}, err => res.json({ success: false, cause: `db error: ${err}`}))
	}
})

router.post('/__add_status', (req, res) => {
	if (!req.session.key) {
		res.json({ success: false, cause: 'Not logged in' });
	} else {
		var username = req.session.key.username;

		require('./database').connect(db => {
			db.db('users').collection('__statuses').insertOne({ username: username, status: req.body.status }, (err, result) => {
				if(err) {
					res.json({ success: false, cause: `error with inserting status: ${err}`})
				} else {
					res.json({ success: true})
				}
				db.close();
			})
		}, err => res.json({ success: false, cause: `db error: ${err}`}))
	}
})

router.post('/login', users.login)
router.post('/register', users.register)
router.post('/logout', users.logout)

app.use('/', router);
app.listen(EXPRESS_APP_PORT, () => console.info(`Express started on port ${EXPRESS_APP_PORT}`));