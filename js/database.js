module.exports = {
	connect: connect,
}

const PORT = 27017,
      MONGO_URL = `mongodb://localhost:${PORT}/banda`;

var MongoClient = require('mongodb').MongoClient;

function connect (cb_ok, cb_err) {
	MongoClient.connect(MONGO_URL, { useNewUrlParser : true}, (err, db) => {
		if (err) {
			console.error(`Error occrued: ${err}`);
			cb_err('An internal error occured');
		}
		else
			cb_ok(db);
	})
}

// function connect (database, collection, cb_ok, cb_err) {
// 	connect_to_database(db => {
// 		cb_ok(db.db(database).collection(collection))
// 		db.close();
// 	}, cb_err)
// }


// function filter_fields(json) {
// 	var result = {};
// 	for (var i = 1; i < arguments.length; i++) {
// 		var field = arguments[i];

// 		if (!(result[field] = json[field]))
// 			return [false, `missing field '${field}'`];
// 	}
// 	return [true, result]
// }

// function login_user(user, cb_ok, cb_err) {
//     [ok, filtered] = filter_fields(user, 'user', 'pwd');
//     if(!ok)
//     	return cb_err(filtered);

// 	connect_to_database('users', db => {
// 		db.db('users').collection('users').find(query).toArray((err, user) => {
// 			if (err) throw err;
// 			callback(user);
// 			db.close()
// 		})
// 	});

//     if(!ok)
//     	return cb_err(filtered);
//     cb_ok('<logged in but not actually cause i havent done that yet>');

// // router.post('/login',function(req,res){
// //     handle_database(req,"login",function(response){
// //         if(response === null) {
// //             res.json({"error" : "true","message" : "Database error occured"});
// //         } else {
// //             if(!response) {
// //               res.json({
// //                              "error" : "true",
// //                              "message" : "Login failed ! Please register"
// //                            });
// //             } else {
// //                req.session.key = response;
// //                    res.json({"error" : false,"message" : "Login success."});
// //             }
// //         }
// //     });
// // });

// }

// function register_user(user, cb_ok, cb_err) {
//     [ok, user] = filter_fields(user, 'username', 'password', 'email');
//     if(!ok)
//     	return cb_err(user);

// function get_user(username, callback) {
// 	var query = { username: username };
// 	connect_to_database('users', db => {
// 		db.db('users').collection('users').find(query).toArray((err, user) => {
// 			if (err) throw err;
// 			callback(user);
// 			db.close()
// 		})
// 	});
// }

// function del_user(username, callback) {
// 	// TODO: authenticate this
// 	var query = { username: username }
// 	connect_to_database('users', db => {
// 		db.db('users').collection('users').deleteOne(query, (err, obj) => {
// 			if (err)
// 				throw err;
// 			console.log('Deleted: ' + username);
// 			console.log(obj.result.n + ' document(s) deleted');
// 			callback(obj);
// 			db.close();
// 		});
// 	})
// }


// // module.exports = {
// // 	login_user: login_user,
// // 	register_user: register_user
// // }








