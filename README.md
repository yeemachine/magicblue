# Magicblue.js

**Control Magicblue Smart Bulbs over Web Bluetooth**

This is a small project aimed at reverse engineering one of the [cheaper Bluetooth lightbulbs](https://www.gearbest.com/smart-light-bulb/pp_230349.html) out there and controlling it directly through a browser without the official app. As of writing this, **Web Bluetooth is only supported in Chrome**. 

There are multiple versions of the **Magicblue** bulb that are floating around. It's possible some versions are configured slightly differently and need further developement. I personally used [this bulb](https://www.amazon.com/Magic-Light-Bluetooth-Smart-Bulb/dp/B00Y6X93EQ?ref_=bl_dp_s_web_9321634011&th=1) for my experiments.

I began the project by reading [Urish's Medium post](https://medium.com/@urish/reverse-engineering-a-bluetooth-lightbulb-56580fcb7546) and later referenced [Betree's unofficial python library](https://github.com/Betree/magicblue) for more specific bluetooth commands and schedule/status formats.

### Compatibility
I haven't yet tested all Magicblue bulb versions. But V6-V10 bulbs should work. 
V1 is still unstable, being unable to set schedule. May come back to it in the future.

## Usage
You can view the demo [here](https://magicblue.glitch.me) or remix your own project with the button below.

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/magicblue)

Initialize click events for the Bluetooth Device Navigator. Can also be triggered manually using the magicblue.search() method.
```js
magicblue.init('.connect-button, .connect-another button') 
```
Listens for when a new device is connected. Returns the device name.
```js
magicblue.on('connected', (device) => {
  console.log(device + ' is connected.');
  someAction()
  magicblue.request('status,schedule',device) 
});
```
Listens for when a notification is received. Returns an object with the device name as well as type of notification (status/schedule).
```js
magicblue.on('receiveNotif', function (e) {
  let deviceName = e.device
  let notifType = e.type
  let notifObj = magicblue[notifType][deviceName]
  console.log(notifObj);
});
```
Listens for when a device is disconnected. Returns the device name as well as the current state (disconnected/reconnected).
```js
magicblue.on('disconnected', function (e) {
  console.log(e.device+' is '+e.state+'.');
});
```
Public properties that will return info on all connected devices. Status and Schedules will need to be requested first.
```js
magicblue.devices
magicblue.status
magicblue.schedule
```
Some example functions that can be used after connected. See API section for more detailed params and defaults. 
```js
magicblue.turnOn()
magicblue.turnOff()
magicblue.turnOnOff()
magicblue.setRGB('255,0,0')
magicblue.setWhite(255)
magicblue.setEffect('seven_color_stobe_flash')
magicblue.setSchedule(scheduleList)
magicBlue.request('status')
```
[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/magicblue)

## API
### Properties
| Name          | Type          | Format        | Description   |
| ------------- | ------------- | ------------- | ------------- |
| DICT          | Object        | {name:<code>decimal</code>} | Returns an object containing Bluetooth Hexcodes for Magicblue Smart Bulbs as reference. |
| devices       | Object        | {deviceName:<code>BluetoothDevice</code>} | Returns an object containing all connected devices |
| chars         | Object        | {deviceName:<code>BluetoothRemoteGATTCharacteristic</code> }| Returns an object containing write characteristics from all connected devices |
| status        | Object        | {deviceName:{<br>on:<code>true\|false</code>,<br>mode:<code>'white'\|'rgb'\|'effect'\|'sunrise'</code>,<br>rgb:<code>[r,g,b]</code>,<br>white:<code>0->255</code>,<br>effect:<code>'preset_effect'</code>,<br>speed:<code>1->20</code>}<br>} | Returns an object containing the status from all connected devices |
| schedule      | Object        | {deviceName:[<br>{repeat:<code>true\|false</code>,<br>repeatDays:<code>['monday -> sunday']</code>,<br>year:<code>20XX</code>,<br>month:<code>1->12</code>,<br>day:<code>1->31</code>,<br>mode:<code>'white'\|'rgb'\|'effect'</code>,<br>start:<code>0->255</code>,<br>end:<code>0->255</code>,<br>speed:<code>1->120(minutes) \| 1->20(effect speed)</code>,<br>rgb:<code>[r,g,b]</code>,<br>effect:<code>'preset_effect'</code>,}<br>]} | Returns an object containing an array of schedules from all connected devices. Max 6 schedules set per device. |
| reconnect     | Boolean       | Default:<code>false</code> | Toggle ability to auto-reconnect disconnected devices|
| DEBUG         | Boolean       | Default:<code>false</code> | Toggle Console Logs|


### Methods
| Name          | Params        | Defaults      | Description   |
| ------------- | ------------- | ------------- | ------------- |
| on            | ('connecting'\|'connected'\|'disconnected'\|'receiveNotif',callback)| N/A | Event listener for when device is connected, disconnected, or sends notification.|
| init          | ('domElement1, domElement2')| N/A | Adds search() to all DOM elements provided as a string separated by ','. |
| search        | N/A           | N/A           | Initiates navigator.requestDevice to search for devices. Must be fired on user interaction. |
| request       | ('status, schedule', deviceNames)| (Status and Schedule, All Connected Devices)| Sends a request for device status, schedule, or both, provided by a string separated by ','. |
| disconnect    | (deviceNames)| (All Connected Devices)   | Disconnect a bluetooth device. |
| turnOn        | (deviceNames)| (All Connected Devices)   | Turns on selected devices. |
| turnOff       | (deviceNames)| (All Connected Devices)   | Turns off selected devices. |
| turnOnOff     | (deviceNames)| (All Connected Devices)   | Toggles ON/OFF based on state of first device in array.|
| setRGB        | ('r,g,b', deviceNames)| (N/A, All Connected Devices) | Sets RGB color.|
| setWhite  | (intensity, deviceNames)| (255, All Connected Devices) | Sets Warm White color with desired intensity (0-255).|
| setEffect     | (effectName, speed, deviceNames)| ('seven_color_cross_fade', 1, All Connected Devices) | Set a preset pattern and speed (1-20).
| setSchedule   | (newScheduleArray, deviceNames)| (oldScheduleArray, All Connected Devices) | Sets a timer schedule for each device. Can choose between single-use and repeating timers. Actions include adjusting brightness for Warm White color scheme, setting a particular RGB value, or a factory preset effect. |


### Preset Effects
```js
seven_color_cross_fade
red_gradual_change
green_gradual_change
blue_gradual_change
yellow_gradual_change
cyan_gradual_change
purple_gradual_change
white_gradual_change
red_green_cross_fade
red_blue_cross_fade
green_blue_cross_fade
seven_color_stobe_flash
red_strobe_flash
green_strobe_flash
blue_strobe_flash
yellow_strobe_flash
cyan_strobe_flash
purple_strobe_flash
white_strobe_flash
seven_color_jumping_change
```



