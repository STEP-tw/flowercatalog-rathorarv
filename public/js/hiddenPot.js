let reload = function(){
  document.getElementById('imagToHide').style.visibility = 'visible';
}


let hide = function(){
  document.getElementById('imagToHide').style.visibility = 'hidden';
  setTimeout(reload,1000);
}

let hiddenPot = function(){
  let pot = document.getElementById('imagToHide');
  pot.onclick = hide;
}
window.onload = hiddenPot;
