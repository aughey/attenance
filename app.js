var _ = require('./public/underscore-min')
var express = require('express');
var app = express();

// Configure the express server to serve files out of the public directory.
app.use("/", express.static(__dirname + '/public'));

app.get('/id', function(req, res) {
    if (require_user(req, res)) {
        return;
    }
    abstracts(function(col) {

        col.findOne({
            '_id': mid(req.query['id'] || "50b18c2679fa52622f000007")
        }, function(err, doc) {
            if (err) {
                res.send("ERROR");
            } else {
                res.send(JSON.stringify(doc))
            }
        });
    })
});

app.get('/get', function(req, res) {

    var name = req.query['collection'] || 'geotiffs'
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