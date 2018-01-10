exports.timeStamp = ()=>{
  let t = new Date();
  return `${t.toDateString()} ${t.toLocaleTimeString()}`;
}

exports.toS = (o)=>JSON.stringify(o,null,2);

exports.getHeader = function (file) {
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
