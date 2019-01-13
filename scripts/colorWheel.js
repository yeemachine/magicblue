
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
		magicblue.setRGB([colorWheel.color.rgb.r, colorWheel.color.rgb.g, colorWheel.color.rgb.b].join(','));   
	}
	oldColor = colorWheel.color.rgbString;
}