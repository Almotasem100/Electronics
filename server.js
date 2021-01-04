const express = require('express');
const bodparser = require('body-parser')
const {spawn} = require('child_process');
const multer = require('multer')
// const system = require('system');
const app = express();
const http = require('http');
const port = 3000;
const fs = require('fs');
const hostname = '192.168.4.107';
const path = require('path');
app.use(bodparser.json());
decision_lst = {'Forward\r\n':0, 'Left\r\n':0, 'Right\r\n':0};
const keys = Object.keys(decision_lst);

// console.log(keys);
var End_flag = true;
decision1 = 'why';
decision2 = 'me?';
counter = 0;
counter2 = 0;
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
      cb(null,counter + file.originalname);
    }
});

const upload = multer({storage: storage});
app.get('/', (req, res)=>{
    res.statusCode=200;
    res.send("get request to the root");
    console.log("GET req");
    // var img = system.stdin.read(img_name);  
    let img = new Buffer.from(img_name, 'base64');
    fs.writeFileSync(path.join(path.dirname(require.main.filename),'uploads', counter+'photo.png'), img, err => {
      console.log('done');
    });
    python_logic('0photo.png');
    console.log('End');
    // console.log(JSON.parse(img));
    // python_logic(img);
});

function python_logic(img_name){
  var direction = 'hello world';
  console.log('in python')
  const python = spawn('python', ['detect.py', 'uploads/'+ img_name]);
  python.stdout.on('data', data =>{
    console.log(`processing image: ${img_name}`);
    direction = data.toString();
  });
  python.on('close', code =>{
    console.log(`closing script: ${code}`);
    // make_dec(direction, img_name);
    Send_direc(direction, img_name);
  });
}
function make_dec(direction, img_name){
  decision2 = direction;
  // console.log('Entering');
  // console.log('HI', direction, decision2,decision1);
  if(decision1 === decision2){
    Send_direc(decision1, img_name);
    decision1 = 'why';
    decision2 = 'me?'
    // console.log('hell');
  }
  else
    decision1 = decision2;
  counter2++;
  // console.log('BYE', direction, decision2,decision1);
  // console.log('Exitting');
}
function Send_direc(direc, img_name){
  console.log(`sending order for:  ${img_name}`);
  http.get('http://192.168.4.1/'+ direc, res =>{
    console.log(`sending to the esp module: ${direc}`);
    End_flag = true;
    res.on('direction' , direction => console.log("what is this", direction));
  });
}
// app.post('/', (req, res) =>{
//   res.statusCode = 200;
//   var img_name=req.body.encoded_String;
//   // var img_name = str.replace(/^data:image\/png;base64,/, "");
//   // console.log(image64);
//   console.log('Post req recieved');
//   console.log(img_name);
//   counter++;
//   res.status(200).end();
//   while(!End_flag);
//   python_logic(img_name);
// });


app.post('/image', (req, res) =>{
  res.statusCode = 200;
  // var img_name = counter + req.file.originalname;
  console.log('Post req recieved');
  res.status(200).end();
  // console.log(img_name);
  let data = req.body.base64;
  // let buff = new Buffer.from(data, 'base64');
  // let buff = JSON.stringify(data);
  // console.log(data);
  // console.log(buff);
  // console.log(End_flag);
  // if(End_flag){
  //   End_flag = false;
  //   // console.log(End_flag);
  counter++;
  // while(!End_flag);
  // let img = new Buffer.from(data, 'base64');
  // fs.writeFileSync('/uploads', counter +'photo.png', img);
  fs.writeFileSync(path.join(path.dirname(require.main.filename),'uploads', counter + 'photo.txt'), data);
  // }
  // if(counter === counter2){
    
  python_logic(counter + 'photo.txt');
  // }
  // for(var x=0; x<1000; x++);
  // make_dec('Forward', '31pho.png')
});

const server = http.createServer(app);
server.listen(5000, () => console.log(`server running at port: ${port}`));
// server.listen(port, hostname, () => console.log(`server running at port: ${port}`));
