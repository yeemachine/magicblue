let scheduleList = [
  {
    hr:19,
    min:23,
    repeatDays:['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
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
// magicblue.reconnect = true

Object.keys(magicblue.dict.presetList).forEach((e,i)=>{
  let node = document.createElement("option")
  node.value = e
  node.innerHTML = e.replace(/_/g," ")
  node.classList.add(e)
  document.querySelector('.effect select').appendChild(node)
})

document.querySelector('.effect select').addEventListener('change',()=>{
  magicblue.setEffect(event.target.value)
  document.querySelector('.effect').classList.add('selected');
  document.querySelectorAll('.warmWhite, .rgb').forEach((e)=>{e.classList.remove('selected');})

})

let loadingAnimation

magicblue.on('connecting', (device) => {
  console.log('Connecting to '+device);
  let count = 0;
  loadingAnimation = setInterval(()=>{
    count++;
    document.querySelector('.devices label').innerHTML = 'Connecting' + new Array(count % 10).join('.');
  }, 500);
});

magicblue.on('connected', (device) => {
  console.log(device + ' is connected.');
  magicblue.request('status,schedule',device) //get Status/Scedule of Bulb
  clearInterval(loadingAnimation)
  document.querySelector('.devices').innerHTML = '<label>Connected</label>'+Object.keys(magicblue.devices).join(', ')
  
  if (Object.keys(magicblue.devices).length === 1){
	document.querySelector('container').classList.remove('hidden');
	document.querySelector('.mic-button').classList.remove('hidden');
	document.querySelector('.power-button').classList.remove('hidden'); 
  }
});

magicblue.on('disconnected', function (e) {
  console.log(e.device+' is '+e.state+'.');
  console.log(magicblue.devices)
  
  if (Object.keys(magicblue.devices).length === 0){
    document.querySelector('container').classList.add('hidden');
    document.querySelector('.mic-button').classList.add('hidden');
    document.querySelector('.power-button').classList.add('hidden'); 
    document.querySelector('.devices').innerHTML = '<label>Bluetooth</label>Connect any Magic Blue Bluetooth Light Bulb'
  }else{
    document.querySelector('.devices').innerHTML = '<label>Connected</label>'+Object.keys(magicblue.devices).join(', ')
  }
});

magicblue.on('receiveNotif', function (e) {
  let deviceName = e.device
  let notifType = e.type
  let notifObj = magicblue[notifType][deviceName]
  // console.log(notifObj);
  if(notifType === 'status'){
    if (Object.keys(magicblue.devices).length === 1){
      if(magicblue.status[deviceName].mode === 'rgb'){
        let rgb = magicblue.status[deviceName].rgb.join(',')
        document.querySelector('.power-button').style.backgroundColor = 'rgb('+rgb+')'
        document.querySelector('.rgb span').innerHTML = rgb
        document.querySelector('.rgb').classList.add('selected');
      }
      if(magicblue.status[deviceName].mode === 'brightness'){
        let brightness = magicblue.status[deviceName].brightness
        document.querySelector('.power-button').style.backgroundColor = 'rgb('+[brightness,brightness,brightness].join(',')+')'
        document.querySelector('.warmWhite span').innerHTML = brightness
        document.querySelector('.warmWhite').classList.add('selected');
      }
      if(magicblue.status[deviceName].mode === 'effect'){
        let effect = magicblue.status[deviceName].effect
        console.log(effect)
        document.querySelector('.effect').classList.add('selected');
        document.querySelector('option.'+effect).selected = true
        console.log(document.querySelector('option.'+effect))
      }
      if(magicblue.status[deviceName].on === true){
        document.querySelector('.power-button').classList.add('selected');
        document.querySelector('.power-button i').innerHTML = 'lightbulb'
      }
    }
  }else if(notifType === 'schedule'){

    magicblue.schedule[deviceName].forEach((e,i)=>{
 
      let mode = e.mode
      let repeat = e.repeat
      
      let string = 'Schedule '+(i+1)+': '+deviceName
      if(mode === 'brightness'){
        if(e.start<e.end){
           string = string+' will turn on in '+e.speed+' minute/s'
          //Quick Fix. Bulb doesn't give brightness value when you schedule it to turn on.
          if(magicblue.status[deviceName].mode === 'sunrise'){
            let brightness = e.end
            document.querySelector('.power-button').style.backgroundColor = 'rgb('+[brightness,brightness,brightness].join(',')+')'
            document.querySelector('.warmWhite span').innerHTML = brightness
            document.querySelector('.warmWhite').classList.add('selected');
          }  
        }else{
           string = string+' will turn off in '+e.speed+' minute/s'
        }
      }else if(mode === 'rgb'){
        string = string+' will be set to RGB('+e.rgb.join(', ')+')'
      }else if(mode === 'effect'){
        string = string + ' will be set to Preset('+e.effect+')'
      }
      if(repeat === true){
        string = string + ' every '+e.repeatDays.join(', ')
      }else{
        string = string + ' on '+e.month+'.'+e.day+'.'+e.year
      }
      string = string + ' at '+e.hr+':'+(e.min).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+'.'

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

document.querySelectorAll('.power-button, .effect select').forEach((e)=>{
  e.addEventListener('click', toggleClick);
})



const setRGB = () => {
  let text = event.currentTarget.innerText.trim()
  var color = 'rgb('+text+')';
  let matchColors = /([R][G][B][A]?[(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{1})|(1\.0)|(1)))?[)])/i
  if (matchColors.test(color) === true){
    magicblue.setRGB(text)
    document.querySelector('.rgb').classList.add('selected');
    document.querySelectorAll('.warmWhite, .effect').forEach((e)=>{e.classList.remove('selected');})
    document.querySelector('.power-button i').innerHTML = 'lightbulb'
    document.querySelector('.power-button').style.backgroundColor = 'rgb('+text+')'
  }
}
document.querySelector('.rgb span').addEventListener('keyup',setRGB)

const setWarmWhite = () => {
  let text = event.currentTarget.innerText.trim()
  let matchNumber = /([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])/
  if (matchNumber.test(text) === true){
    magicblue.setWarmWhite(text)
    document.querySelector('.warmWhite').classList.add('selected');
    document.querySelectorAll('.rgb, .effect').forEach((e)=>{e.classList.remove('selected');})
    document.querySelector('.power-button i').innerHTML = 'lightbulb'
    document.querySelector('.power-button').style.backgroundColor = 'rgb('+[text,text,text].join(',')+')'
  }
}
document.querySelector('.warmWhite span').addEventListener('keyup',setWarmWhite)


const red = () => {
  magicblue.setRGB('255,0,0')
},
green = () => {
  magicblue.setRGB('0,255,0')
},
blue = () => {
  magicblue.setRGB('0,0,255')
},
warmWhite = () => {
  magicblue.setWarmWhite()
},
turnOn = () => {
  magicblue.turnOn()
},
turnOff = () => {
  magicblue.turnOff()
},
disconnect = () => {
  magicblue.disconnect()
}

function listen() {
	annyang.start({
		continuous: true
	});
}
// Voice commands
annyang.addCommands({
	'red': red,
	'green': green,
	'blue': blue,
  'warm white :intensity': warmWhite,
  'white': warmWhite,
	'turn on': turnOn,
	'turn off': turnOff,
  'disconnect':disconnect
});