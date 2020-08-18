async function onButtonClick() {
    let options = {};
      options.acceptAllAdvertisements = true;

    try {
      console.log('Requesting Bluetooth Scan with options: ' + JSON.stringify(options));
      const scan = await navigator.bluetooth.requestLEScan(options);
  
      console.log('Scan started with:');
      console.log(' acceptAllAdvertisements: ' + scan.acceptAllAdvertisements);
      console.log(' active: ' + scan.active);
      console.log(' keepRepeatedDevices: ' + scan.keepRepeatedDevices);
      console.log(' filters: ' + JSON.stringify(scan.filters));
  
      navigator.bluetooth.addEventListener('advertisementreceived', event => {
        console.log('Advertisement received.');
        console.log('  Device Name: ' + event.device.name);
        console.log('  Device ID: ' + event.device.id);
        console.log('  RSSI: ' + event.rssi);
        console.log('  TX Power: ' + event.txPower);
        console.log('  UUIDs: ' + event.uuids);
        event.manufacturerData.forEach((valueDataView, key) => {
          logDataView('Manufacturer', key, valueDataView);
        });
        event.serviceData.forEach((valueDataView, key) => {
          logDataView('Service', key, valueDataView);
        });
      });
  
      setTimeout(stopScan, 10000);
      function stopScan() {
        console.log('Stopping scan...');
        scan.stop();
        console.log('Stopped.  scan.active = ' + scan.active);
      }
    } catch(error)  {
        console.log('Argh! ' + error);
    }
  }
  
  /* Utils */
  
  const logDataView = (labelOfDataSource, key, valueDataView) => {
    const hexString = [...new Uint8Array(valueDataView.buffer)].map(b => {
      return b.toString(16).padStart(2, '0');
    }).join(' ');
    const textDecoder = new TextDecoder('ascii');
    const asciiString = textDecoder.decode(valueDataView.buffer);
    console.log(`  ${labelOfDataSource} Data: ` + key +
        '\n    (Hex) ' + hexString +
        '\n    (ASCII) ' + asciiString);
  };

  document.querySelector('#allAdvertisements').addEventListener('click', function(event) {
    onButtonClick();
})