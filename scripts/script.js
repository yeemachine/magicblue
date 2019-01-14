let scheduleList = [
  {
    hr:17,
    min:30,
    repeatDays:['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
    mode:'brightness',
    start:0,
    end:255,
    speed:1
  },
  {
    year:2019,
    month:12,
    day:25,
    hr:19,
    min:0,
    mode:'brightness',
    start:255,
    end:0,
    speed:1
  }
]

magicblue.init('.connect-button, button.connect-another')
// magicblue.DEBUG = true
// magicblue.reconnect = true

magicblue.on('connected', (device) => {
  console.log(device + ' is connected.');
  magicblue.request('status,schedule',device) //get Status/Scedule of Bulb

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
  console.log(notifObj);
  if (Object.keys(magicblue.devices).length === 1){
    if(magicblue.status[deviceName].mode === 'rgb'){
      let rgb = magicblue.status[deviceName].rgb.join(',')
      document.querySelector('.power-button').style.backgroundColor = 'rgb('+rgb+')'
      document.querySelector('.rgb span').innerHTML = rgb
      document.querySelector('.rgb').classList.add('selected');
    }
    if(magicblue.status[deviceName].mode === 'brightness'){
      let brightness = magicblue.status[deviceName].brightness || 0
      document.querySelector('.warmWhite span').innerHTML = brightness
      document.querySelector('.warmWhite').classList.add('selected');
    }
    if(magicblue.status[deviceName].on === true){
      document.querySelector('.power-button').classList.add('selected');
      document.querySelector('.power-button i').innerHTML = 'lightbulb'
    }
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

const setRGB = () => {
  let text = event.currentTarget.innerText.trim()
  var color = 'rgb('+text+')';
  let matchColors = /([R][G][B][A]?[(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{1})|(1\.0)|(1)))?[)])/i
  if (matchColors.test(color) === true){
    magicblue.setRGB(text)
    document.querySelector('.rgb').classList.add('selected');
    document.querySelector('.warmWhite').classList.remove('selected');
  }
}
document.querySelector('.rgb span').addEventListener('keyup',setRGB)

const setWarmWhite = () => {
  let text = event.currentTarget.innerText.trim()
  let matchNumber = /([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])/
  if (matchNumber.test(text) === true){
    magicblue.setWarmWhite(text)
    document.querySelector('.warmWhite').classList.add('selected');
    document.querySelector('.rgb').classList.remove('selected');

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