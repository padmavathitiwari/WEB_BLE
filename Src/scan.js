let  bluetoothDevice;
function isWebBluetoothEnabled() {
      if (!navigator.bluetooth) {
        console.log('Web Bluetooth API is not available in this browser!')
        return false;
      }
      return true ;
  }

function getDeviceInfo() {
/*         let options = {
          acceptAllDevices: true , // Option to accept all devices
          optionalServices: ['device_information']
        } */
        let decoder = new TextDecoder('utf-8');
        console.log('Requesting Bluetooth Device...')
        navigator.bluetooth.requestDevice({
             acceptAllDevices: true ,
             optionalServices: ['device_information', 'generic_access', 0x1801, 'e2d0b706-b0a1-4ecc-b298-fd168a326495','d973f2e0-b19e-11e2-9e96-0800200c9a66']
          })
        .then(device => {
          bluetoothDevice = device;
          console.log('> Name: ' + device.name)
          console.log('> GATT Status: ' + device.gatt.connected)
          console.log('> ID : ' + device.id)
          bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
          return connect();
        })
        .then(server => {
          console.log('Getting Service...');
          console.log('> Server connected: ' + server.connected);
          //return server.getPrimaryService('device_information'); 
          return server.getPrimaryServices(); 
        })
        .then(services => {
          console.log('Getting Characteristics...');
          let queue = Promise.resolve();
          let queue1 = Promise.resolve();
          services.forEach(service => {
            queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
              console.log('> Service: ' + service.uuid);
              characteristics.forEach(characteristic => {
                console.log('>> Characteristic: ' + characteristic.uuid + ' ' +
                    getSupportedProperties(characteristic));
                    if(service.uuid == "0000180a-0000-1000-8000-00805f9b34fb"){
                      queue1 = queue1.then(_ => characteristic.readValue()).then(value => {
                        console.log('> service uuid: '+  service.uuid + ' Read Value: ' + decoder.decode(value));
                      });
                    }

              });
            }));
          });
          return queue;
        })
         /*  console.log('Getting Device Information Characteristics...');
          return service.getCharacteristics();
        }) */
/*         .then(characteristics  => {
          characteristicsarray = characteristics;
          console.log('Getting Characteristics...');
          readCharacteristicsDeviceInfo(characteristicsarray);  
      }) */
        .catch(error => {
          console.log('Argh! ' + error)
        })
    }

document.querySelector('#scanbutton').addEventListener('submit', function(event) {
        event.stopPropagation()
        event.preventDefault()
        if (isWebBluetoothEnabled()) {
          getDeviceInfo()
    }
})

function connect() {
  console.log('Connecting to Bluetooth Device...');
  return bluetoothDevice.gatt.connect()
}

function readCharacteristicsDeviceInfo(characteristics){
  let queue = Promise.resolve();
  let decoder = new TextDecoder('utf-8');
  characteristics.forEach(characteristic => {
    switch (characteristic.uuid) {
      case BluetoothUUID.getCharacteristic('manufacturer_name_string'):
        queue = queue.then(_ => characteristic.readValue()).then(value => {
          console.log('> Manufacturer Name String: ' + decoder.decode(value));
        });
        break;
      case BluetoothUUID.getCharacteristic('gap.appearance'):
          queue = queue.then(_ => readAppearanceValue(characteristic));
          break;
      case BluetoothUUID.getCharacteristic('model_number_string'):
        queue = queue.then(_ => characteristic.readValue()).then(value => {
          console.log('> Model Number String: ' + decoder.decode(value));
        });
        break;

      case BluetoothUUID.getCharacteristic('hardware_revision_string'):
        queue = queue.then(_ => characteristic.readValue()).then(value => {
          console.log('> Hardware Revision String: ' + decoder.decode(value));
        });
        break;

      case BluetoothUUID.getCharacteristic('firmware_revision_string'):
        queue = queue.then(_ => characteristic.readValue()).then(value => {
          console.log('> Firmware Revision String: ' + decoder.decode(value));
        });
        break;

      case BluetoothUUID.getCharacteristic('software_revision_string'):
        queue = queue.then(_ => characteristic.readValue()).then(value => {
          console.log('> Software Revision String: ' + decoder.decode(value));
        });
        break;
        default: console.log('> Unknown Characteristic: ' + characteristic.uuid);
      }
});
return queue;
}

function readAppearanceValue(characteristic) {
  return characteristic.readValue().then(value => {
    log('> Appearance: ' +
        getDeviceType(value.getUint16(0, true /* Little Endian */)));
  });
}

/* Utils */

function getDeviceType(value) {
  // Check out page source to see what valueToDeviceType object is.
  return value +
      (value in valueToDeviceType ? ' (' + valueToDeviceType[value] + ')' : '');
}

function getSupportedProperties(characteristic) {
  let supportedProperties = [];
  for (const p in characteristic.properties) {
    if (characteristic.properties[p] === true) {
      supportedProperties.push(p.toUpperCase());
    }
  }
  return '[' + supportedProperties.join(', ') + ']';
}