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

function add_user(user, callback) {
	connect_to_database('users', db => {
		// TODO: figure otu a way to disallow adding with the same username / email
		db.db('users').collection('users').insertOne(user, (err, res) => {
			if (err)
				throw err;
			console.log(`Added user: ${user.username} (${JSON.stringify(user)})`);
			db.close();
			callback(res);
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
	add_user: add_user,
	get_user: get_user,
	del_user: del_user
}
