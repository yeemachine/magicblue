const translateEye = (pageX,pageY) => {
  let container = document.querySelector('#mainControls')
  let offsetTop = container.getBoundingClientRect().top
  let offsetLeft = container.getBoundingClientRect().left
  let limitX = container.offsetWidth
  let limitY = container.offsetHeight
  let mouseX = (Math.min(pageX - offsetLeft, limitX) < 0) ? 0 : Math.min(pageX - offsetLeft, limitX)
  let mouseY = (Math.min(pageY - offsetTop, limitY) < 0) ? 0 : Math.min(pageY - offsetTop, limitY)
  mouseX = (mouseX - limitX/2)/(limitX/2)/2
  mouseY = (mouseY - limitY/2)/(limitY/2)/2
  let pupil = document.querySelector('#pupil-container')
  let light = document.querySelector('#pupil-light')
  pupil.setAttribute('transform','translate('+mouseX*25+','+mouseY*10+')')
  light.setAttribute('transform','translate('+mouseX*-4+','+mouseY*-4+')')
}
(()=>{
let powerCursor = (value) => {
  let toolTip = document.createElement('div')
  toolTip.classList.add('toolTip')
  let valueText = document.createElement('h2')
  valueText.innerHTML = value
  toolTip.appendChild(valueText)
  cursor.add(toolTip)
}
const mouseCapture = (e) => {
  translateEye(e.pageX,e.pageY)
},
toggleClick = () => {
  let deviceNames = (allSelected() .length > 0) ? allSelected() : Object.keys(magicblue.devices)
  magicblue.turnOnOff(deviceNames)
  if(document.querySelector('#eye').classList.contains('selected')){
    document.querySelector('#eye').classList.remove('selected')
    document.querySelectorAll('#eye-bottom,#eye-top,#pupil-top,#pupil-bottom').forEach((e,i)=>{e.setAttribute('d','m0,0q140,170 280,0')})
  }else{
    for(let deviceName of deviceNames){
      updateStatus(deviceName)
    }
    document.querySelector('#eye').classList.add('selected')
    document.querySelectorAll('#eye-bottom,#eye-top,#pupil-top,#pupil-bottom').forEach((e,i)=>{
      e.setAttribute('d','m10,0q130,220 260,0')
    })
  }
},
hoverInEye = () => {
if(document.querySelector('#eye').classList.contains('selected')){
  document.querySelectorAll('#eye-bottom,#eye-top,#pupil-top,#pupil-bottom').forEach((e,i)=>{
    e.setAttribute('d','m10,0q130,220 260,0')
  })
  powerCursor('Turn Off')
}else{
  powerCursor('Turn On')
}
},
hoverOutEye = () => {
  document.querySelectorAll('#eye-bottom,#eye-top,#pupil-top,#pupil-bottom').forEach((e,i)=>{e.setAttribute('d','m0,0q140,170 280,0')})
  cursor.clear()
}
document.addEventListener('mousemove',mouseCapture)
document.querySelector('.eyeContainer').addEventListener('mouseover', hoverInEye);
document.querySelector('.eyeContainer').addEventListener('mouseleave', hoverOutEye);
//toggle on/off
document.querySelector('.eyeContainer').addEventListener('click', toggleClick);  
  

})()


