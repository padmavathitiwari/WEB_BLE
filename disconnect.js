
document.querySelector('#disconnect').addEventListener('submit', function(event) {
    onDisconnectButtonClick()
})

function onDisconnectButtonClick() {
    if (!bluetoothDevice) {
      return;
    }
    console.log('Disconnecting from Bluetooth Device...');
    if (bluetoothDevice.gatt.connected) {
      bluetoothDevice.gatt.disconnect();
      bluetoothDevice = null;
    } else {
      console.log('> Bluetooth Device is already disconnected');
    }
  }   

function onDisconnected(event) {
    // Bluetooth Device getting disconnected.
    console.log('> Bluetooth Device disconnected');
  }