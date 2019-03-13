(()=>{
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
  magicblue.setWhite(255)
},
birthday = () => {
  magicblue.setWhite(200) 
  setTimeout(function(){
    magicblue.setRGB('255,0,0') 
  }, 500);
  setTimeout(function(){
    magicblue.setRGB('0,255,0')  
  }, 1000);
   setTimeout(function(){
    magicblue.setRGB('0,0,255')  
  }, 1500);
   setTimeout(function(){
    magicblue.setWhite(255) 
  }, 2000);
}
turnOn = () => {
  magicblue.turnOn()
},
turnOff = () => {
  magicblue.turnOff()
},
disconnect = () => {
  magicblue.disconnect()
},
setSchedule = () => {
  magicblue.setSchedule([
  {
    hr:18,
    min:23,
    repeatDays:['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
    mode:'white',
    start:0,
    end:255,
    speed:1
  }
])
},
removeSchedule = () => {
  magicblue.setSchedule([])
},
listen = () => {
	annyang.start({
		continuous: true
	});
}

document.querySelector('.mic-button').addEventListener('click', listen);

// Voice commands
annyang.addCommands({
	'red': red,
	'green': green,
	'blue': blue,
  'happy birthday': birthday,
  'warm white :intensity': warmWhite,
  'white': warmWhite,
	'turn on': turnOn,
	'turn off': turnOff,
  'disconnect':disconnect,
  'set schedule':setSchedule,
  'remove schedule':removeSchedule
}); 
  
})()

