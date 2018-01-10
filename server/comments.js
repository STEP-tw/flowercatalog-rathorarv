const fs = require('fs');
const Comments = function(){
    this.comments = [];
};

Comments.prototype.addComment = function(comment){
    comment.date = new Date().toLocaleString();
    this.comments.unshift(comment);
};

Comments.prototype.writeInConfidFile = function(){
    let allComments = JSON.stringify(this.comments,null,2);
    fs.writeFile('./data/data.json',allComments,'utf8',(err)=>{});
};

Comments.prototype.writeInPublicFile = function(){
    let allComments = JSON.stringify(this.comments,null,2);
    fs.writeFile('./public/js/data.js','var data ='+allComments,'utf8',(err)=>{});
};

Comments.prototype.addPreviousComment = function(allComments,self){
    let comments = JSON.parse(allComments);
    self.comments = comments;
};

Comments.prototype.getallPreviousComments = function(){
    let all = this
     fs.readFile('./data/data.json','utf8',function(err,data){
        all.addPreviousComment(data,all);
     });
};
Comments.prototype.getAllComments = function(){
  return JSON.stringify(this.comments);
};



module.exports = Comments;
