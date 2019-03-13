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
const toggleClass = ()=> {
  event.currentTarget.classList.toggle('selected');
},
 mouseCapture = (e) => {
  translateEye(e.pageX,e.pageY)
},
hoverInEye = () => {
if(event.currentTarget.classList.contains('selected')){
  document.querySelectorAll('#eye-bottom,#eye-top,#pupil-top,#pupil-bottom').forEach((e,i)=>{
    e.setAttribute('d','m10,0q130,220 260,0')
  })
  document.querySelector('#cursor .radialValue').innerHTML = 'OFF'
}else{
  document.querySelector('#cursor .radialValue').innerHTML = 'ON'
}
document.querySelector('#cursor').classList.add('hover')  
},
hoverOutEye = () => {
  document.querySelectorAll('#eye-bottom,#eye-top,#pupil-top,#pupil-bottom').forEach((e,i)=>{e.setAttribute('d','m0,0q140,170 280,0')})
  document.querySelector('#cursor .radialValue').innerHTML = ''
  document.querySelector('#cursor').classList.remove('hover')

}
document.addEventListener('mousemove',mouseCapture)
document.querySelector('#eye').addEventListener('mouseover', hoverInEye);
document.querySelector('#eye').addEventListener('mouseleave', hoverOutEye);
})()
