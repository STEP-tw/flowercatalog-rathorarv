let fs = require('fs');
const http = require('http');

const WebApp = require('./webapp');
const lib = require('./serverLib.js');

let app = WebApp.create();
app.use(lib.logRequest);
app.use(lib.loadUser);
app.use(lib.redirectLoggedInUserToHome);
app.use(lib.redirectLoggedOutUserToLogin);
app.postprocess(lib.serveFile);

app.post('/login',lib.loginHandler);
app.get('/logout',lib.logoutHandler);
app.post('/commentHandler',lib.commentHandler);
app.get('/guestPage.html',lib.guestPageHandler);

const PORT = 5000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
