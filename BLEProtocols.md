# Magicblue Bluetooth Wiki

This section aims to chronicle all the protocols available for bulbs that use the same Magicblue Bluetooth receivier. Bulbs like [this](https://www.gearbest.com/smart-light-bulb/pp_230349.html) or [this](https://www.amazon.com/Magic-Light-Bluetooth-Smart-Bulb/dp/B00Y6X93EQ?ref_=bl_dp_s_web_9321634011&th=1) use that same Bluetooth protocol.

## Terminology

**GATT:** Generic Attribute Profile defines how to exchange data using predefined attributes.

**Services:** set of provided features and associated behaviors to interact with the peripheral. Each service contains a collection of characteristics.

**Characteristics:** definition of the data divided into declaration and value. Using permission properties (read, write, notify, indicate) to get a value. For our use case, we are using notify and writing values.

The general structure for interacting with a Bluetooth device: 
**Gatt connect to device → Connect to a Service → Connect to a Characteristic → Write Value to Characteristic**

## Services

Light Control
```js
0xffe5
```

Light Notification
```js
0xffe0
```

## Characteristics

Light Control
```js
0xffe9
```

Light Notification (add an event listener to read light notifications like status or schedule)
```js
0xffe4
```

## Write
All values are converted from decimal to hex.
Dynamic values are labeled with an asterisk.

**Turn On**
```js
[0xcc, 0x23, 0x33]
```
**Turn Off**
```js
[0xcc, 0x24, 0x33]
```
**Set Warm White**
Values range from 0 to 255 (0x00 to 0xff)
```js
[0x56, r*, g*, b*, 0, 0x0f, 0xaa]
```
**Set RGB**
```js
[0x56, 0, 0, 0, Intensity*, 0xf0, 0xaa]
```
**Set Preset Effect**
```js

```
**Set Schedule**
```js

```
**Setup Status Notifications**
```js

```
**Setup Schedule Notifications**
```js

```
**Request Status**
```js

```
**Request Schedule**
```js

```
## Read (From Notifications)


