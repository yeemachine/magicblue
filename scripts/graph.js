(a=>{
  let svg = d3.select(".startEnd"),
    svgDom = document.querySelector('.startEnd'),
    margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 500 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom,
    maxBrightness = 255,
    maxSpeed = 60

a.start = 0;
a.end = maxBrightness;
a.speed = maxSpeed;
a.points = [[0,a.start],[a.speed,a.end]]

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
svg.append('rect')
    .attr('class', 'zoom')
    .attr('cursor', 'move')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let focus = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(d3.extent(a.points, function(d) { return d[0]; }));
y.domain(d3.extent(a.points, function(d) { return d[1]; }));
focus.append('g')
    .attr('class', 'axis axis--y')
    .call(customYAxis);
function customYAxis(g) {
  g.call(yAxis);
  g.select(".domain").remove();
  g.select('.axis .tick:first-child text').attr('opacity',0)
  g.select(".tick:first-child line").attr('stroke','gold')
  g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "rgba(255,255,255,0.1)").attr("stroke-width", "0.5");
  g.selectAll(".tick text").remove();
}  
  


a.generatePoints = (points) => {
  focus.selectAll("path,circle").remove();
  focus.append("path")
       .datum(points)
       .attr("class", "area")
       .attr("d", area)
      .attr("fill", "url(#grad1)")
  focus.selectAll('circle')
    .data(points)
    .enter()
    .append('circle')
    .attr('r', 10.0)
    .attr('cx', function(d) { return x(d[0]);  })
    .attr('cy', function(d) { return y(d[1]); })
    .style('cursor', 'pointer')
    .style('fill', 'darkorange');
  focus.selectAll('circle')
        .call(drag);
  document.querySelector('container>div.white li.speed p').innerHTML = (a.speed > 1) ? a.speed + ' minutes' : '1 minute'
  document.querySelector('container>div.white li.white p').innerHTML = Math.round(a.start/255 * 100)+'% → '+Math.round(a.end/255 * 100)+'%'
}

  
function dragstarted(d) {
    d3.select(this).raise().classed('active', true);
}

function dragged(d) {
    d[1] = (d3.event.y > height) ? y.invert(height) 
          : (d3.event.y < 0) ? y.invert(0)
          : y.invert(d3.event.y) 
    if(d[0]===0){
      d3.select(this)
        .attr('cy', y(d[1]))
    }else{
      d[0] = (d3.event.x > width) ? x.invert(width) 
        : (d3.event.x < 1) ? 1
        : x.invert(d3.event.x) 
      d3.select(this)
        .attr('cy', y(d[1]))
        .attr('cx', x(d[0]))
    }
    // focus.select('path').attr('d', line);
    focus.select('.area').attr('d', area);
    if(d[0]===0){
      a.start = (d[1] > maxBrightness) ? maxBrightness
                    : (d[1] < 0) ? 0
                    : Math.round(d[1])
      svgDom.querySelector('linearGradient stop:first-child').style['stop-opacity'] = a.start/255
    }else{
      a.speed = (d[0] > maxSpeed) ? maxSpeed
                    : (d[0] < 1) ? 1
                    : Math.round(d[0])
      a.end = (d[1] > maxBrightness) ? maxBrightness
                    : (d[1] < 0) ? 0
                    : Math.round(d[1])
      svgDom.querySelector('linearGradient stop:last-child').style['stop-opacity'] = a.end/255
    }
    cursor.translateCursor(d3.event.sourceEvent.pageX,d3.event.sourceEvent.pageY)
    document.querySelector('container>div.white li.speed p').innerHTML = (a.speed > 1) ? a.speed + ' minutes' : '1 minute'
    document.querySelector('container>div.white li.white p').innerHTML = Math.round(a.start/255 * 100)+'% → '+Math.round(a.end/255 * 100)+'%'
}

function dragended(d) {
    d3.select(this).classed('active', false);
}
})(window.graph = window.graph || {})


