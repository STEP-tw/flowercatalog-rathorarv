let readData = function(){
  let feedbacks = document.getElementById('feedbacks');
  let block = data.map(function(data){
    return showData(data);
  });
  feedbacks.innerHTML = block.join('<br>');
}


window.onload = readData;
