
document.querySelector('#reconnect').addEventListener('submit', function(event) {
    onReconnectButtonClick()
  })

  function onReconnectButtonClick() {
    if (!bluetoothDevice) {
      return;
    }
    if (bluetoothDevice.gatt.connected) {
      console.log('> Bluetooth Device is already connected');
      return;
    }
    connect()
    .catch(error => {
      console.log('Argh! ' + error);
    });
  }
  