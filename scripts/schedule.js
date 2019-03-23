(a=>{

a.defaultDate = (increment) => {
  increment = increment || 0
  let today = new Date()
  let newDate = new Date(today);
  newDate.setHours(newDate.getHours() + increment);
  return newDate
}
let schedulePreset = {
  year:a.defaultDate(1).getFullYear(),
  month:a.defaultDate(1).getMonth(),
  day:a.defaultDate(1).getDate(),
  hr:a.defaultDate(1).getHours(),
  min:a.defaultDate(1).getMinutes(),
  repeatDays:null,
  mode:'white',
  start:0,
  end:255,
  speed:1,
  rgb:null,
  effect:null
}
a.fullSchedule = {}
a.scheduleCache = Object.assign({},schedulePreset)
a.add = true
a.reset = () => {
  a.scheduleCache = Object.assign({},schedulePreset)
  a.updateGraph() 
  a.updateLinear()
  a.updateEditor()
}

a.updateEditor = () => {
  a.timePicker.setDate(a.scheduleCache.hr+':'+a.scheduleCache.min)  
  if (a.scheduleCache.repeatDays === null){
    document.querySelector('container>div.timer .repeat p').innerHTML = 'Never'
    document.querySelectorAll('container>div.repeat li.selected').forEach(e=>{e.classList.remove('selected')})
  }else{
    a.scheduleCache.repeatDays.forEach(e=>{
      document.querySelector('.'+e).classList.add('selected')
    })
    let truncateDays = () => {
      let newArray = []
      a.scheduleCache.repeatDays.forEach(e=>{
        newArray.push(e.substring(0,3))
      })
      return newArray
    }
    let repeat = (a.scheduleCache.repeatDays.length === 7) ? 'Everyday'
                   : (a.scheduleCache.repeatDays.length === 5 && ['monday','tuesday','wednesday','thursday','friday'].every(elem => a.scheduleCache.repeatDays.indexOf(elem) > -1)) ? 'Every Weekday' : truncateDays().join(' ')
    document.querySelector('container>div.timer .repeat p').innerHTML = repeat    
  }
  document.querySelector('container>div.actions li.'+a.scheduleCache.mode).classList.add('selected')
  
  if(a.scheduleCache.mode === 'white'){
    let state = (a.scheduleCache.start < a.scheduleCache.end) ? 'Turn On' : 'Turn Off'
    document.querySelector('container>div.timer .actions p').innerHTML = state+': '+Math.round(a.scheduleCache.start/255 * 100)+'% → '+Math.round(a.scheduleCache.end/255 * 100)+'%, '+a.scheduleCache.speed+'m'
  }else if(a.scheduleCache.mode === 'rgb'){
    document.querySelector('container>div.timer .actions p').innerHTML = 'RGB('+a.scheduleCache.rgb.join(',')+')<div class="circle" style="background-color:rgb('+'RGB('+a.scheduleCache.rgb.join(',')+')"></div>'
  }else if (a.scheduleCache.mode === 'effect'){
    
    let effect = a.scheduleCache.effect
    var effectClone = document.querySelector('.effect container.schedule div.'+effect).cloneNode(true);
    effectClone.classList.add('circle')
    let textNode = document.createTextNode(effect.replace(/_/g, " "))
    document.querySelector('container>div.timer .actions p').innerHTML = ''
    document.querySelector('container>div.timer .actions p').append(textNode,effectClone)
    
  }
}
a.updateGraph = () => {
  graph.speed = (schedule.scheduleCache.speed !== null) ? schedule.scheduleCache.speed : 1
  graph.start = (schedule.scheduleCache.start !== null) ? schedule.scheduleCache.start : 0
  graph.end = (schedule.scheduleCache.end !== null) ? schedule.scheduleCache.end : 255
  graph.points = [[0,graph.start],[graph.speed,graph.end]]
  graph.generatePoints(graph.points)
  console.log('updateGraph')
}
a.updateLinear = () => {
  linear.red = (schedule.scheduleCache.rgb !== null) ? schedule.scheduleCache.rgb[0] : 127
  linear.green = (schedule.scheduleCache.rgb !== null) ? schedule.scheduleCache.rgb[1] : 127
  linear.blue = (schedule.scheduleCache.rgb !== null) ? schedule.scheduleCache.rgb[2] : 127
  linear.updateGraph()
}

  
let deleteSchedule = () => {
  let deviceName = event.currentTarget.getAttribute('device')
 a.fullSchedule[deviceName].splice(event.currentTarget.getAttribute('schedulenum'),1) 
  magicblue.setSchedule(a.fullSchedule[deviceName],deviceName)
  magicblue.request('schedule')
}
let editSchedule = () => {
  a.add = false
  if(event.target.classList.contains('material-icons')){
    console.log('toggle')
  }else{
    goForward('.scheduleList','.timer')
    let deviceName = event.currentTarget.getAttribute('device')
    let order = event.currentTarget.getAttribute('schedulenum')
    let scheduleInstance = a.fullSchedule[deviceName][order]
    a.scheduleCache = Object.assign({},scheduleInstance)
    console.log(a.scheduleCache)
    document.querySelector('.timer .title .name').innerHTML = 'Edit Schedule'
    document.querySelector('.timer .title .save').setAttribute('device',deviceName)
    document.querySelector('.timer .title .save').setAttribute('schedulenum',order)
    a.updateEditor()
  }
},
addSchedule = () => {
  a.add = true
  goForward('.scheduleList','.timer')
  let deviceName = event.currentTarget.getAttribute('device')
  document.querySelector('.save').setAttribute('device',deviceName)
  a.reset()
}
saveSchedule = () => {
  let deviceName = event.currentTarget.getAttribute('device')
  let order = event.currentTarget.getAttribute('schedulenum')
  if (a.fullSchedule[deviceName] === undefined){
    a.fullSchedule[deviceName] = []
  }
  if(a.add === true){
    if (a.fullSchedule[deviceName] === undefined){
      a.fullSchedule[deviceName][0](a.scheduleCache)
    }else{
      a.fullSchedule[deviceName].push(a.scheduleCache)
    }
  }else{
    a.fullSchedule[deviceName][order] = Object.assign({},a.scheduleCache)
  }
  magicblue.setSchedule(a.fullSchedule[deviceName],deviceName)
  magicblue.request('schedule')
  goBack('.timer','.scheduleList')
},
goForward = (current,future) => {
  document.querySelector(current).classList.remove('selected')
  document.querySelector(current).classList.add('back')
  document.querySelector(future).classList.add('selected')
},
goBack = (current,past) => {
  document.querySelector(past).classList.add('selected')
  document.querySelector(past).classList.remove('back')
  document.querySelector(current).classList.remove('selected')
},
toggleRepeat = () => {
  event.currentTarget.classList.toggle('selected')
  let days = []
  document.querySelectorAll('container>div.repeat li.selected').forEach(e=>{
    days.push(e.getAttribute('value'))
  })
  if (days.length > 0){
    let truncateDays = () => {
      let newArray = []
      days.forEach(e=>{
        newArray.push(e.substring(0,3))
      })
      return newArray
    }
    let repeat = (days.length === 7) ? 'Everyday'
                   : (days.length === 5 && ['monday','tuesday','wednesday','thursday','friday'].every(elem => days.indexOf(elem) > -1)) ? 'Every Weekday' : truncateDays().join(' ')
    document.querySelector('container>div.timer .repeat p').innerHTML = repeat
    a.scheduleCache.repeatDays = days
    
  }else{
    document.querySelector('container>div.timer .repeat p').innerHTML = 'Never'
    a.scheduleCache.repeatDays = null
  }
},
saveEffect = (type) => {
  document.querySelectorAll('container>div.actions li').forEach(e=>{e.classList.remove('selected')})
  if (type === 'white'){
    a.scheduleCache.mode = 'white'
    a.scheduleCache.start = graph.start
    a.scheduleCache.end = graph.end
    a.scheduleCache.speed = graph.speed
    a.scheduleCache.rgb = null
    a.scheduleCache.effect = null
    
    let state = (a.scheduleCache.start < a.scheduleCache.end) ? 'Turn On' : 'Turn Off'
    document.querySelector('container>div.timer .actions p').innerHTML = state+': '+Math.round(a.scheduleCache.start/255 * 100)+'% → '+Math.round(a.scheduleCache.end/255 * 100)+'%, '+a.scheduleCache.speed+'m'
    a.scheduleCache.mode = 'white'
    document.querySelector('container>div.actions li.'+a.scheduleCache.mode).classList.add('selected')
    document.querySelectorAll('.effect container.schedule div').forEach(e=>{e.classList.remove('selected')})  
  }else if (type === 'rgb'){
    let rgb = [linear.red,linear.green,linear.blue]
    let rgbString = rgb.join(',')
    a.scheduleCache.mode = 'rgb'
    a.scheduleCache.rgb = rgb
    a.scheduleCache.start = null
    a.scheduleCache.end = null
    a.scheduleCache.speed = null
    a.scheduleCache.effect = null
    
    document.querySelector('container>div.actions li.'+a.scheduleCache.mode).classList.add('selected')
    document.querySelector('container>div.timer .actions p').innerHTML = 'RGB('+rgbString+')<div class="circle" style="background-color:rgb('+rgbString+')"></div>'
    
  }else if (type === 'effect'){
    let effect = document.querySelector('.effect container.schedule div.selected').classList[0].replace(/_/g, " ")
    var effectClone = document.querySelector('.effect container.schedule div.selected').cloneNode(true);
    effectClone.classList.add('circle')
    let textNode = document.createTextNode(effect)

    a.scheduleCache.start = null
    a.scheduleCache.end = null
    a.scheduleCache.speed = 1
    a.scheduleCache.mode = 'effect'
    a.scheduleCache.rgb = null
    a.scheduleCache.effect = document.querySelector('.effect container.schedule div.selected').classList[0]
    
    document.querySelector('container>div.actions li.'+a.scheduleCache.mode).classList.add('selected')
    document.querySelector('container>div.timer .actions p').innerHTML = ''
    document.querySelector('container>div.timer .actions p').append(textNode,effectClone)
    
  }
}

a.updateList = () => {
  a.fullSchedule = Object.assign({},magicblue.schedule)
  document.querySelector('.schedule container>div.scheduleList').innerHTML = ''
  Object.keys(magicblue.schedule).forEach((e,i)=>{
    let deviceName = e
    let title = document.createElement('div')
    let deviceContainer = document.createElement('div')
    let deviceTitle = document.createElement('label')
    let addButton = document.createElement('i')
    let deleteButton = document.createElement('p')
    let scheduleContainer = document.createElement('ul')
    magicblue.schedule[e].forEach((e,i)=>{

      let time = (e.hr > 12) ? e.hr-12+':'+e.min.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+' <span>PM</span>'
        : (e.hr === 12) ? e.hr+':'+e.min.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+' <span>PM</span>' 
        : e.hr+':'+e.min.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+' <span>AM</span>' 
      let truncateDays = () => {
        newArray = []
        e.repeatDays.forEach(e=>{
          newArray.push(e.substring(0,3))
        })
        return newArray
      }
      let repeat
      if (e.repeat === true){
        repeat = (e.repeatDays.length === 7) ? 'Everyday, '
                   : (e.repeatDays.length === 5 && ['monday','tuesday','wednesday','thursday','friday'].every(elem => e.repeatDays.indexOf(elem) > -1)) ? 'Every Weekday, ' : 'Every '+truncateDays().join(' ')+', '
      }else{
        repeat = ''
      }
      let mode = e.mode
      let effect = (mode === 'white' && e.start<e.end) ? 'Turn On: '+Math.floor(e.start/255*100)+'% → '+Math.floor(e.end/255*100)+'%'  
                  : (mode === 'white' && e.start>e.end) ? 'Turn Off: '+Math.floor(e.start/255*100)+'% → '+Math.floor(e.end/255*100)+'%'  
                  : (mode === 'rgb') ? 'RGB('+e.rgb.join(', ')+')'
                  : (mode === 'effect') ? e.effect.replace(/_/g, " ")
                  : ''
      let action = '<p>'+repeat+'<span>'+effect+'</span></p>'
      let toggle = document.createElement('i')
      let scheduleItem = document.createElement('li')
      let timeAndEffect = document.createElement('div')
      let timeItem = document.createElement('h4')
      let effectItem = document.createElement('div')
      let today = new Date()
      
      toggle.classList.add('material-icons','toggle')
      toggle.setAttribute('schedulenum',i)
      toggle.setAttribute('device',deviceName)
      toggle.innerHTML = 'remove_circle'
      if(e.repeat === false && today > e.dateTime){
        scheduleItem.classList.add('off')
      }else{
        scheduleItem.classList.remove('off')
      }
      
      timeItem.innerHTML = time
      effectItem.innerHTML = action
      timeAndEffect.append(timeItem,effectItem)
      scheduleItem.append(timeAndEffect,toggle)
      scheduleItem.setAttribute('device',deviceName)
      scheduleItem.setAttribute('schedulenum',i)
      scheduleContainer.appendChild(scheduleItem)
      
      toggle.addEventListener('click',deleteSchedule)
      scheduleItem.addEventListener('click',editSchedule)
    })
    deviceContainer.classList.add(deviceName, 'deviceContainer')
    deviceTitle.innerHTML = deviceName
    addButton.classList.add('material-icons','add')
    addButton.innerHTML = 'add'
    addButton.setAttribute('device',deviceName)
    addButton.addEventListener('click',addSchedule)
    deleteButton.classList.add('delete')
    deleteButton.innerHTML = 'Edit'
    deleteButton.setAttribute('device',deviceName)
    deleteButton.addEventListener('click',()=>{
      document.querySelector('.deviceContainer.'+event.currentTarget.getAttribute('device')).classList.toggle('delete')
    })
    title.classList.add('title')
    title.append(deleteButton,deviceTitle,addButton)

    deviceContainer.append(title,scheduleContainer)
    document.querySelector('.schedule container>div.scheduleList').appendChild(deviceContainer)
  })  
}

a.timePicker = flatpickr(".picker", {
  altInput: true,
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  inline: true,
  minuteIncrement:1,
  onChange: function(selectedDates, dateStr, instance) {
    let date = new Date(selectedDates)
    let today = new Date()
    if(today > date){
      a.scheduleCache.day = today.getDate() + 1
      console.log(a.scheduleCache.day)
    }else{
      a.scheduleCache.day = today.getDate()
    }
    a.scheduleCache.hr = date.getHours()
    a.scheduleCache.min = date.getMinutes()
  }
});
  
//Click Events  
document.querySelector('button.schedule').addEventListener('click',()=>{
  let container = document.querySelector('.schedule container')
  document.querySelector('button.schedule').parentNode.classList.toggle("selected")
  document.querySelector('.cover').classList.toggle("selected")
  if(container.classList.contains('hide')){
    container.classList.remove('hide')
    document.querySelector('button.schedule i').innerHTML = 'close'
    
  }else{
    container.classList.add('hide')
    document.querySelector('button.schedule i').innerHTML = 'alarm'
  }
})
document.querySelector('.cover').addEventListener('click',()=>{
  document.querySelectorAll('.cover, nav .buttons>.effect.selected, nav .schedule.selected').forEach(e=>{e.classList.remove('selected')})
  document.querySelectorAll('.buttons>.effect container,.schedule>container').forEach(e=>{e.classList.add("hide")})
  document.querySelector('button.schedule i').innerHTML = 'alarm'
  document.querySelector('.effect button i').innerHTML = 'blur_on'
  if(event.currentTarget.classList.contains('initial')){
    document.querySelector('#cover').classList.add('hide')
    document.querySelectorAll('.bluetooth, .info').forEach(e=>{e.classList.add("appear")})
    event.currentTarget.classList.remove('initial')  
  }
})
document.querySelector('div.timer .title .cancel').addEventListener('click',()=>{goBack('.timer','.scheduleList')})
document.querySelector('.timer li.repeat').addEventListener('click',()=>{goForward('.timer','container>div.repeat')})
document.querySelector('div.repeat .title .material-icons').addEventListener('click',()=>{goBack('container>div.repeat','.timer')})
document.querySelectorAll('div.repeat li').forEach(e=>{e.addEventListener('click',toggleRepeat)})
document.querySelector('.timer li.actions').addEventListener('click',()=>{goForward('.timer','container>div.actions')})
document.querySelector('div.actions .title .material-icons').addEventListener('click',()=>{
  goBack('container>div.actions','.timer')
  a.updateGraph()
  a.updateLinear()
})
document.querySelector('.actions li.white').addEventListener('click',()=>{
  a.updateGraph()
  goForward('container>div.actions','container>div.white')
})
document.querySelector('div.white .title .material-icons').addEventListener('click',()=>{goBack('container>div.white','container>div.actions')})
document.querySelector('div.white .title .save').addEventListener('click',()=>{
  saveEffect('white')
  goBack('container>div.white','container>div.timer')
  let actionPage = document.querySelector('container>div.actions')
  actionPage.style.opacity = 0
  actionPage.classList.remove('back')
  setTimeout(function(){ actionPage.style.opacity = '' }, 500);
})
document.querySelector('.actions li.effect').addEventListener('click',()=>{goForward('container>div.actions','container>div.effect')})
document.querySelector('div.effect .title .material-icons').addEventListener('click',()=>{goBack('container>div.effect','container>div.actions')})
document.querySelector('div.effect .title .save').addEventListener('click',()=>{
  saveEffect('effect')
  goBack('container>div.effect','container>div.timer')
  let actionPage = document.querySelector('container>div.actions')
  actionPage.style.opacity = 0
  actionPage.classList.remove('back')
  setTimeout(function(){ actionPage.style.opacity = '' }, 500);
})
document.querySelector('.actions li.rgb').addEventListener('click',()=>{
  a.updateLinear();
  goForward('container>div.actions','container>div.rgb')
})
document.querySelector('div.rgb .title .material-icons').addEventListener('click',()=>{goBack('container>div.rgb','container>div.actions')})
document.querySelector('div.rgb .title .save').addEventListener('click',()=>{
  saveEffect('rgb')
  goBack('container>div.rgb','container>div.timer')
  let actionPage = document.querySelector('container>div.actions')
  actionPage.style.opacity = 0
  actionPage.classList.remove('back')
  setTimeout(function(){ actionPage.style.opacity = '' }, 500);
})

document.querySelector('.timer .save').addEventListener('click',saveSchedule)
  

})(window.schedule = window.schedule || {})
