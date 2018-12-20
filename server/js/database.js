const PORT = 27017,
      BASE_URL = `mongodb://localhost:${PORT}/`;

var MongoClient = require('mongodb').MongoClient;

function connect_to_database (database, callback) {
	MongoClient.connect(BASE_URL + database, { useNewUrlParser : true}, (err, db) => {
		if (err)
			throw err
		else
			callback(db);
	})
}

function filter_fields(json) {
	var result = {};
	for (var i = 1; i < arguments.length; i++) {
		var field = arguments[i];

		if (!(result[field] = json[field]))
			return [false, `missing field '${field}'`];
	}
	return [true, result]
}

function login_user(user, cb_ok, cb_err) {
    [ok, filtered] = filter_fields(user, 'username', 'password');
    if(!ok)
    	return cb_err(filtered);
    cb_ok('<logged in but not actually cause i havent done that yet>');
}

function register_user(user, cb_ok, cb_err) {
    [ok, filtered] = filter_fields(user, 'username', 'password', 'email');
    if(!ok)
    	return cb_err(filtered);
    add_user(filtered, cb_ok);
}


function add_user(user, callback) {
	connect_to_database('users', db => {
		// TODO: figure otu a way to disallow adding with the same username / email
		db.db('users').collection('users').insertOne(user, (err, result) => {
			if (err)
				throw err;
			console.log(`Added user: ${user.username} (${JSON.stringify(user)})`);
			db.close();
			callback(result);
		})
	})
}

function get_user(username, callback) {
	var query = { username: username };
	connect_to_database('users', db => {
		db.db('users').collection('users').find(query).toArray((err, user) => {
			if (err) throw err;
			callback(user);
			db.close()
		})
	});
}

function del_user(username, callback) {
	// TODO: authenticate this
	var query = { username: username }
	connect_to_database('users', db => {
		db.db('users').collection('users').deleteOne(query, (err, obj) => {
			if (err)
				throw err;
			console.log('Deleted: ' + username);
			console.log(obj.result.n + ' document(s) deleted');
			callback(obj);
			db.close();
		});
	})
}


module.exports = {
	login_user: login_user,
	register_user: register_user
}
