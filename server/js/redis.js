process.chdir('..'); // so we're in the base

const express = require('express'),
      redis = require("redis"),
      session = require('express-session'),
      redisStore = require('connect-redis')(session),
      bodyParser = require('body-parser'),
      database = require('./database.js');

var client = redis.createClient();
var app = express();

app.set('views', 'webpages');
app.engine('html', require('ejs').renderFile);

app.use(session({
    secret: 'lol this is a secwet',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260}),
    saveUninitialized: false,
    resave: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/register.html', (request, response) => {
	response.render('register.html');
});

app.get('/', (request, response) => {
    // create new session object.

    if(request.session.key) {
        // if email key is sent redirect.
        response.render('index.html');
        // response.redirect('/admin');
    } else {
        // else go to home page.
        response.render('index.html');
    }
});

app.post('/__add_status', (request, response) => {
    // when user login set the key to redis.
    console.log("" + JSON.stringify(request.body));
    request.session.key=request.body.email;
    response.json({success: true, msg: request.body['msg']});
});

app.post('/register', (request,response) =>{
    // when user login set the key to redis.
    database.register_user(request.body, _ok => {
        response.json({ success: true, });
    }, err => {
        response.json({ success: false, msg: err })
    })
});

app.post('/login', (request, response) => {
    database.login_user(request.body, _ok => {
        request.session.key = request.body.username;
        response.json({ success: true, });
    }, err => {
        response.json({ success: false, msg: err })
    });
});

app.get('/logout',(request,response) => {
    request.session.destroy(err => {
        if(err){
            console.log(err);
        } else {
            response.redirect('/');
        }
    });
});

app.listen(3000, () => {
    console.log("App Started on PORT 3000");
});
