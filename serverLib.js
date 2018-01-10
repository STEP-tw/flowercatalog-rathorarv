const fs = require('fs');
const libUtility = require('./libUtility.js');
const Comment = require('./comments.js');
let comments = new Comment();
comments.getallPreviousComments();
let registered_users = [{userName:'arvinds',name:'arvind singh'},{userName:'ravinder',name:'ravinder'}];

exports.logRequest = (req,res)=>{
  let text = ['----------------------------',
  `${libUtility.timeStamp()}`,
  `${req.method} ${req.url}`,
  `HEADERS=> ${libUtility.toS(req.headers)}`,
  `COOKIES=> ${libUtility.toS(req.cookies)}`,
  `BODY=> ${libUtility.toS(req.body)}`,
  ''
  ].join('\n');
  fs.appendFile('request.log',text,()=>{})
  console.log(`${req.method} ${req.url}`);
}

exports.serveFile = function (req, res) {
  let filePath = `public${req.url}`;
  if (req.method == 'GET' && fs.existsSync(filePath)) {
    res.setHeader('content-type', libUtility.getHeader(filePath));
    res.write(fs.readFileSync(filePath));
    res.end();
  }
}

exports.loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

exports.loginHandler = (req,res)=>{
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
}

exports.logoutHandler = (req,res)=>{
  res.setHeader('set-cookie',[`sessionid=0; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`,
  `logInFailed=false; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`]);
  delete req.user.sessionid;
  res.redirect('/index.html');
}

exports.commentHandler = (req,res)=>{
  if(req.body.comment=='') {
    res.end();
    return;
  }
  req.body.name = req.user.userName;
    let nameAndComment = req.body;
    comments.addComment(nameAndComment);
    comments.writeInConfidFile();
    comments.writeInPublicFile();
    res.write(JSON.stringify(nameAndComment));
    res.end();
}

exports.guestPageHandler = (req,res)=>{
  if(!req.user) {
    res.redirect('withoutLoginGuest.html');
    return;
  }
  res.setHeader('content-type', libUtility.getHeader(req.url));
  let guestPage = fs.readFileSync("./"+ req.url);
  let replacedContent = guestPage.toString().replace('username',`<strong style="font-size:20px">${req.user.userName}</strong>`);
  res.write(replacedContent);
  res.end();
}

exports.redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/','/logout']) && !req.user) res.redirect('/index.html');
}

exports.redirectLoggedInUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/','/login']) && req.user) res.redirect('/guestPage.html');
}
