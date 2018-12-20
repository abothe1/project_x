const PORT = 27017,
      BASE_URL = `mongodb://localhost:${PORT}/`;

var MongoClient = require('mongodb').MongoClient;

function connect_to_db(database, callback) {
	MongoClient.connect(BASE_URL + database, { useNewUrlParser: true }, (err, db) => {
		if (err)
			throw err
		var dbobj = db.db(database);
		callback(dbobj);
		db.close();
	});
}

function add_user(user, cb) {
	// it is the job of the function that calls this to make sure all the fields are correct
	connect_to_db('users', dbobj => {
		dbobj.collection('users').insertOne(user, (err, res) => {
			if (err) throw err;
			console.log('created new user: ' + JSON.stringify(user));
			cb({ success: true });
		});
	});
}

function login_user(user, cb) {
	// it is the job of the function that calls this to make sure all the fields are correct
	connect_to_db('users', dbobj => {
		query = { username: user['username'], password: user['password']};
		dbobj.collection('users').findOne(query, (err, res) => {
			if (err) throw err;
			console.log(`lol: ${require('util').inspect(res)}`);
			console.log('user logged in: ' + JSON.stringify(user));
			cb({ success: true });
		});
	});
}


module.exports = {
	add_user: add_user,
	login_user: login_user
}


// MongoClient.connect(BASE_URL, { useNewUrlParser: true }, (err, db) => {
// 	if (err) throw err;
// 	var dbo = db.db("mydb");

// 	// insert one thing into the database
// 	var myobj = { name: "Company 2 Inc", address: "Highway 37" };
// 	dbo.collection("customers").insertOne(myobj, (err, res) => {
// 		if (err) throw err;
// 		console.log("1 document inserted");
// 		db.close();
// 	})

// 	// basic find
// 	var query = { address: /^/ };
// 	dbo.collection("customers").find(query).toArray((err, result) => {
// 		if (err) throw err;
// 		console.log(result);
// 		db.close();
// 	});

// 	// basic delete
// 	var query = { address: /^H/ };
// 	dbo.collection("customers").deleteMany(query, (err, obj) => {
// 		if (err) throw err;
// 		console.log(obj.result.n + " document(s) deleted");
// 		db.close();
// 	});
// });