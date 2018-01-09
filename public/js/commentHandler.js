const showData = function(person){
  let comment = document.createElement('p');
  let seperator = '----------------------------------------------------<br>';
  comment.innerHTML += seperator;
  comment.innerHTML += person.date + '&nbsp&nbsp' + 'by&nbsp';
  comment.className += 'dateTable';
  comment.innerHTML += person.name + '<br><br>';
  comment.innerHTML += person.comment;
  console.log(comment);
  return comment;
};

const getInfo = function(){
  let name = document.getElementById('name').value;
  let comment = document.getElementById('comment').value;
  let callBack = function(){
    let returndata = this.responseText;
    let comment = JSON.parse(returndata);
    let feedback = document.getElementById('feedbacks');
    feedback.innerHTML =  showData(comment) + feedback.innerHTML;
  }
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load',callBack);
  xhr.open('POST','commentHandler','true');
  xhr.send(`name=${name}&comment=${comment}`);
}