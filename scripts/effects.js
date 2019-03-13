const setAttributes = (e, attrs) => {
    Object.keys(attrs).forEach(key => e.setAttribute(key, attrs[key]));
}
let effects = [
  {name:'seven_color',
   colors:['rgb(45,152,255)','rgb(45,255,87)','rgb(255,48,31)'],
   bg:'rgba(0,0,0,0)'
  },
  {name:'red',
   color:'rgb(255,48,31)',
   bg:'rgba(0,0,0,0)'
  },
  {name:'green',
   color:'rgb(45,255,87)',
   bg:'rgba(0,0,0,0)'
  },
  {name:'blue',
   color:'rgb(45,152,255)',
   bg:'rgba(0,0,0,0)'
  },
  {name:'yellow',
   color:'rgb(255,245,0)',
   bg:'rgba(0,0,0,0)'
  },
  {name:'cyan',
   color:'rgb(0,245,255)',
   bg:'rgba(0,0,0,0)'
  },
  {name:'purple',
   color:'rgb(245,0,255)',
   bg:'rgba(0,0,0,0)'
  },
  {name:'white',
   color:'rgb(255,255,255)',
   bg:'rgba(0,0,0,0)'
  }
]
effects.forEach((e,i)=>{
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
    document.querySelector('.effects container').appendChild(svgContainer)
  })(),
  generateStrobe = (() => {
    let svgContainer = document.createElement('div'),
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs'),
    grad = document.createElementNS("http://www.w3.org/2000/svg", 'linearGradient'),
    circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
    svgContainer.style.order = i + effects.length
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
    svgContainer.addEventListener('click', setEffect);
    document.querySelector('.effects container').appendChild(svgContainer)
  })()
})