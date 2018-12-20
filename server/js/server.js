// Require the functionality we need to use:
const redis_ =  require('./redis');
return;
console.log('b');

const http = require('http'),
      url = require('url'),
      path = require('path'),
      mime = require('mime'),
      fs = require('fs'),
      socketio = require('socket.io'),
      database = require('./database'),
      redis =  require('./redis');

const SOCKET = 3456;
const ROOT_DIRECTORY = path.join(__dirname, "../webpages");

var app = http.createServer((req, resp) => {
	var reqfile = req.url;
	if (reqfile == '/') { reqfile = '/index.html'; }

	var filename = path.join(ROOT_DIRECTORY, url.parse(reqfile).pathname);

	(fs.exists || path.exists)(filename, exists => {
		if (!exists) {
			// File does not exist
			resp.writeHead(404, { "Content-Type": "text/plain" });
			resp.write("Requested file not found: " + reqfile);
			resp.end();
			return;
		}

		fs.readFile(filename, (err, data) => {
			if (err) {
				// File exists but is not readable (permissions issue?)
				resp.writeHead(500, { "Content-Type": "text/plain" });
				resp.write("Internal server error: could not read file");
				resp.end();
				return;
			}
			
			var mimetype = mime.getType(filename);
			resp.writeHead(200, { "Content-Type": mimetype });
			resp.write(data);
			resp.end();
			return;
		});
	});
});

app.listen(SOCKET);

var io = socketio.listen(app);

function check_for_fields(data, args) {
	for (var i = 0; i < args.length; i++) {
		if (!data[args[i]]) return args[i];
	}
	return false;
}

function create_user(data, cb) {
	console.log(JSON.stringify(data));
	if(missing_field = check_for_fields(data, ['username', 'password', 'email'])) {
		cb({ success: false, cause: `missing the field \`${missing_field}\`` });
	} else {
		database.add_user(data, cb);
	}
}

function login_user(data, cb) {
	if(missing_field = check_for_fields(data, ['username', 'password'])) {
		cb({ success: false, cause: `missing the field \`${missing_field}\`` });
	} else {
		database.login_user(data, cb);
	}
}


function delete_user(data, cb) {
	if(missing_field = check_for_fields(data, ['username'])) {
		cb({ success: false, cause: `missing the field \`${missing_field}\`` });
	} else {
		database.delete_user(data, cb);
	}
}

io.sockets.on("connection", socket => {
	emit = (type, func) => data => func(data, result => {
		console.log(`${type}-response: ${JSON.stringify(result)}`);
		socket.emit(type + '-response', result);
	});
	console.log("hi");

	socket.on('create-user', emit('create-user', create_user));
	socket.on('login-user', emit('login-user', login_user));
	socket.on('delete-user', emit('delete-user', delete_user));

	socket.on('message_to_server', data => {
		console.log("message: " + data["message"]);
		socket.emit("message_to_client", { message: data["message"] })
	});
});


