
let colorWheel = null;
let oldColor = null;
let mouseIsDown = false;

colorWheel = iro.ColorWheel("#color-wheel", {
	width: 320,
	height: 320,
	padding: 4,
	sliderMargin: 24,
	markerRadius: 8,
	color: "rgb(255, 255, 255)",
	styles: {
		".on-off": {
			"background-color": "rgb"
		},
		".on-off:hover": {
			"background-color": "rgb"
		}
	}
});

document.querySelector('.wheel').addEventListener('mousedown', function (e) {
	handleMouseDown(e);
}, false);
document.querySelector('.wheel').addEventListener('mousemove', function (e) {
	handleMouseMove(e);
}, false);
document.querySelector('.wheel').addEventListener('mouseup', function (e) {
	handleMouseUp(e);
}, false);

function handleMouseDown(e) {
	// mousedown stuff here
	mouseIsDown = true;
}

function handleMouseUp(e) {
	updateColor();
	// mouseup stuff here
	mouseIsDown = false;
}

function handleMouseMove(e) {
	if (!mouseIsDown) {
		return;
	}
	updateColor();
}

function updateColor() {
	if (oldColor != null && oldColor != "" && oldColor != colorWheel.color.rgbString) {
    let rgb = [colorWheel.color.rgb.r, colorWheel.color.rgb.g, colorWheel.color.rgb.b].join(',')
		magicblue.setRGB(rgb);  
    let powerButton = document.querySelector('.power-button')
    if(!powerButton.classList.contains('selected')){
      powerButton.classList.add('selected')
      document.querySelector('.power-button i').innerHTML = 'lightbulb'
    }
    document.querySelector('.power-button').style.backgroundColor = 'rgb('+rgb+')'

	}
	oldColor = colorWheel.color.rgbString;
}