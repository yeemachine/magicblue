let scheduleList = [
  {
    hr:19,
    min:23,
    repeatDays:['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
    mode:'white',
    start:0,
    end:255,
    speed:1
  }
]
let v1_scheduleList = [
  {
    hr:19,
    min:23,
    repeatDays:['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
    mode:'effect',
    effect:'turnOn'
  }
]

magicblue.init('.connect-button')
magicblue.DEBUG = true
// magicblue.reconnect = true

const hideAll = () => {
  document.querySelectorAll('section,.power-button').forEach((e)=>{e.classList.add('hide');})
  document.querySelector('.devices').innerHTML = '<label>Bluetooth</label><div>Connect any Magic Blue Bluetooth Light Bulb</div>'
},
showAll = () => {
  document.querySelectorAll('section,.power-button').forEach((e)=>{e.classList.remove('hide');})
  displayDevices()
},
displayDevices = () => {
  let container = document.querySelector('.devices')
  container.innerHTML = '<label>Connected</label>'
  let deviceArray = Object.keys(magicblue.devices)
  let deviceContainer = document.createElement('div')
  deviceArray.forEach((e,i)=>{
    let object = document.createElement('div')
    object.innerHTML = e
    object.addEventListener('click', deviceSelect);
    if(magicblue.devices[e].selected === true){
      object.classList.add('selected')
    }
    deviceContainer.appendChild(object)
    if((i+1)<deviceArray.length){
      let object = document.createElement('div')
      object.classList.add('divider')
      object.innerHTML = ','
      deviceContainer.appendChild(object)
    }
  })
  container.appendChild(deviceContainer)
},
deviceSelect = () => {
  let deviceName = event.currentTarget.innerHTML
  if(magicblue.devices[deviceName].selected === true){
    event.currentTarget.classList.remove('selected')
    magicblue.devices[deviceName].selected = false
  }else{
    event.currentTarget.classList.add('selected')
    magicblue.devices[deviceName].selected = true
  }
  if(allSelected().length > 0){
    document.querySelectorAll('section').forEach((e)=>{e.classList.remove('hide');})
    updateStatus(allSelected()[0])
    document.querySelector('.schedule').innerHTML = '<label>Schedule</label>'
    allSelected().forEach((e,i)=>{
      updateSchedule(e)
    })
  }else{
    document.querySelectorAll('section').forEach((e)=>{e.classList.add('hide');})
  }
},
updateStatus = (deviceName) => {
  if(magicblue.status[deviceName].on === true){
      document.querySelector('.power-button').classList.add('selected');
      document.querySelector('.power-button i').innerHTML = 'lightbulb'
  }  
  if(magicblue.status[deviceName].mode === 'rgb'){
    let rgb = magicblue.status[deviceName].rgb.join(',')
    magicblue.devices[deviceName].rgb = magicblue.status[deviceName].rgb.slice(0)
    document.querySelector('.power-button').style.backgroundColor = 'rgb('+rgb+')'
    document.querySelector('.rgb').classList.add('selected');
    document.querySelectorAll('.warmWhite, .effect').forEach((e)=>{e.classList.remove('selected');})
    document.querySelector('#redSlider').value = magicblue.status[deviceName].rgb[0]
    document.querySelector('#greenSlider').value = magicblue.status[deviceName].rgb[1]
    document.querySelector('#blueSlider').value = magicblue.status[deviceName].rgb[2]
  }
  if(magicblue.status[deviceName].mode === 'white'){
    let white = magicblue.status[deviceName].white
    magicblue.devices[deviceName].white = white
    let alpha = white/255
    document.querySelector('.power-button').style.backgroundColor = 'rgba(255,215,0,'+alpha+')'
    document.querySelector('.warmWhite').classList.add('selected');
    document.querySelectorAll('.rgb, .effect').forEach((e)=>{e.classList.remove('selected');})
    document.querySelector('#whiteSlider').value = white
  }
  if(magicblue.status[deviceName].mode === 'effect'){
    let effect = magicblue.status[deviceName].effect
    document.querySelector('.effect').classList.add('selected');
    document.querySelectorAll('.warmWhite, .rgb').forEach((e)=>{e.classList.remove('selected');})
    document.querySelector('option.'+effect).selected = true
  }
},
updateSchedule = (deviceName) => {
    let container = document.createElement("ol")
      container.classList.add(deviceName);
    magicblue.schedule[deviceName].forEach((e,i)=>{
      let mode = e.mode
      let repeat = e.repeat
      
      let string = deviceName
      if(mode === 'white'){
        if(e.start<e.end){
           string = string+' will turn on'
          //Quick Fix. Bulb doesn't give white value when you schedule it to turn on.
          if(magicblue.status[deviceName].mode === 'sunrise'){
            let white = e.end
            let alpha = white/255
            document.querySelector('.power-button').style.backgroundColor = 'rgba(255,215,0,'+alpha+')'
            document.querySelector('.warmWhite').classList.add('selected');
            document.querySelector('#whiteSlider').value = white
          }  
        }else{
           string = string+' will turn off'
        }
      }else if(mode === 'rgb'){
        string = string+' will be set to RGB('+e.rgb.join(', ')+')'
      }else if(mode === 'effect'){
        string = string + ' will be set to Preset('+e.effect+')'
      }else if(mode === 'turnOn'){
        string = string + " will be set to Version 1's Preset(turnOn)"
      }
      else if(mode === 'turnOff'){
        string = string + " will be set to Version 1's Preset(turnOn)"
      }
      if(repeat === true){
        let weekdays = ['monday','tuesday','wednesday','thursday','friday']
        let day
        if(e.repeatDays.length === 7){
          day = ' every day'
        }else if(e.repeatDays.length === 5 && e.repeatDays.every(elem => weekdays.indexOf(elem) > -1)){
          day = ' weekdays'
        }else{
          day = ' every <span>'+e.repeatDays.join(', ')+'</span>'
        }
        string = string + day + ' at '+e.dateTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })+'.'
      }else{
        string = string + ' on '+e.dateTime.toString()
      }
      container.insertAdjacentHTML( 'beforeend', '<li class="'+deviceName+'">'+string+'</li>' );
    })  
    document.querySelector('.schedule').classList.add('selected');
    document.querySelector('.schedule').appendChild(container)
},
toggleClick = () => {
  let deviceNames = (allSelected() .length > 0) ? allSelected() : Object.keys(magicblue.devices)
  magicblue.turnOnOff(deviceNames)
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
},
allSelected = () => {
  let devices = []
  Object.keys(magicblue.devices).forEach((e,i)=>{
    if(magicblue.devices[e].selected === true){
      devices.push(e)
    }
  })
  return devices
},
setRGB = () => {
  let a = document.querySelector('#dimmer').value/100,
      r = document.querySelector('#redSlider').value,
      g = document.querySelector('#greenSlider').value,
      b = document.querySelector('#blueSlider').value,
      dr = Math.round(r*a),
      dg = Math.round(g*a),
      db = Math.round(b*a),
      deviceNames = (allSelected().length > 0) ? allSelected() : Object.keys(magicblue.devices)
  deviceNames.forEach((e,i)=>{
    magicblue.devices[e].rgb = [r,g,b]
  })
  
  magicblue.setRGB([dr,dg,db].join(','),deviceNames)  
  document.querySelector('.power-button').style.backgroundColor = 'rgb('+[dr,dg,db].join(',')+')'
  document.querySelectorAll('.rgb, .power-button').forEach((e)=>{e.classList.add('selected')});
  document.querySelectorAll('.warmWhite, .effect').forEach((e)=>{e.classList.remove('selected');})
  document.querySelector('.power-button i').innerHTML = 'lightbulb'
},
setWhite = () => {
  document.querySelectorAll('.warmWhite, .power-button').forEach((e)=>{e.classList.add('selected')});
  document.querySelectorAll('.rgb, .effect').forEach((e)=>{e.classList.remove('selected');})
  document.querySelector('.power-button i').innerHTML = 'lightbulb'
  let a = document.querySelector('#dimmer').value/100,
      intensity = event.target.value,
      alpha = intensity/255 * a,
      deviceNames = (allSelected() .length > 0) ? allSelected() : Object.keys(magicblue.devices)
  deviceNames.forEach((e,i)=>{
    magicblue.devices[e].white = intensity
  })
  document.querySelector('.power-button').style.backgroundColor = 'rgba(255,215,0,'+alpha+')'
  magicblue.setWhite(Math.round(intensity*a), deviceNames)
},
setEffect = () => {
  let deviceNames = (allSelected() .length > 0) ? allSelected() : Object.keys(magicblue.devices)
  magicblue.setEffect(event.target.value, 1, deviceNames)
  document.querySelector('.power-button i').innerHTML = 'lightbulb'
  document.querySelectorAll('.effect, .power-button').forEach((e)=>{e.classList.add('selected')});
  document.querySelectorAll('.warmWhite, .rgb').forEach((e)=>{e.classList.remove('selected');})
},
dimmer = () => {
  let a = event.target.value/100
  let deviceNames = (allSelected() .length > 0) ? allSelected() : Object.keys(magicblue.devices)
  deviceNames.forEach((e,i)=>{
    if(magicblue.status[e].mode === 'white'){
      let intensity = Math.round(magicblue.devices[e].white * a)
      console.log(intensity)
      magicblue.setWhite(intensity, e)
    }
    if(magicblue.status[e].mode === 'rgb'){
      let r = magicblue.devices[e].rgb[0] * a,
          g = magicblue.devices[e].rgb[1] * a,
          b = magicblue.devices[e].rgb[2] * a
      console.log(r)
      magicblue.setRGB([r,g,b].join(','),e)
    }
  })
}

let loadingAnimation
//Connecting Device
magicblue.on('connecting', (deviceName) => {
  console.log('Connecting to '+deviceName);
  document.querySelector('.connect-button i').innerHTML = 'bluetooth_searching'
  let count = 0;
  loadingAnimation = setInterval(() => {
    count++;
    document.querySelector('.devices label').innerHTML = 'Connecting' + new Array(count % 10).join('.');
  }, 500);
});
//Device Connected
magicblue.on('connected', (deviceName) => {
  console.log(deviceName + ' is connected.');
  magicblue.devices[deviceName].selected = true
  document.querySelector('.connect-button i').innerHTML = 'bluetooth_connected'
  magicblue.request('status,schedule',deviceName)
  clearInterval(loadingAnimation)
  showAll()
});
//Device Disconnected
magicblue.on('disconnected', function (e) {
  console.log(e+' is disconnected.');
  if(!Object.keys(magicblue.devices).length){
    hideAll()
    document.querySelector('.connect-button i').innerHTML = 'bluetooth'
  }else{
    displayDevices()
  }
  let deviceClass = document.getElementsByClassName(e);
  while(deviceClass[0]) {
      deviceClass[0].parentNode.removeChild(deviceClass[0]);
  }
});
//Receive Notification from Device
magicblue.on('receiveNotif', function (e) {
  let deviceName = e.device,
  notifType = e.type,
  notifObj = magicblue[notifType][deviceName]
  if(Object.keys(magicblue.devices).length === 1){
    if(notifType === 'status'){
      updateStatus(deviceName)
    }
  }
  if(notifType === 'schedule'){
      updateSchedule(deviceName)
  }
});

//toggle on/off
document.querySelectorAll('.power-button').forEach((e)=>{
  e.addEventListener('click', toggleClick);
})
//set white
document.querySelectorAll('.rgb input').forEach((e)=>{
  e.addEventListener('input', setRGB);
})
//set white
document.querySelector('.warmWhite input').addEventListener('input',setWhite)
//set dimmer
document.querySelector('.dimmer input').addEventListener('input',dimmer)
//create effect list dropdown
Object.keys(magicblue.dict.presetList).forEach((e,i)=>{
  let node = document.createElement("option")
  node.value = e
  node.innerHTML = e.replace(/_/g," ")
  node.classList.add(e)
  document.querySelector('.effect select').appendChild(node)
})
//set effect
document.querySelector('.effect select').addEventListener('input',setEffect)




