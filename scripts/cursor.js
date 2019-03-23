
(a=>{
  
const mouseCapture = (e) => {
  document.querySelector('#cursor').classList.remove('idle')
  a.translateCursor(e.pageX,e.pageY)
},
leaveDocument = (e) => {
  if(!e.relatedTarget && !e.toElement) {
    document.querySelector('#cursor').classList.add('idle')
  }
}
document.addEventListener('mousemove', mouseCapture);
document.addEventListener('mouseout', leaveDocument);
a.translateCursor = (pageX,pageY) => {
  let cursor = document.querySelector('#cursor')
  let height = cursor.offsetHeight;
  let width = cursor.offsetWidth;
  let mouseX = pageX - width/2;
  let mouseY = pageY - height/2;
  cursor.style.top = mouseY+'px';
  cursor.style.left = mouseX+'px';
},
a.updateText = text => {
  if(text === ''){
    document.querySelector('#cursor .cursorInfo').innerHTML = ''
    document.querySelector('#cursor').classList.remove('hover') 
  }else{
    document.querySelector('#cursor .cursorInfo').innerHTML = text
    document.querySelector('#cursor').classList.add('hover')  
  }
}
a.clear = () => {
  document.querySelector('.cursorInfo').innerHTML = ''
  document.querySelector('.cursorInfo').classList.add('hide')
}
a.add = (node) => {
  document.querySelector('.cursorInfo').classList.remove('hide')
  document.querySelector('.cursorInfo').innerHTML = ''
  document.querySelector('.cursorInfo').append(node)
}

})(window.cursor = window.cursor || {})

document.querySelectorAll('button').forEach(e=>{
  e.addEventListener('mouseover',e=>{
    if(e.currentTarget.classList.contains('mic-button')){
      document.querySelector('.voice-commands').classList.remove('hide')
    }
  })
  e.addEventListener('mouseout',e=>{
    if(e.currentTarget.classList.contains('mic-button')){
      document.querySelector('.voice-commands').classList.add('hide')
    }
  })
})
