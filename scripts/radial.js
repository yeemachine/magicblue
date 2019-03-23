(()=>{
let arcs = 
  [{
  name:'white',
  mask:'wMask',
  max:6,
  cx:100,
  cy:100,
  r:100,
  sw:18,
  color:'rgb(255,215,0)'
  },
  {
  name:'red',
  mask:'rMask',
  max:6,
  cx:100,
  cy:100,
  r:80,
  sw:18,
  color:'rgb(255,48,31)'
  },
  {
  name:'green',
  mask:'gMask',
  max:6,
  cx:100,
  cy:100,
  r:60,
  sw:18,
  color:'rgb(45,255,87)'
  },
  {
  name:'blue',
  mask:'bMask',
  max:6,
  cx:100,
  cy:100,
  r:40,
  sw:18,
  color:'rgb(45,152,255)'
  }
  ]

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
},
describeArc = (x, y, radius, startAngle, endAngle,reverse) => {
    let start = polarToCartesian(x, y, radius, endAngle),
        end = polarToCartesian(x, y, radius, startAngle),
        largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    let array = (reverse === 'reverse') ? [
        "M", end.x, end.y, 
        "A", radius, radius, 1, largeArcFlag, 1, start.x, start.y
      ]
      : [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ]
    let d = array.join(" ")
    return d;       
},
findAng = (currentPos,anchor) =>{
var x = currentPos.x-anchor.cx;
var y = currentPos.y-anchor.cy;
var newAng = Math.atan2( y , x )* 180 / Math.PI;
newAng = newAng + 90 //rotate angle to fit graph
if(newAng<0){
  newAng = 360 + newAng;
}
return newAng
}      

let radialCursor = (value) => {
  let toolTip = document.createElement('div')
  toolTip.classList.add('toolTip','radial')
  let valueText = document.createElement('h2')
  valueText.innerHTML = value
  toolTip.appendChild(valueText)
  cursor.add(toolTip)
}


arcs.forEach((e)=>{
  let newMask = document.createElementNS("http://www.w3.org/2000/svg", 'mask')
  newMask.setAttribute('id',e.mask)
  newMask.setAttribute('maskUnits','userSpaceOnUse')
  for(let i = 1; i <= e.max; i++){
    let newSeg = document.createElementNS("http://www.w3.org/2000/svg", 'path')
    let length = 360/e.max
    let start = (i-1)*length
    let end = i * length
    newSeg.setAttribute("d", describeArc(e.cx, e.cy, e.r, start, end))
    newSeg.setAttribute('stroke','url(#seg'+i+')')
    newSeg.setAttribute('stroke-width',arcs[0].sw)
    newSeg.setAttribute('fill','none')
    newMask.append(newSeg)
  }
  
  document.querySelector("defs").append(newMask)
  let newGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g')
  let newCircle = document.createElementNS("http://www.w3.org/2000/svg", 'path')
  newCircle.setAttribute('class',e.name)
  let newShadow = document.createElementNS("http://www.w3.org/2000/svg", 'path')
  let newShadowG = document.createElementNS("http://www.w3.org/2000/svg", 'g')
  let c = Math.PI * e.r * 2
  newCircle.setAttribute("d", describeArc(e.cx, e.cy, e.r, 0, 359.99, 'reverse'))
  newCircle.setAttribute('stroke',e.color)
  newCircle.setAttribute('stroke-width',arcs[0].sw)
  newCircle.setAttribute('stroke-linecap','round')
  newCircle.setAttribute('fill','none')
  newCircle.setAttribute('circum',c)
  newCircle.setAttribute('stroke-dasharray',0+' '+c)
  newCircle.setAttribute('stroke-dashoffset',-arcs[0].sw/2)
  
  newShadow.setAttribute("d", describeArc(e.cx, e.cy, e.r, 0, 359.99, 'reverse'))
  newShadow.setAttribute('class',e.name)
  newShadow.setAttribute('stroke',e.color)
  newShadow.setAttribute('stroke-width',arcs[0].sw)  
  newShadow.setAttribute('mask','url(#'+e.mask+')')
  newShadow.setAttribute('fill','none')

  newGroup.append(newCircle)
  newShadowG.append(newShadow)
  document.querySelector(".rings").append(newGroup)
  document.querySelector(".shadow").append(newShadowG)
  
let drag = d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended),
    dragItem = d3.select('.shadow .'+e.name),
    oldAng = 0

dragItem.call(drag)
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut);
  
function handleMouseOver() {
  var isActive = document.getElementsByClassName('active');
  if (isActive.length === 0) {
  document.querySelectorAll('.'+e.name).forEach((j,i)=>{
    j.classList.add('hover')
    let ring = document.querySelector('.rings .'+e.name)
    let value = ring.getAttribute('value') || 0
    radialCursor(value)
  })
  }
}
function handleMouseOut() {
  var isActive = document.getElementsByClassName('active');
  if (isActive.length === 0) {
  document.querySelectorAll('.hover').forEach((e,i)=>{
    e.classList.remove('hover')
  })
  cursor.clear()
  }
}
  
function dragstarted() {
  document.querySelectorAll('.'+e.name).forEach((e,i)=>{e.classList.add('active')})
  let newAng = findAng(d3.event,e)
  let perc = newAng/360
  sliderVal[e.name] = Math.round(255 * perc)
  oldAng=newAng
  let dashLength = ((c*perc-arcs[0].sw)>0)?c*perc-arcs[0].sw:0
  let ring = document.querySelector('.rings .'+e.name)
  let value = Math.round(perc*255)
  ring.setAttribute('stroke-dasharray',dashLength+' '+c)
  ring.setAttribute('value',value)
  toggleRing(e.name)
  radialCursor(value)
}

function dragged(d) {
  translateEye(d3.event.sourceEvent.pageX,d3.event.sourceEvent.pageY)
  cursor.translateCursor(d3.event.sourceEvent.pageX,d3.event.sourceEvent.pageY)
  
  let newAng = findAng(d3.event,e)
  let perc = 0
  if(Math.abs(oldAng-newAng)>300){
  newAng = (oldAng>newAng) ? 360 : 0
  perc = newAng/360
  oldAng=newAng
  }else{
  perc = newAng/360
  oldAng=newAng  
  }
  sliderVal[e.name] = Math.round(255 * perc)
  let dashLength = ((c*perc-arcs[0].sw)>0)?c*perc-arcs[0].sw:0
  let ring = document.querySelector('.rings .'+e.name)
  let value = Math.round(perc*255)
  ring.setAttribute('stroke-dasharray',dashLength+' '+c)
  ring.setAttribute('value',value)
   if(e.name === 'white'){
    setWhite()
   }else{
    setRGB()
   }
  radialCursor(value)
}
  
function toggleRing(selected){
  let whiteSelector = document.querySelector('.rings .white')
  let rgb = ['red','green','blue']
  if(selected === 'white'){
    setWhite()
    document.querySelector('#favicon').setAttribute('href','https://cdn.glitch.com/00fa2c64-1159-440f-ad08-4b1ef2af9d8b%2Ffavicon-w-32x32.png?1550026004701')
    let rgb = ['red','green','blue']
    rgb.forEach((e,i)=>{
      let ring = document.querySelector('.rings path.'+e)
      let c = ring.getAttribute('circum')
      ring.classList.add('animate')
      ring.setAttribute('stroke-dasharray',0+' '+c)
      ring.setAttribute('value',0)
      setTimeout(function(){ ring.classList.remove('animate') }, 500);
    })
  }else{
    setRGB()
    document.querySelector('#favicon').setAttribute('href','https://cdn.glitch.com/00fa2c64-1159-440f-ad08-4b1ef2af9d8b%2Ffavicon-rgb-32x32.png?1550025990532')
    let c = whiteSelector.getAttribute('circum')
    whiteSelector.setAttribute('stroke-dasharray',0+' '+c)
    whiteSelector.setAttribute('value',0)
    whiteSelector.classList.add('animate')
    setTimeout(function(){ whiteSelector.classList.remove('animate') }, 500);
    
    let filtered = rgb.filter(item => item !== selected);
    filtered.forEach((e,i)=>{
      let ring = document.querySelector('.rings .'+e)
      let c = ring.getAttribute('circum')
      let perc = sliderVal[e]/255
      let dashLength = ((c*perc-arcs[0].sw)>0)?c*perc-arcs[0].sw:0
      ring.setAttribute('stroke-dasharray',dashLength+' '+c)
      ring.classList.add('animate')
      ring.setAttribute('value',sliderVal[e])
      setTimeout(function(){ ring.classList.remove('animate') }, 500);
    })
  }
}

function dragended(d) {
  document.querySelectorAll('.active').forEach((e,i)=>{e.classList.remove('active')})
  cursor.clear()
}
  
})
})()