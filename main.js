
const SERVICE_UUID = "000018f0-0000-1000-8000-00805f9b34fb"
const SERVICE_CHARACTERISTIC = "00002af1-0000-1000-8000-00805f9b34fb"

const btnConnect = document.querySelector(".btnConnect")
const btnPrint = document.querySelector(".btnPrint")
const txtStatus = document.querySelector(".txtStatus")
const txtNamaDevice = document.querySelector(".txtNamaDevice")
const btnDisconnect = document.querySelector(".btnDisconnect")

let characteristic = null;
let printer = null;

txtStatus.innerHTML = `<span class='badge bg-danger'>OFF</span>`


const Printable = {
  Align: {
    center: (text) => '\x1B' + '\x61' + '\x31' + text,
    left: (text) => '\x1B' + '\x61' + '\x00' + text,
    right: (text) => '\x1B' + '\x61' + '\x02' + text,
    reset: () => '\x1B' + '\x61' + '\x31' + '\x1D' + '\x21' 
                  + '\x00' + '\n'.repeat(2) + '\r'
  },
  Keyboard: {
    enter: (count) => '\n'.repeat(count) + '\r',
  },
  Font: {
    normal: (text) => '\x1D' + '\x21' + '\x00' + text,
    large: (text) => '\x1D' + '\x21' + '\x11' + text, 
  },
  Misc: {
    centerLine: (count) => '\x1B' + '\x61' + '\x31' + '-'.repeat(count)
  }
}


const print = async (text) => {
  let textEncoder = new TextEncoder("utf-8");
  text = textEncoder.encode(text);
  
  txtNamaDevice.innerHTML = 'Sedang mencetak...';

  await characteristic.writeValue(text);
}
const myPrintingTest = async () => {
  const texts = [
    Printable.Align.reset(),
    Printable.Align.center(Printable.Font.large('PT. KML')),
    Printable.Keyboard.enter(1),
    Printable.Align.center(Printable.Font.normal('PT. Kopi Mantan Lama')),
    Printable.Keyboard.enter(1),
    Printable.Misc.centerLine(10),
    Printable.Keyboard.enter(2),
    Printable.Align.left(Printable.Font.normal('No. 4501')),
    Printable.Keyboard.enter(1),
    Printable.Align.left(Printable.Font.normal('Kasir: Fitri')),
    Printable.Keyboard.enter(2),
    Printable.Align.left(Printable.Font.normal('Short Black (Espresso)')),
    Printable.Keyboard.enter(1),
    Printable.Align.left(Printable.Font.normal('Qty 1 x 22.000 @ 22.000')),
    Printable.Keyboard.enter(1),
    Printable.Align.left(Printable.Font.normal('Iced Long Black')),
    Printable.Keyboard.enter(1),
    Printable.Align.left(Printable.Font.normal('Qty 2 x 25.000 @ 50.000')),
    Printable.Keyboard.enter(2),
    Printable.Align.left(Printable.Font.normal('PPN\t: 11% ')),
    Printable.Keyboard.enter(1),
    Printable.Align.left(Printable.Font.normal('Total\t: Rp. 79.920 ')),
    Printable.Keyboard.enter(2),
    Printable.Align.center(Printable.Font.normal("Terima Kasih")),
    Printable.Align.reset(),
    Printable.Keyboard.enter(2),
  ]

  for (let text of texts) {
    await print(text)
  }
}

const disconnect = () => {
  printer.gatt.disconnect();
  characteristic = null;
  txtStatus.innerHTML = `<span class='badge bg-danger'>
      OFF
    </span>`
  txtNamaDevice.innerHTML = ""
}

const connect = () => {
  navigator.bluetooth.requestDevice({
    filters: [{
      services: [SERVICE_UUID]
    }]
  })
  .then(device => { 
    printer = device;
    txtNamaDevice.innerHTML = `Menghubungkan ${device.name}`;
    return device.gatt.connect();
  })
  .then(server => server.getPrimaryService(SERVICE_UUID))
  .then(service => service.getCharacteristic(SERVICE_CHARACTERISTIC))
  .then(chrt => {
    txtNamaDevice.innerHTML = chrt.service.device.name;
    txtStatus.innerHTML = `<span class='badge bg-primary'>
      CONNECTED
    </span>`
    characteristic = chrt;
  })
  .catch(error => { 
    console.error(error); 
    alert("Printer ada masalah")
  });
}

btnConnect.addEventListener("click", () => {
  if (characteristic) {
    alert("Printer sudah terhubung!")
    return;
  }

  connect();
})

btnPrint.addEventListener("click", () => {
  if (!characteristic) {
    alert("Pastikan printer sudah terhubung.")
    return;
  }
  
  myPrintingTest()

})

btnDisconnect.addEventListener('click', () => {
  if (!printer && !characteristic) {
    alert("bluetooth belum terkoneksi")
  }

  disconnect()
})
