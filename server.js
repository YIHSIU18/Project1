//Load required Node modules
//npm i express nodemailer body-parser multer
const express = require("express"),
      bodyParser = require("body-parser"),
      nodemailer = require("nodemailer"),
      multer = require("multer"),
      cors = require('cors'),
      path = require("path");
const cli = require("nodemon/lib/cli");
      // create reusable transporter object using the default SMTP transport
      //todo: changer SMTP!
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'lucious.thompson@ethereal.email',
            pass: '4w7eTsMYbCy9yKhf1u'
        }
    });
  

// verify connection configuration in terminal
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

//Settings
const portHTTP = 89, //set a new port due to port 88 has been used
     mailFrom = "lucious.thompson@ethereal.email",
     mailAdmin = "lucious.thompson@ethereal.email",
     mailSubject = "Reservation",
     mailTxt = "Booking request received.";
     cors({credentials: false, origin: false});

const mysql = require('mysql')
const connection = mysql.createConnection({
       host: 'localhost',
       port: 8889,
       user: 'root',
       password: 'root',
       database: 'booking_system'
     })

     connection.connect()

//Express server
const app = express();
      forms = multer();
app.use(forms.array());
//This parser accepts any Unicode encoding of the body and supports automatic inflation of gzip and deflate encodings.
app.use(bodyParser.json());
//Returns middleware that only parses {urlencoded} bodies and only looks at requests where the Content-Type header matches the type option. 
app.use(bodyParser.urlencoded({extended: true}));

//Home page - main_page
app.get("/", cors(), (req, res) =>
{
    res.sendFile(path.join(__dirname, "main_page.html"));
});

//Send booking request via email
app.post("/book", cors(), (req,res) =>
{ 
  var sql = `INSERT INTO booking
  VALUES
  (
      ?, ?, ?, ?, ?
  )`;
//connecting to sql server and geting the data base
connection.query(sql, [req.body.name , req.body.email, req.body.date, req.body.time, req.body.people], function (err, data) {
if (err) {
// some error occured
} else {
connection.query('SELECT * from reservation', (err, rows, fields) => {
    if (err) throw err
    rows.forEach(element => {
      console.log('The booking is: ', element)
    });
  })
}
});

  // MAIL MESSAGE
  let msg = mailTxt + "<br>";
  for (const [k, v] of Object.entries(req.body)) {
    msg += `${k} : ${v}<br>`;
    
  }
 
  // SEND
  transporter.sendMail({
    from: mailFrom,
    to: mailAdmin,
    subject: mailSubject,
    html: `<p>${msg}</p>`
  }, (error, info) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
}); 

//Thank you
app.get("/thankyou", cors(), (req, res) =>
{     res.sendFile(path.join(__dirname, "thank_page.html"));
});

//Start
app.listen(portHTTP);

