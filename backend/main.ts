require('dotenv').config();
import express, {Response, Request} from 'express';
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const fs = require('fs');
const emailValidator = require('deep-email-validator');

// server setup
const PORT = process.env.PORT || 5000;
const server = express();
server.use(express.static('build'));  // static frontend build folder
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());


const postnr: Array<String> = [];     // list of areacodes
const post_sted: Array<String> = [];  // list of area names

//  file from https://www.bring.no/postnummerregister-ansi.txt
//  downloaded and changed encoding to utf-8 from ISO-8859-10
const data = fs.readFileSync('./Postnummerregister-ansi.txt', 'utf-8');
const lines = data.split('\n');

/**
 *  for each line put areacode and its area name in arrays @var postnr and @var post_sted
 */
lines.forEach((line: String) => {
  let split_line = line.split('\t');
  postnr.push(split_line[0]);
  post_sted.push(split_line[1]);
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

// serves inputs.tsx with input fields, react routes with react-route-dom
server.get('/', (req: Request, res: Response) => {
  try{
    res.sendFile(__dirname + '/build/index.html');
  }catch(error){
    console.log('Error while sending file\n', error);
     // status code 500 for server error
    res.status(500).send('Noe gikk galt...')
  }
    
});

/**
 *  tests for valid area code and responds with a object 
 *  the object is made up from the following:
 *    @var  is_valid  true if the areacode is valid
 *    @var  areacode  the code tested
 *    @var  area      the area name
 * 
 *  @var code areacode input from url
 */
server.get('/api/areacode/:code', (req: Request, res: Response) => {
  const {code} = req.params; // get areacode
  const index = postnr.indexOf(code)  // get index of areacode

  //  if index is -1 its not in the list
  if(code.length == 4 && index >= 0){
    //  send response
    res.status(200).send({
      is_valid: true,
      areacode: code,
      area: post_sted[postnr.indexOf(code)],
    });  
  }else{
    res.status(200).send({
       //  send response
      is_valid: false,
      areacode: code,
      area: 'ugyldig',
    });  
  }
});

// Validate email
server.get('/api/email/:email', (req: Request, res: Response) => {
  const {email} = req.params;
  
  emailValidator.validate(email).then( (data: JSON) => {
    res.status(200).send(data);
  });
});


/**
 *  recives a post request and uses the post variables to send an email
 *  @var mailOptions is the email options used in the email
 *  @var transporter is used to send the email
 */
server.post('/back', (req: Request, res: Response) => {
  // mail details
  let mailOptions = {
    from: 'beep.boop.mailbot@gmail.com',
    to:   'beep.boop.mailbot@gmail.com',
    subject: 'varsel email',
    html: ""
  };

  // add html to the email
  mailOptions.html = `
    <h1>${req.body.name} har sendt kommentar.</h1>

    <fieldset style='width:500px'>
      <legend> 
        <b> kommentar </b> 
      </legend>
      <p style='margin-left:20px;'> ${req.body.comment} </p>
    </fieldset>
    <footer>
      <p>
        <b> kontakt informasjon </b> </br>
        tlf: ${req.body.phone}       </br>
        Email: ${req.body.email}     </br>
        postnr: ${req.body.areacode} </br>
      </p>
    </footer>`;


  // send email
  transporter.sendMail(mailOptions, function(error: Error, info: any){
    if (error) {
      // status code 500 for server error
      res.status(500).send('Noe gikk galt... mail ble ikke sendt. </br> <a href="/">back</a>');

    } else {
      console.log('Email sent: ' + info.response);
      // send user to back.tsx
      res.sendFile(__dirname + '/build/index.html');
    }
  });

});

// listen on port
server.listen(PORT, () => console.log(`Server is live on port ${PORT}`));
