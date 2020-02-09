// dependencies

var express = require("express");
var path = require("path");
var http = require("http");
var fs = require("fs");
var db = require("./db/db.json");
const uuidv4 = require("uuid/v4")

db = [];

// set up express app

var app = express();
var PORT = process.env.PORT || 3000;

// sets up express app to handle data parsing

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
    app.use(express.static("public"));


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {

    try {

        db = fs.readFileSync("./db/db.json", "utf-8");
        console.log(db)

        db = JSON.parse(db);


    }
    catch (err) {
        console.log(err);
        }

    res.json(db);

})

app.post("/api/notes", function(req, res) {

    try {
        db = fs.readFileSync("./db/db.json", "utf8");
        console.log(db);

        db = JSON.parse(db);
        
        uniqueId = uuidv4();
        req.body.id = uniqueId;
        db.push(req.body);
        db = JSON.stringify(db);

        fs.writeFile("./db/db.json", db, "utf8", function(err) {
            if (err) throw err;
        });

        res.json(JSON.parse(db));

    }

    catch (err) {
        throw err;
    }
});



app.delete("/api/notes/:id", function(req, res) {
    try {
        db = fs.readFileSync("./db/db.json", "utf8");
        db = JSON.parse(db);
        db = db.filter(function(note) {
            return note.id != req.params.id;
        });
        db = JSON.stringify(db);
        fs.writeFile("./db/db.json", db, "utf8", function(err) {
            if(err) throw err;
        });
        res.send(JSON.parse(db));
        
    } catch (err) {
        throw err;
    }


});



app.listen(PORT, function() {

console.log("Server listening on: http://localhost:" + PORT);

});