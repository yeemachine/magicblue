let startRecord = {}
// let dummydata = {
//   '3-16-2019':{'LEDBlue-8B10AA3A':453,'LEDBlue-169C02D6':397}
// ,'3-17-2019':{'LEDBlue-169C02D6':677},'3-18-2019':{'LEDBlue-8B10AA3A':213},'3-19-2019':{'LEDBlue-8B10AA3A':333,'LEDBlue-169C02D6':377},'3-20-2019':{'LEDBlue-8B10AA3A':6,'LEDBlue-169C02D6':11}}
  
// window.localStorage.setItem('magicblue',JSON.stringify(dummydata))
let lightLog = (window.localStorage.getItem('magicblue') !== null) ? JSON.parse(window.localStorage.getItem('magicblue')) : {}

const dateDiffInMin = (a, b) => {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds());
  return Math.floor((utc2 - utc1)/1000*100)/100;
}

let saveLightInfo = (deviceName) => {
  let endRecord = new Date()
  let lightUsage = dateDiffInMin(startRecord[deviceName],endRecord)
  let key = (startRecord[deviceName].getMonth()+1)+'-'+startRecord[deviceName].getDate()+'-'+startRecord[deviceName].getFullYear()

  if(lightLog.hasOwnProperty(key)){
    if(lightLog[key].hasOwnProperty(deviceName)){
      lightLog[key][deviceName] += lightUsage
    }else{
      lightLog[key][deviceName] = lightUsage
    }
  }else{
    lightLog[key] = {}
    lightLog[key][deviceName] = lightUsage
  }
  window.localStorage.setItem('magicblue', JSON.stringify(lightLog));
  updateShadowEyes()
}

let updateShadowEyes = () => {
  document.querySelectorAll('#shadowEyes .selected').forEach((e,i)=>{
  if(i <= Object.keys(lightLog).length-1){
      if(!e.classList.contains('dateFilled')){
      e.classList.add('dateFilled')
      e.addEventListener('mouseover',()=>{
        let toolTip = document.createElement('div')
        toolTip.classList.add('toolTip')
        let date = Object.keys(lightLog)[Object.keys(lightLog).length-i]
        let dateText = document.createElement('p')
        dateText.classList.add('title')
        dateText.innerHTML = '<span>Light Usage on </span>'+date 
        let deviceList = document.createElement('ul')
        let devices = Object.keys(lightLog[date])
        devices.forEach((e,i)=>{
          let usage = lightLog[date][e]
          let minutes = Math.floor(usage/60)
          let seconds = usage - minutes * 60
          seconds = (seconds>0) ? ' '+seconds+'s' : ''
          minutes = (minutes>0) ? ' '+minutes+'m' : ''
          let listItem = document.createElement('li')
          listItem.innerHTML = '<span>'+e+': </span>'+minutes+seconds
          deviceList.appendChild(listItem)
          // console.log(e,minutes,seconds)
        })
        toolTip.append(dateText,deviceList)
        cursor.add(toolTip)
        
        e.querySelectorAll('path').forEach(e => {e.setAttribute('d','m10,0q130,220 260,0')})
      })
      e.addEventListener('mouseout',()=>{
        cursor.clear()
        e.querySelectorAll('path').forEach(e => {e.setAttribute('d','m0,0q140,170 280,0')})
      })
      }
  }
})
}