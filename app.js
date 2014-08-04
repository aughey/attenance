var _ = require('./public/underscore-min')
var express = require('express');
var app = express();

// Configure the express server to serve files out of the public directory.
app.use("/", express.static(__dirname + '/public'));


app.get('/classs', function(req, res) {
    res.send(JSON.stringify({
        classs: classes
    }));
});

app.get('/students', function(req, res) {
    res.send(JSON.stringify({
        students: students
    }));
});

app.get('/classs/:id', function(req, res) {
    var c = _.find(classes, function(c) {
        return c.id == req.params.id;
    });
    c = {
        class: c
    };
    console.log(c);
    res.send(JSON.stringify(c));
});

app.get('/students/:id', function(req, res) {
    var c = _.find(students, function(c) {
        return c.id == req.params.id;
    });
    c = {
        student: c
    };
    console.log(c);
    res.send(JSON.stringify(c));
});

app.get('/get', function(req, res) {
    var name = req.query['collection']
    collection(name, function(col) {
        var q = req.query['q'];
        if (q) {
            q = JSON.parse(q);
        } else {
            q = {}
        }
        var q2 = req.query['q2'];
        if (q2) {
            q2 = JSON.parse(q2);
        } else {
            q2 = {}
        }
        doc = col.find(q, q2, {
            'limit': 10000
        }); // ,{'limit' : 10000})
        if (!doc) {
            res.send(JSON.stringify({
                error: "Failed to execute query"
            }))
            return;
        }
        if (req.query['sort']) {
            doc.sort(JSON.parse(req.query['sort']));
        }
        doc.toArray(function(err, doc) {
            var out;
            if (req.query['pretty']) {
                out = "<pre>" + JSON.stringify({
                    records: doc
                }, null, 3) + "</pre>"
            } else {
                out = JSON.stringify({
                    records: doc
                });
            }
            res.send(out)
        })
    })
})

app.post("/delete", function(req, res) {
    var update = req.body
    var id = update['id'];
    var name = update['collection'];
    collection(name, function(col) {
        col.remove({
            _id: mid(id)
        }, function(err, r) {
            res.send("ok");
        });
    });
})

app.post('/update', function(req, res) {
    var toreturn = [];

    var update = req.body;
    var name = update['collection']
    var index = 0;
    console.log(update['q'])
    console.log(update['update'])
    collection(name, function(col) {
        col.update(
            JSON.parse(update['q']),
            JSON.parse(update['update']),
            update['options'],

            function(err, doc) {
                toreturn[index] = {
                    err: err,
                    doc: doc
                }
                res.send(JSON.stringify(toreturn));
            })
    })
});

var http = require('http');
var webserver = http.createServer(app);
var socketio = require('socket.io').listen(webserver, {
    log: false
});

socketio.on('connection', function(socket) {
    console.log("SocketIO Connection");

    socket.on('disconnect', function() {
        console.log("Disconnected from socket.io");
    })
});

webserver.listen(8888, function() {
    console.log("Server listening on port 8888")
})

var classes = [{
    id: 1,
    name: "Server Monday Morning 7am"
}, {
    id: 2,
    name: "Monday Evening 6pm"
}, {
    id: 3,
    name: "Tuesday Morning 7am"
}, {
    id: 4,
    name: "Tuesday Evening 6pm"
}, {
    id: 5,
    name: "Wednesday Evening Kids 5pm"
}, {
    id: 6,
    name: "Wednesday Evening 6pm"
}];

var students = [{
    id: 1,
    name: "Server John Aughey",
    rank: "2nd Kyu",
    email: 'jha@aughey.com',
    phone: '314-610-8764',
    foobar: new Date,
}, {
    id: 2,
    name: "John Feaster",
    rank: "2nd Kyu",
    email: 'jfeaster93@yahoo.com',
    phone: '314-555-5555'
}, {
    id: 3,
    name: "Dan Woods",
    rank: "2nd Dan",
    email: 'danwoods.gm@gmail.com',
    phone: '314-555-5555'
}];