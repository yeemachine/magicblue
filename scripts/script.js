let scheduleList = [
  {
    hr:19,
    min:23,
    repeatDays:['monday','tuesday','wednesday','thursday','friday'],
    mode:'brightness',
    start:0,
    end:235,
    speed:1
  }
]
let scheduleList2 = [
  {
    repeatDays:['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
    hr:17,
    min:30,
    mode:'brightness',
    start:225,
    end:0,
    speed:1
  }
]

magicblue.init('.connect-button, button.connect-another')
// magicblue.DEBUG = true
magicblue.reconnect = true

const hideAll = () => {
  document.querySelector('container').classList.add('hidden');
  document.querySelector('.mic-button').classList.add('hidden');
  document.querySelector('.power-button').classList.add('hidden'); 
  document.querySelector('.devices').innerHTML = '<label>Bluetooth</label><div>Connect any Magic Blue Bluetooth Light Bulb</div>'
},
showAll = () => {
  document.querySelector('container').classList.remove('hidden');
	document.querySelector('.mic-button').classList.remove('hidden');
	document.querySelector('.power-button').classList.remove('hidden'); 
  document.querySelector('.devices').innerHTML = '<label>Connected</label><div>'+Object.keys(magicblue.devices).join(', ')+'</div>'
}

let loadingAnimation
magicblue.on('connecting', (device) => {
  console.log('Connecting to '+device);
  let count = 0;
  loadingAnimation = setInterval(() => {
    count++;
    document.querySelector('.devices label').innerHTML = 'Connecting' + new Array(count % 10).join('.');
  }, 500);
});
magicblue.on('connected', (device) => {
  console.log(device + ' is connected.');
  magicblue.request('status,schedule',device) //get Status/Scedule of Bulb
  clearInterval(loadingAnimation)
  showAll()
});
magicblue.on('disconnected', function (e) {
  console.log(e+' is disconnected.');
  document.querySelector('.devices div').innerHTML = Object.keys(magicblue.devices).join(', ')
  if(!Object.keys(magicblue.devices).length){
    hideAll()
  }
});
magicblue.on('receiveNotif', function (e) {
  let deviceName = e.device,
  notifType = e.type,
  notifObj = magicblue[notifType][deviceName]
  // console.log(notifObj);
  if(notifType === 'status'){
    if(magicblue.status[deviceName].mode === 'rgb'){
      let rgb = magicblue.status[deviceName].rgb.join(',')
      document.querySelector('.power-button').style.backgroundColor = 'rgb('+rgb+')'
      document.querySelector('.rgb').classList.add('selected');
      document.querySelectorAll('.warmWhite, .effect').forEach((e)=>{e.classList.remove('selected');})
      document.querySelector('#redSlider').value = magicblue.status[deviceName].rgb[0]
      document.querySelector('#greenSlider').value = magicblue.status[deviceName].rgb[1]
      document.querySelector('#blueSlider').value = magicblue.status[deviceName].rgb[2]
    }
    if(magicblue.status[deviceName].mode === 'brightness'){
      let brightness = magicblue.status[deviceName].brightness
      let HSLbrightness = brightness/255 * 90
      document.querySelector('.power-button').style.backgroundColor = 'hsl(49, 100%, '+HSLbrightness+'%)'
      document.querySelector('.warmWhite').classList.add('selected');
      document.querySelectorAll('.rgb, .effect').forEach((e)=>{e.classList.remove('selected');})
      document.querySelector('#whiteSlider').value = brightness
    }
    if(magicblue.status[deviceName].mode === 'effect'){
      let effect = magicblue.status[deviceName].effect
      console.log(effect)
      document.querySelector('.effect').classList.add('selected');
      document.querySelectorAll('.warmWhite, .rgb').forEach((e)=>{e.classList.remove('selected');})
      document.querySelector('option.'+effect).selected = true
      console.log(document.querySelector('option.'+effect))
    }
    if(magicblue.status[deviceName].on === true){
      document.querySelector('.power-button').classList.add('selected');
      document.querySelector('.power-button i').innerHTML = 'lightbulb'
    }  
  }else if(notifType === 'schedule'){
    let container = document.querySelector('.schedule div')
    while(container.firstChild){
    container.removeChild(container.firstChild);
    }
    magicblue.schedule[deviceName].forEach((e,i)=>{
      let mode = e.mode
      let repeat = e.repeat
      
      let string = (i+1)+') '+deviceName
      if(mode === 'brightness'){
        if(e.start<e.end){
           string = string+' will turn on'
          //Quick Fix. Bulb doesn't give brightness value when you schedule it to turn on.
          if(magicblue.status[deviceName].mode === 'sunrise'){
            let brightness = e.end
            let HSLbrightness = brightness/255 * 90
            document.querySelector('.power-button').style.backgroundColor = 'hsl(49, 100%, '+HSLbrightness+'%)'
            document.querySelector('.warmWhite').classList.add('selected');
            document.querySelector('#whiteSlider').value = brightness
          }  
        }else{
           string = string+' will turn off'
        }
      }else if(mode === 'rgb'){
        string = string+' will be set to RGB('+e.rgb.join(', ')+')'
      }else if(mode === 'effect'){
        string = string + ' will be set to Preset('+e.effect+')'
      }
      if(repeat === true){
        let weekdays = ['monday','tuesday','wednesday','thursday','friday']
        let day
        if(e.repeatDays.length === 7){
          day = ' every day'
        }else if(e.repeatDays.every(elem => weekdays.indexOf(elem) > -1)){
          day = ' weekdays'
        }else{
          day = ' every <span>'+e.repeatDays.join(', ')+'</span>'
        }
        string = string + day
      }else{
        string = string + ' on '+e.dateTime.toString()
      }
      string = string + ' at '+e.dateTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })+'.'

      document.querySelector('.schedule div').insertAdjacentHTML( 'beforeend', '<div>'+string+'</div>' );
      document.querySelector('.schedule').classList.add('selected');
    })  
  }
});
const toggleClick = () => {
  if(event.currentTarget.classList.contains('selected')){
    event.currentTarget.classList.remove('selected')
    if(event.currentTarget.classList.contains('power-button')){
      document.querySelector('.power-button i').innerHTML = 'lightbulb_outline'
    }
  }else{
    event.currentTarget.classList.add('selected')
    if(event.currentTarget.classList.contains('power-button')){
      document.querySelector('.power-button i').innerHTML = 'lightbulb'
    }
  }
}
document.querySelectorAll('.power-button').forEach((e)=>{
  e.addEventListener('click', toggleClick);
})
document.querySelectorAll('.rgb input').forEach((e)=>{
  e.addEventListener('input', ()=>{
    let r = document.querySelector('#redSlider').value
    let g = document.querySelector('#greenSlider').value
    let b = document.querySelector('#blueSlider').value
    magicblue.setRGB([r,g,b].join(','))  
    document.querySelector('.power-button').style.backgroundColor = 'rgb('+[r,g,b].join(',')+')'
    document.querySelectorAll('.rgb, .power-button').forEach((e)=>{e.classList.add('selected')});
    document.querySelectorAll('.warmWhite, .effect').forEach((e)=>{e.classList.remove('selected');})
    document.querySelector('.power-button i').innerHTML = 'lightbulb'
  });
})
document.querySelector('.warmWhite input').addEventListener('input',()=>{
  document.querySelectorAll('.warmWhite, .power-button').forEach((e)=>{e.classList.add('selected')});
  document.querySelectorAll('.rgb, .effect').forEach((e)=>{e.classList.remove('selected');})
  document.querySelector('.power-button i').innerHTML = 'lightbulb'
  let intensity = event.target.value
  let HSLintensity = intensity/255 * 90
  document.querySelector('.power-button').style.backgroundColor = 'hsl(49, 100%, '+HSLintensity+'%)'
  magicblue.setWarmWhite(intensity)
})
Object.keys(magicblue.dict.presetList).forEach((e,i)=>{
  let node = document.createElement("option")
  node.value = e
  node.innerHTML = e.replace(/_/g," ")
  node.classList.add(e)
  document.querySelector('.effect select').appendChild(node)
})
document.querySelector('.effect select').addEventListener('change',()=>{
  magicblue.setEffect(event.target.value)
  document.querySelector('.power-button i').innerHTML = 'lightbulb'
  document.querySelectorAll('.effect, .power-button').forEach((e)=>{e.classList.add('selected')});
  document.querySelectorAll('.warmWhite, .rgb').forEach((e)=>{e.classList.remove('selected');})
})




