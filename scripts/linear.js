(a=>{
a.red = 127;
a.green = 127;
a.blue = 127;
a.updateRGB = () => {
  document.querySelector('.schedule .rgb .circle').style.backgroundColor = 'rgb('+a.red+','+a.green+','+a.blue+')'
  document.querySelector('.schedule .rgb li p').innerHTML = 'RGB('+a.red+','+a.green+','+a.blue+')' 
}  
a.updateGraph = () => {
  let sliderItems = ['red','green','blue']
  sliderItems.forEach((e,i)=>{
    sliderTemplate(e)
  })
  a.updateRGB()
}
  
const sliderTemplate = (item) =>{
let svg = d3.select("."+item+'Line'),
    svgDom = document.querySelector("."+item),
    margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 255 - margin.left - margin.right,
    height = 20 - margin.top - margin.bottom;
  
svg.selectAll("*").remove();

let points = [[0,height],[255/2,height]]
let start = 0;
let end = 100;
let x = d3.scaleLinear()
    .rangeRound([0, width]),
    y = d3.scaleLinear()
    .rangeRound([height, 0]);
let xAxis = d3.axisBottom(x).ticks(1),
    yAxis = d3.axisRight(y).tickSize(width).ticks(5)

let area = d3.area()
   .x(function(d) { return x(d[0]); })
    .y0(height)
    .y1(function(d) { return y(d[1]); });
  
let drag = d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
  
svg.attr("viewBox", "0 0 "+(width+margin.left+margin.right)+' '+(height+margin.top+margin.bottom)) 
  .attr('width', '100%')
  .attr('height', '100%')

let focus = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain([0,255]);
y.domain([0,height]); 

focus.append("rect")
    .datum(points)
    .attr("class", "area")
    .attr('height',height)
    .attr('width',a[item])
    .attr('rx',height/2)
    .attr("fill", "url(#"+item+"Linear)")
    .attr("clip-path", "url(#pill-clip)")
  
focus.append("rect")
    .datum(points)
    .attr("class", "shadowRect")
    .attr('height',height)
    .attr('width',width)
    .attr('rx',height/2)
    .attr("fill", "url(#shadowLinear)")
  
focus.selectAll('.thumb')
    .data(points)
    .enter()
    .filter(function (d, i) { return i === 1;})
    .append('rect')
    .attr("class", "thumb")
      .attr('height',height)
    .attr('width',width)
    .attr('opacity',0)
    .style('cursor', 'pointer')
    .call(drag)  
  
function dragstarted() {
  d3.select(this).raise().classed('active', true);
  let d = (d3.mouse(this)[0] > width) ? width
          : (d3.mouse(this)[0] < 0) ? 0
          : d3.mouse(this)[0]
  let value = Math.round(x.invert(d))
  focus.select('.area').attr('width', d);
  a[item] = Math.floor(d)
  a.updateRGB()
  
}

function dragged() {
    let d = (d3.mouse(this)[0] > width) ? width
          : (d3.mouse(this)[0] < 0) ? 0
          : d3.mouse(this)[0]
    let value = Math.round(x.invert(d))
    focus.select('.area').attr('width', d);
    a[item] = Math.floor(d)
    a.updateRGB()
}

function dragended(d) {
    d3.select(this).classed('active', false);
    
}
}
  })(window.linear = window.linear || {})


