let fs = require('fs');
const Comment = require('./comments.js');
let comments = new Comment();
comments.getallPreviousComments();

const timeStamp = require('./time.js').timeStamp;
const http = require('http');
const WebApp = require('./webapp');
let registered_users = [{userName:'bhanutv',name:'Bhanu Teja Verma'},{userName:'harshab',name:'Harsha Vardhana'}];
let toS = o=>JSON.stringify(o,null,2);

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
}

const getHeader = function (file) {
  let fileType = file.split('.')[1];
  let headers = {
    'css': 'text/css',
    'html': 'text/html',
    'js': 'text/javascript',
    'png': 'image/png',
    'gif': 'image/gif',
    'jpg': 'image/jpg',
    'pdf': 'application/pdf'
  }
  return headers[fileType];
};

const getName = function(req){
  let name = `username :<strong>${req.user.userName}</strong>`;
  return name;
}
const serveFile = function (req, res) {
  if(!req.user  && req.url == '/guestPage.html') {
    req.url = '/withoutLoginGuest.html';
  }
  let filePath = `public${req.url}`;
  if (req.method == 'GET' && fs.existsSync(filePath)) {
    res.setHeader('content-type', getHeader(filePath));
    if(req.url=='/guestPage.html') res.write(getName(req));
    res.write(fs.readFileSync(filePath));
    res.end();
  }
}

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};
let redirectLoggedInUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/','/login']) && req.user) res.redirect('/guestPage.html');
}
let redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/','/home','/logout']) && !req.user) res.redirect('/index.html');
}

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);
app.use(serveFile);

app.post('/login',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/loginPage.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/guestPage.html');
});

app.get('/logout',(req,res)=>{
  res.setHeader('set-cookie',[`sessionid=0; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`,
  `logInFailed=false; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`]);
  delete req.user.sessionid;
  res.redirect('/index.html');
});

app.post('/commentHandler',(req,res)=>{
    let nameAndComment = req.body;
    comments.addComment(nameAndComment);
    comments.writeInConfidFile();
    comments.writeInPublicFile();
    res.write(JSON.stringify(nameAndComment));
    res.end();
});

const PORT = 5000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
