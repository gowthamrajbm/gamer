const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const bodyParser = require("body-parser");
const Data = require("./data");
const lorem = require("lorem-ipsum");
const formidable = require("formidable");
var multer = require("multer");

var port = process.env.PORT || 3000,
  http = require("http"),
  fs = require("fs");

var log = function(entry) {
  fs.appendFileSync(
    "/tmp/sample-app.log",
    new Date().toISOString() + " - " + entry + "\n"
  );
};

const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute =
  "mongodb+srv://gowthamraj:support@123@cluster0-flcd7.mongodb.net/MongoTest?retryWrites=true";

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(
    "<ul>" +
      "<li><a href='/api/getData'>Get Data</a></li>" +
      "<li><a href='/api/putData'>Add Data</a></li>" +
      "<li><a href='/api/showForm'>Form</a></li>" +
      "</ul>"
  );
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(__dirname);
    cb(null, __dirname);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".")[1]
    );
  }
});
var upload = multer({ storage: storage }).array("mfile", 2);

router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    var result = "<ul>";
    result += data.map(msg => {
      return (
        "<li>" +
        '<a href="/api/getData/' +
        msg.id +
        '"> ' +
        msg.id +
        " </a> - " +
        msg["message"] +
        '<a href="/api/updateData?id=' +
        msg.id +
        '"> Update </a>' +
        '<a href="/api/deleteData?id=' +
        msg.id +
        '"> Delete </a>' +
        "</li>"
      );
    });
    result += "</ul>";
    res.send(result);
  });
});

router.get("/getData/:id", (req, res) => {
  const id = req.params.id;
  Data.findOne({ id: id }, (err, data) => {
    res.json(data);
  });
});
// this is our update method
// this method overwrites existing data in our database
router.get("/updateData", (req, res) => {
  var randMessage = lorem.loremIpsum();
  const id = req.query.id,
    update = { $set: { message: randMessage } };
  Data.findOneAndUpdate(
    { id: id },
    update,
    { returnNewDocument: true },
    (err, doc) => {
      if (err) res.json({ success: false, error: err });
      console.log(doc);
      res.json({ success: true });
    }
  );
});

router.get("/putData", (req, res) => {
  let data = new Data();
  var randId = Math.floor(Math.random() * 10000);
  var randMessage = lorem.loremIpsum();
  const { id, message } = { id: randId, message: randMessage }; //req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true });
  });
});

router.get("/deleteData", (req, res) => {
  const id = req.query.id;
  Data.findOneAndDelete({ id: id }, err => {
    if (err) return res.send(err);
    res.json({ success: true });
  });
});

router.get("/showForm", (req, res) => {
  res.send(
    "<style>input{margin:10px}</style><form style='display:flex;flex-flow:column;width:400px' action='/api/handleForm' method='post' enctype='multipart/form-data'>" +
      "<input type='text' placeholder='file-name' name='fname' />" +
      "<input type='text' placeholder='tags' name='tags' />" +
      "<input type='file' name='mfile'  />" +
      "<input type='submit' value='submit'  />" +
      "</form>"
  );
});

router.post("/handleForm", (req, res) => {
  upload(req, res, function(err) {
    //console.log(req.body);
    //console.log(req.files);
    if (err) {
      console.log(err);
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
});

app.use("/api", router);
// launch our backend into a port
app.listen(port);
