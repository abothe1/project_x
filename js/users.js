module.exports = {
	register: register,
	login: login,
	logout: logout
}

const database = require('./database');

function filter_request(request, valid_fields, cb_err) {
	var result = {};
	for (var i = 0; i < valid_fields.length; i++) {
		var field = valid_fields[i];

		if (!(result[field] = request[field])) {
			cb_err(`Missing required field '${field}'`);
			return false;
		}
	}
	return result;
}

function register(req, res) {
	if (req.session.key) {
		res.json({ success: false, cause: 'Already logged in'});
		return;
	}

	var failure = cause => res.json({success: false, cause: cause})
	console.log(JSON.stringify(req.body));
	// first filter out all bad requests
	var user = filter_request(req.body, ['username', 'password', 'email'], failure);

	if (!user) // return if invalid request
		return;

	database.connect(db => {
		var users_collection = db.db('users').collection('users');
		// search for accounts with the same username
		users_collection.find({ username: user.username }).toArray((err, users) => {
			if (err) { // couldn't convert to array for some reason
				console.error(`Error with converting to array: ${err}`)
				db.close();
				return failure('An internal error occured');
			} else if (users.length !== 0) { // user already exists
				db.close();
				console.log(JSON.stringify(users));
				return failure(`User ${user.username} already exists`);
			}

			users_collection.insertOne(user, (err, _result) => {
				if (err) {
					console.error(`Error with inserting user: ${err}`)
					failure('An internal error occured');
				} else {
					res.json({ success: true })

				}
				db.close();
			})
			db.close()
		})
	}, failure)
}

function login(req, res) {
	if (req.session.key) {
		res.json({ success: false, cause: 'You\'re already logged in'})
		return;
	}
	
	// do login stuff here
	req.session.key = { username: req.body.username };
	res.json({ success: true, cause: 'todo'})
}

function logout(req, res) {
	if(req.session.key) {
		req.session.destroy(() => res.json({ success: true }))
	} else {
		res.json({ success: false, cause: 'Not logged in' })
    }
}

//     // when user login set the key to redis.
//     database.register_user(req.body, () => {
//         res.json({ success: true, });
//     }, err => {
//         res.json({ success: false, msg: err })
//     })
// };
// 	connect_to_database('users', db => {
// 		db.db('users').collection('users').find(query).toArray((err, user) => {
// 			if (err) throw err;
// 			callback(user);
// 			db.close()
// 		})
// 	});


/*app.post('/register', users.register/*)(req, res) => {
    // when user login set the key to redis.
    database.register_user(req.body, () => {
        res.json({ success: true, });
    }, err => {
        res.json({ success: false, msg: err })
    })
});*/

// app.post('/login', (req, res) => {
//     database.login_user(req.body, () => {
//         req.session.key = req.body.username;
//         res.json({ success: true, });
//     }, err => {
//         res.json({ success: false, msg: err })
//     });
// });

// app.get('/logout',(req,res) => {
//     req.session.destroy(err => {
//         if(err){
//             console.log(err);
//         } else {
//             res.redirect('/');
//         }
//     });
// });

