

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