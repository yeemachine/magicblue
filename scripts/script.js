

let sliderVal = {
  white:0,
  red:0,
  green:0,
  blue:0
};

magicblue.init('.connect-button')
magicblue.DEBUG = true;
let isMobileDevice = () => {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

if(isMobileDevice() === true){
  document.querySelector('nav').innerHTML = 'Sorry, this Web Bluetooth demo only works on Chrome Desktop with a compatible MagicBlue™ Bluetooth Light.'
  document.querySelector('#eye').classList.add('selected')
  document.querySelector('body').classList.add('mobile')
  document.querySelector('#cursor').classList.add('mobile')
  document.querySelector('nav').classList.add('mobile')
}

const hideAll = () => {
  updateRadial('clear')
  document.querySelectorAll('section, button, #cover').forEach((e)=>{e.classList.add('hide');})
  document.querySelector('.devices').innerHTML = '<label>Connect Light</label><h4>An experiment with Chrome Web Bluetooth</h4>'
  document.querySelector('#eye').classList.add('selected');
},
showAll = () => {
  document.querySelectorAll('section, button, #cover').forEach((e)=>{e.classList.remove('hide');})
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
    document.querySelectorAll('section, button, #cover').forEach((e)=>{e.classList.remove('hide');})
    updateStatus(allSelected()[0])
  }else{
    document.querySelectorAll('section, button, #cover').forEach((e)=>{e.classList.add('hide');})
    document.querySelector('#favicon').setAttribute('href','https://cdn.glitch.com/00fa2c64-1159-440f-ad08-4b1ef2af9d8b%2Feye_Default.png')
  }
},
updateStatus = (deviceName) => {
  if(magicblue.status[deviceName].on === true){
    document.querySelector('#eye').classList.add('selected');
  }else{
    document.querySelector('#eye').classList.remove('selected');
  }  
  if(magicblue.status[deviceName].mode === 'rgb'){
    document.querySelector('#favicon').setAttribute('href','https://cdn.glitch.com/00fa2c64-1159-440f-ad08-4b1ef2af9d8b%2Feye_RGB.png')
    magicblue.devices[deviceName].rgb = magicblue.status[deviceName].rgb.slice(0)
    let rgb = magicblue.devices[deviceName].rgb.join(',') || magicblue.status[deviceName].rgb.join(',') 
    document.querySelectorAll('.effect').forEach((e)=>{e.classList.remove('selected');})
    
    sliderVal.red = magicblue.devices[deviceName].rgb[0]
    sliderVal.green = magicblue.devices[deviceName].rgb[1]
    sliderVal.blue = magicblue.devices[deviceName].rgb[2]
    sliderVal.white = 0
    updateRadial()
    
  document.querySelector('#pupil-light').setAttribute('fill','rgb('+rgb+')')
  }
  if(magicblue.status[deviceName].mode === 'white'){
    document.querySelector('#favicon').setAttribute('href','https://cdn.glitch.com/00fa2c64-1159-440f-ad08-4b1ef2af9d8b%2Feye_White.png')
    let white = magicblue.devices[deviceName].white || magicblue.status[deviceName].white
    magicblue.devices[deviceName].white = white
    let alpha = white/255
    document.querySelectorAll('.effect').forEach((e)=>{e.classList.remove('selected');})
    
    sliderVal.red = 0
    sliderVal.green = 0
    sliderVal.blue = 0
    sliderVal.white = magicblue.devices[deviceName].white
    updateRadial()
    document.querySelector('#pupil-light').setAttribute('fill','rgb('+[255*alpha,215*alpha,0].join(',')+')')
  }
  if(magicblue.status[deviceName].mode === 'effect'){
    let effect = magicblue.status[deviceName].effect
    document.querySelectorAll('.warmWhite, .rgb').forEach((e)=>{e.classList.remove('selected');})
  }
},
updateRadial = (clear) => {
  let rings = ['white','red','green','blue']
  rings.forEach((e,i)=>{
    let ring = document.querySelector('.rings .'+e)
    let c = ring.getAttribute('circum');
    let sw = ring.getAttribute('stroke-width');
    let perc = (clear === 'clear') ? 0 : sliderVal[e]/255
    let dashLength = ((c*perc-sw)<0) ? 0 :(c*perc-sw)
    ring.setAttribute('stroke-dasharray',dashLength+' '+c)
    ring.setAttribute('value',sliderVal[e])
    ring.classList.add('animate')
    setTimeout(function(){ ring.classList.remove('animate') }, 500);
  })
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
            magicblue.devices[deviceName].white = white
            sliderVal.white = white
            updateRadial()
            document.querySelector('#favicon').setAttribute('href','https://cdn.glitch.com/00fa2c64-1159-440f-ad08-4b1ef2af9d8b%2Feye_White.png')
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
    // document.querySelector('.schedule').appendChild(container)
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
      r = sliderVal.red,
      g = sliderVal.green,
      b = sliderVal.blue,
      dr = Math.round(r*a),
      dg = Math.round(g*a),
      db = Math.round(b*a),
      deviceNames = (allSelected().length > 0) ? allSelected() : Object.keys(magicblue.devices)
  deviceNames.forEach((e,i)=>{
    magicblue.devices[e].rgb = [r,g,b]
  })
  
  magicblue.setRGB([dr,dg,db].join(','),deviceNames)  
  document.querySelector('#pupil-light').setAttribute('fill','rgb('+[dr,dg,db].join(',')+')')

  document.querySelectorAll('.rgb, #eye').forEach((e)=>{e.classList.add('selected')});
  document.querySelectorAll('.warmWhite, .effect').forEach((e)=>{e.classList.remove('selected');})
  document.querySelectorAll('.buttons>.effect container div').forEach(e=>{e.classList.remove('selected')})
},
setWhite = () => {
  document.querySelectorAll('.warmWhite, #eye').forEach((e)=>{e.classList.add('selected')});
  document.querySelectorAll('.rgb, .effect').forEach((e)=>{e.classList.remove('selected');})
  document.querySelectorAll('.buttons>.effect container div').forEach(e=>{e.classList.remove('selected')})

  let a = document.querySelector('#dimmer').value/100,
      intensity = sliderVal.white,
      alpha = intensity/255 * a,
      deviceNames = (allSelected() .length > 0) ? allSelected() : Object.keys(magicblue.devices)
  deviceNames.forEach((e,i)=>{
    magicblue.devices[e].white = intensity
  })
  document.querySelector('#pupil-light').setAttribute('fill','rgb('+[255*alpha,215*alpha,0].join(',')+')')
  magicblue.setWhite(Math.round(intensity*a), deviceNames)
},
setEffect = () => {
  let deviceNames = (allSelected() .length > 0) ? allSelected() : Object.keys(magicblue.devices)
  let effect = event.currentTarget.classList[0]
  magicblue.setEffect(effect, 1, deviceNames)
},
dimmer = () => {
  let a = event.target.value/100
  let deviceNames = (allSelected() .length > 0) ? allSelected() : Object.keys(magicblue.devices)
  deviceNames.forEach((e,i)=>{
    if(typeof magicblue.devices[e].white !== 'undefined'){
      let intensity = Math.round(magicblue.devices[e].white * a)
      magicblue.setWhite(intensity, e)
    }
    if(typeof magicblue.devices[e].rgb !== 'undefined'){
      let r = magicblue.devices[e].rgb[0] * a,
          g = magicblue.devices[e].rgb[1] * a,
          b = magicblue.devices[e].rgb[2] * a
      magicblue.setRGB([r,g,b].join(','),e)
    }
  })
}

let loadingAnimation
let numConnecting = 0
let connectingLabel = document.querySelector('.devices label')
//Connecting Device
magicblue.on('connecting', (deviceName) => {
  console.log('Connecting to '+deviceName);
  document.querySelector('.connect-button i').innerHTML = 'bluetooth_searching'
  let count = 0;
  if(numConnecting === 0){
    loadingAnimation = setInterval(() => {
      count++;
      connectingLabel.classList.add('connecting')
      connectingLabel.innerHTML = 'Connecting' + new Array(count % 5).join('.');
    }, 500);
  }
  numConnecting += 1
});
//Device Connected
magicblue.on('connected', (deviceName) => {
  console.log(deviceName + ' is connected.');
  numConnecting -= 1
  magicblue.devices[deviceName].selected = true
  magicblue.request('status,schedule',deviceName)
  if(numConnecting === 0){
    clearInterval(loadingAnimation)
    connectingLabel.innerHTML = 'bluetooth_connected'
    connectingLabel.classList.remove('connecting')
  }
  showAll()
  startRecord[deviceName] = new Date()
});
//Device Disconnected
magicblue.on('disconnected', function (e) {
  console.log(e+' is disconnected.');
  if(!Object.keys(magicblue.devices).length){
    hideAll()
    document.querySelector('.connect-button i').innerHTML = 'bluetooth'
    document.querySelector('#favicon').setAttribute('href','https://cdn.glitch.com/00fa2c64-1159-440f-ad08-4b1ef2af9d8b%2Feye_Default.png')
  }else{
    displayDevices()
  }
  let deviceClass = document.getElementsByClassName(e);
  while(deviceClass[0]) {
      deviceClass[0].parentNode.removeChild(deviceClass[0]);
  }
  saveLightInfo(e)  
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
      schedule.updateList(deviceName)
  }
});

updateShadowEyes()



