const setAttributes = (e, attrs) => {
    Object.keys(attrs).forEach(key => e.setAttribute(key, attrs[key]));
}

let effect = [
  {name:'seven_color',
   colors:['rgb(45,152,255)','rgb(45,255,87)','rgb(255,48,31)'],
   bg:'rgba(25,0,0,0)'
  },
  {name:'red',
   color:'rgb(255,48,31)',
   bg:'rgba(25,0,0,0)'
  },
  {name:'green',
   color:'rgb(45,255,87)',
   bg:'rgba(25,0,0,0)'
  },
  {name:'blue',
   color:'rgb(45,152,255)',
   bg:'rgba(25,0,0,0)'
  },
  {name:'yellow',
   color:'rgb(255,245,0)',
   bg:'rgba(25,0,0,0)'
  },
  {name:'cyan',
   color:'rgb(0,245,255)',
   bg:'rgba(25,0,0,0)'
  },
  {name:'purple',
   color:'rgb(245,0,255)',
   bg:'rgba(25,0,0,0)'
  },
  {name:'white',
   color:'rgb(255,255,255)',
   bg:'rgba(25,0,0,0)'
  }
]

let cursorEffect = () => {
  let effectName = event.currentTarget.classList[0].replace(/_/g, " ")
  let toolTip = document.createElement('div')
  toolTip.classList.add('toolTip')
  let effectText = document.createElement('p')
  effectText.classList.add('effect')
  effectText.innerHTML = effectName
  toolTip.appendChild(effectText)
  cursor.add(toolTip)
}
let selectEffect = () => {
  document.querySelectorAll('.effect container div').forEach(e=>{e.classList.remove('selected')})
  event.currentTarget.classList.add('selected')
}
let addSVG = (svgContainer) => {
    document.querySelectorAll('.effect container').forEach(e=>{
    let svgClone = svgContainer.cloneNode(true)
    svgClone.addEventListener('click', selectEffect);
    if(e.classList.contains('schedule')){
    }else{
      svgClone.addEventListener('click', setEffect);
    }
    svgClone.addEventListener('mouseover', cursorEffect)
    svgClone.addEventListener('mouseout',()=>{cursor.clear()})
    e.appendChild(svgClone)
  })
}

effect.forEach((e,i)=>{
  const svgWidth = 200,
  generateGrad = (() => {
    let svgContainer = document.createElement('div'),
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs'),
    grad = document.createElementNS("http://www.w3.org/2000/svg", 'radialGradient'),
    circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
    svgContainer.style.order = i
    setAttributes(svg,{
      'xmlns':'http://www.w3.org/2000/svg',
      'width':'100%',
      'height':'100%',
      'viewBox':'0 0 '+svgWidth+' '+svgWidth
    })
    setAttributes(grad,{
      'id':'grad_'+e.name,
      'cx':'50%',
      'cy':'50%',
      'r':'30%'      
    })
    setAttributes(circle,{
      'fill':'url(#grad_'+e.name+')',
      'cx':svgWidth/2,
      'cy':svgWidth/2,
      'r':svgWidth/2
    })
    if(e.name === 'seven_color'){
      svgContainer.classList.add('seven_color_cross_fade')
      let stop1 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop2 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop3 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop4 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop5 = document.createElementNS("http://www.w3.org/2000/svg", 'stop')
      setAttributes(stop1,{
        'offset':'0%',
        'style':'stop-color:'+e.colors[0]+';stop-opacity:1',
      })
      setAttributes(stop2,{
        'offset':'21%',
        'style':'stop-color:'+e.colors[0]+';stop-opacity:1',
      })
      setAttributes(stop3,{
        'offset':'30%',
        'style':'stop-color:'+e.colors[1]+';stop-opacity:1',
      })
      setAttributes(stop4,{
        'offset':'60%',
        'style':'stop-color:'+e.colors[2]+';stop-opacity:1',
      })
      setAttributes(stop5,{
        'offset':'100%',
        'style':'stop-color:'+e.bg+';stop-opacity:1',
      })
      grad.appendChild(stop1)
      grad.appendChild(stop2)
      grad.appendChild(stop3)
      grad.appendChild(stop4)
      grad.appendChild(stop5)
    }else{
      svgContainer.classList.add(e.name+'_gradual_change')
      let stop1 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop2 = document.createElementNS("http://www.w3.org/2000/svg", 'stop')
      setAttributes(stop1,{
        'offset':'0%',
        'style':'stop-color:'+e.color+';stop-opacity:1',
      })
      setAttributes(stop2,{
        'offset':'100%',
        'style':'stop-color:'+e.bg+';stop-opacity:1',
      })
      grad.appendChild(stop1)
      grad.appendChild(stop2)
    }
    defs.appendChild(grad)
    svg.appendChild(defs)
    svg.appendChild(circle)
    svgContainer.appendChild(svg)
    svgContainer.addEventListener('click', setEffect);
    svgContainer.addEventListener('mouseover', cursorEffect)
    svgContainer.addEventListener('mouseout',()=>{})
    addSVG(svgContainer)
  })(),
  generateStrobe = (() => {
    let svgContainer = document.createElement('div'),
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs'),
    grad = document.createElementNS("http://www.w3.org/2000/svg", 'linearGradient'),
    circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
    svgContainer.style.order = i + effect.length
    setAttributes(svg,{
      'xmlns':'http://www.w3.org/2000/svg',
      'width':'100%',
      'height':'100%',
      'viewBox':'0 0 '+svgWidth+' '+svgWidth
    })
    setAttributes(grad,{
      'id':'strobe_'+e.name,
      'x1':'0%',
      'y1':'100%',
      'x2':'100%',
      'y2':'0%'
    })
    setAttributes(circle,{
      'fill':'url(#strobe_'+e.name+')',
      'cx':svgWidth/2,
      'cy':svgWidth/2,
      'r':svgWidth/2
    })
    if(e.name === 'seven_color'){
      svgContainer.classList.add('seven_color_jumping_change')
      let stop1 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop2 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop3 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop4 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop5 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop6 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop7 = document.createElementNS("http://www.w3.org/2000/svg", 'stop')
      setAttributes(stop1,{
        'offset':'0%',
        'style':'stop-color:'+e.bg+';stop-opacity:1',
      })
      setAttributes(stop2,{
        'offset':'35%',
        'style':'stop-color:'+e.colors[0]+';stop-opacity:1',
      })
      setAttributes(stop3,{
        'offset':'45%',
        'style':'stop-color:'+e.bg+';stop-opacity:1',
      })
      setAttributes(stop4,{
        'offset':'50%',
        'style':'stop-color:'+e.colors[1]+';stop-opacity:1',
      })
      setAttributes(stop5,{
        'offset':'60%',
        'style':'stop-color:'+e.bg+';stop-opacity:1',
      })
      setAttributes(stop6,{
        'offset':'65%',
        'style':'stop-color:'+e.colors[2]+';stop-opacity:1',
      })
      setAttributes(stop7,{
        'offset':'100%',
        'style':'stop-color:'+e.bg+';stop-opacity:1',
      })
      grad.appendChild(stop1)
      grad.appendChild(stop2)
      grad.appendChild(stop3)
      grad.appendChild(stop4) 
      grad.appendChild(stop5) 
      grad.appendChild(stop6) 
      grad.appendChild(stop7) 
    }else{
      svgContainer.classList.add(e.name+'_strobe_flash')
      let stop1 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop2 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop3 = document.createElementNS("http://www.w3.org/2000/svg", 'stop'),
      stop4 = document.createElementNS("http://www.w3.org/2000/svg", 'stop')
      setAttributes(stop1,{
        'offset':'0%',
        'style':'stop-color:'+e.bg+';stop-opacity:1',
      })
      setAttributes(stop2,{
        'offset':'45%',
        'style':'stop-color:'+e.bg+';stop-opacity:1',
      })
      setAttributes(stop3,{
        'offset':'48%',
        'style':'stop-color:'+e.color+';stop-opacity:1',
      })
      setAttributes(stop4,{
        'offset':'100%',
        'style':'stop-color:'+e.bg+';stop-opacity:1',
      })
      grad.appendChild(stop1)
      grad.appendChild(stop2)
      grad.appendChild(stop3)
      grad.appendChild(stop4)
    }
    defs.appendChild(grad)
    svg.appendChild(defs)
    svg.appendChild(circle)
    svgContainer.appendChild(svg)
    addSVG(svgContainer)
  })()
})

//toggle hide effect
document.querySelector('.effect button').addEventListener('click', ()=>{
  let buttonHTML = (document.querySelector('.effect container').classList.contains('hide')) ? 'close' : 'blur_on'
  document.querySelector('.effect button').parentNode.classList.toggle("selected")
  document.querySelector('.cover').classList.toggle("selected")
  document.querySelector('.effect container').classList.toggle("hide")
  document.querySelector('.effect button i').innerHTML = buttonHTML
});

