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
turnOn = () => {
  magicblue.turnOn()
},
turnOff = () => {
  magicblue.turnOff()
},
disconnect = () => {
  magicblue.disconnect()
},
connect = () =>{
  console.log('connect')
  document.querySelector('.connect-button').click()
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

document.querySelector('.mic-button').addEventListener('click', ()=>{
  if(event.currentTarget.classList.contains('selected')){
      event.currentTarget.classList.remove('selected')
      annyang.abort();
    console.log('voice assistant stopped')
  }else{
      event.currentTarget.classList.add('selected')
    	annyang.start({
        continuous: true
      });
      console.log('voice assistant started')
  }
});

// Voice commands
annyang.addCommands({
	'red': red,
	'green': green,
	'blue': blue,
  'warm white': warmWhite,
	'turn on': turnOn,
	'turn off': turnOff,
  'disconnect':disconnect,
  'connect':connect,
  'set schedule':setSchedule,
  'remove schedule':removeSchedule
}); 
  
})()

