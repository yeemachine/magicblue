let scheduleList = [
  {
    hr:17,
    min:30,
    repeatDays:['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
    mode:'brightness',
    start:0,
    end:1,
    speed:1
  },
  {
    year:2019,
    month:12,
    day:25,
    hr:19,
    min:0,
    mode:'brightness',
    start:1,
    end:0,
    speed:1
  }
]

magicblue.init('.connect-button, .connect-another button')
// magicblue.DEBUG = true
// magicblue.reconnect = true

magicblue.on('connected', (device) => {
  console.log(device + ' is connected.');
  magicblue.request('status,schedule',device) //get Status/Scedule of Bulb

  if (Object.keys(magicblue.devices).length === 1){
  document.querySelector('.connect-button').classList.add('hidden');
	document.querySelector('.connect-another').classList.remove('hidden');
	document.querySelector('.wheel').classList.remove('hidden');
	document.querySelector('.mic-button').classList.remove('hidden');
	document.querySelector('.power-button').classList.remove('hidden'); 
  }
});

magicblue.on('disconnected', function (e) {
  console.log(e.device+' is '+e.state+'.');
  console.log(magicblue.devices)
  if (Object.keys(magicblue.devices).length === 0){
    document.querySelector('.connect-button').classList.remove('hidden');
    document.querySelector('.connect-another').classList.add('hidden');
    document.querySelector('.wheel').classList.add('hidden');
    document.querySelector('.mic-button').classList.add('hidden');
    document.querySelector('.power-button').classList.add('hidden');  
  }
});

magicblue.on('receiveNotif', function (e) {
  let deviceName = e.device
  let notifType = e.type
  let notifObj = magicblue[notifType][deviceName]
  console.log(notifObj);
});

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