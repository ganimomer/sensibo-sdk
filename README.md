# Sensibo Client API

A NodeJS API for Sensibo and Sensibo Sky.
## Usage with NodeJS
The API exports a SensiboClient class, to be constructed with an API key:
```js
const SensiboClient = require('sensibo-sdk')
const client = new SensiboClient(someApiKey) //initialize with API key
```
The client has one asynchronous method, `getPods`, which returns a promise to instances of a `Pod` class. Each `Pod` comes with asynchronous methods `getMeasurements`, `getAcState` and `setAcState`
```js
const pods = await client.getPods()
const measurements = await pods[0].getMeasurements() //batteryVoltage, humidity, etc
const acState = await pods[0].getAcState() // on, fanLevel, swing etc
const updateResult = await pods[0].setAcState({targetTemperature: 24, temperatureUnit: 'C'})
```
