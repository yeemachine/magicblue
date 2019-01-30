# Magicblue Bluetooth Wiki

This section aims to chronicle all the protocols available for bulbs that use the same Magicblue Bluetooth receivier. Bulbs like [this](https://www.gearbest.com/smart-light-bulb/pp_230349.html) or [this](https://www.amazon.com/Magic-Light-Bluetooth-Smart-Bulb/dp/B00Y6X93EQ?ref_=bl_dp_s_web_9321634011&th=1) use the same Bluetooth protocol. 
Check out my [ Magicblue Web Bluetooth library](https://github.com/yeemachine/magicblue) to control the bulb directly with Chrome.

## Basics

**Services:** set of provided features and associated behaviors to interact with the peripheral. Each service contains a collection of characteristics.

**Characteristics:** definition of the data divided into declaration and value. Using permission properties (read, write, notify, indicate) to get a value. For our use case, we are using notify and writing values.

The general process for interacting with a Bluetooth device:  
**Connect to device → Connect to a Service → Connect to a Characteristic → Write Value to Characteristic**

## Services

**Light Control**  
This service contains the 'light control' characteristic.
```js
0xffe5
```

**Light Notification**  
This service contains the 'light notification' characteristic.
```js
0xffe0
```

## Characteristics

**Light Control** (Write only)  
This characteristic is primarily for sending the device data.
This will be the place to send data for setting RGB, warm whites, preset effects, and schedules. It also is the place for sending data to trigger notifications for reading device status and current set schedules.
```js
0xffe9
```

**Light Notification** (Read only)  
This characteristic is primarily for receiving notifications from a device.
Adding an event listener (*like characteristicvaluechanged*) to this characteristic will return 20 byte long byte arrays when sending a particular byte array to the light control characteristic. For the Magicblue bulb, there are only 2 possible notifications — Device Status (12 bytes) and Device Schedule (87 bytes)
```js
0xffe4
```

## Write
Bellow are all the different actions accepted by the 'light control' characteristic. When sending data more than 20 bytes, you may need to send them in 20 byte chunks.

**Turn On**
```js
[0xcc, 0x23, 0x33]
```
**Turn Off**
```js
[0xcc, 0x24, 0x33]
```
**Set Warm White**
```js
[0x56, r*, g*, b*, 0, 0x0f, 0xaa]

*Value range: 0-255 (0x00-0xff)
```
**Set RGB**
```js
[0x56, 0, 0, 0, Intensity*, 0xf0, 0xaa]

*Values range: 0-255 (0x00-0xff)
```
**Set Preset Effect**
```js
[0xbb,effect*,speed*,0x44, 0x0A, 0x150722]

*Speed range: 1-20 (0x01-0x14); 1 being the fastest

*Effects:{
  seven_color_cross_fade:0x25,
  red_gradual_change:0x26,
  green_gradual_change:0x27,
  blue_gradual_change:0x28,
  yellow_gradual_change:0x29,
  cyan_gradual_change:0x2a,
  purple_gradual_change:0x2b,
  white_gradual_change:0x2c ,
  red_green_cross_fade:0x2d,
  red_blue_cross_fade:0x2e,
  green_blue_cross_fade:0x2f,
  seven_color_stobe_flash:0x30,
  red_strobe_flash:0x31 ,
  green_strobe_flash:0x32,
  blue_strobe_flash:0x33,
  yellow_strobe_flash:0x34,
  cyan_strobe_flash:0x35,
  purple_strobe_flash:0x36,
  white_strobe_flash:0x37,
  seven_color_jumping_change:0x38
}
```
### Set Schedule

Schedules are set by sending a 87 byte long array. Magicblue can set a maximum of 6 schedules. All 6 schedules spaces must be filled when sending the full array over in an active or inactive state.

**Full Array** (87 bytes)
```js
[header,schedule,schedule,schedule,schedule,schedule,schedule,footer] 
= [0x23,schedule,schedule,schedule,schedule,schedule,schedule,0x00, 0x32]
```
**Inactive Schedule Array** (14 bytes)
```js
[header,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,footer]
= [0x0f,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x0f]
```
**Active Schedule Array - Full** (14 bytes)
```js
[header,timeArray,actionArray,footer]
= [0xf0,timeArray,actionArray,0x00,0xf0]
```
**Active Schedule Array - The Time** (7 bytes)
```js
[*year,*month,*day,hour,min,sec,**repeat]

*Year, month and day are used to set a one time timer. Set to 0 if timer is meant to repeat.

**Repeat is simple summation of all the days the timer reoccurs on. Hex codes for each day below.

weekList:{
  sunday:0x80,
  monday:0x02,
  tuesday:0x04,
  wednesday:0x08,
  thursday:0x10,
  friday:0x20,
  saturday:0x40
}
```
**Active Schedule Array - The Action** (4 bytes)  
There are 4 different action options each with a specific array format.
```js
Warm White 'Sunrise':
====================
[0xa1,*speed,**start,**end]

Turns on Warm White with specified start/end points.
*Speed is set in minutes. 1 min = 0x01
**Start and End brightness value range: 0-255 (0x00-0xff); Start must be smaller than End value

Warm White 'Sunset':
===================
[0xa2,*speed,**start,**end]

Turns off Warm White with specified start/end points.
*Speed is set in minutes. 1 min = 0x01
**Start and End brightness value range: 0-255 (0x00-0xff); Start must be larger than End value

RGB:
===
[0x41,*r,*g,*b]

Sets an RGB Value.
*Values range: 0-255 (0x00-0xff)

Effect:
======
[*effect,**speed,0x00,0x00]

Sets a preset effect.
*Refer to the Effects list above for the hex code.
*Speed range: 1-20 (0x01-0x14); 1 being the fastest
```
**Request Status**
This triggers the device status notification (12 bytes).
```js
[0xef, 0x01, 0x77]
```
**Request Schedule**
This triggers the device schedule notification (87 bytes).
```js
[0x24, 0x2a, 0x2b, 0x42]
```

## Read (From Notifications)

**Device Status Array** (12 bytes)
Monitor what state the bulb is currently in as well as other information.
```js
[0x66, deviceClass, *on/off, **effect, 0x24, ***speed, r, g, b, brightness, version, 0x99]

*On = 0x23, Off = 0x24
**Effect only reliable when talking about preset effects.
***Speed range: 1-20 (0x01-0x14); 1 being the fastest, For effects
RGB and Warm White Brightness Values range: 0-255 (0x00-0xff)
```

**Full Schedule Array** (87 bytes)
The bulb will keep sending chunks of <= 20 bytes of data until it has finished sending all 87 bytes. The structure is similar to setting a schedule. Besides slight changes in the header and footer to this full array, the method of decoding and encoding is identical.
```js
[header,schedule,schedule,schedule,schedule,schedule,schedule,footer] 
= [0x25,schedule,schedule,schedule,schedule,schedule,schedule,0x00, 0x52]
```
