(()=>{
const red = (value) => {
  let rgb = isNaN(value) ? '255,0,0': value+',0,0'
  magicblue.setRGB(rgb)
},
green = (value) => {
   let rgb = isNaN(value) ? '0,255,0': '0,'+value+',0'
  magicblue.setRGB(rgb)
},
blue = (value) => {
  let rgb = isNaN(value) ? '0,0,255' : '0,0,'+value
  magicblue.setRGB(rgb)
},
warmWhite = (value) => {
  console.log(value)
  let intensity = isNaN(value) ? 255 : value
  magicblue.setWhite(intensity)
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
	'red *value': red,
	'green *value': green,
	'blue *value': blue,
  'white *value': warmWhite,
	'turn on': turnOn,
	'turn off': turnOff,
  'disconnect':disconnect,
  'connect':connect,
  'set schedule':setSchedule,
  'remove schedule':removeSchedule
}); 
  
})()

