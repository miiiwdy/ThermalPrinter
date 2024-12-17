const btnConnect = document.querySelector(".btnConnect");
const btnPrint = document.querySelector(".btnPrint");
const txtStatus = document.querySelector(".txtStatus");
const txtNamaDevice = document.querySelector(".txtNamaDevice");
const btnDisconnect = document.querySelector(".btnDisconnect");

let printer = null;
let writer = null;

txtStatus.innerHTML = `<span class='badge bg-danger'>OFF</span>`;

const Printable = {
  Align: {
    center: (text) => '\x1B' + '\x61' + '\x31' + text,
    left: (text) => '\x1B' + '\x61' + '\x00' + text,
    right: (text) => '\x1B' + '\x61' + '\x02' + text,
    reset: () => '\x1B' + '\x61' + '\x31' + '\x1D' + '\x21' + '\x00' + '\n'.repeat(2) + '\r'
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

  try {
    await writer.write(text);
  } catch (error) {
    console.error("Failed to write to printer", error);
    alert("Gagal mencetak.");
  }
}

const myPrintingTest = async () => {
  const texts = [
    Printable.Align.reset(),
    Printable.Align.center(Printable.Font.large('PT. Ionbit Cafe')),
    Printable.Keyboard.enter(1),
    Printable.Misc.centerLine(10),
    Printable.Keyboard.enter(2),
    Printable.Align.left(Printable.Font.normal('No. 1')),
    Printable.Keyboard.enter(1),
    Printable.Align.left(Printable.Font.normal('Kasir: Rafi')),
    Printable.Keyboard.enter(2),
    Printable.Align.left(Printable.Font.normal('Short Black (Espresso)')),
    Printable.Keyboard.enter(1),
    Printable.Align.left(Printable.Font.normal('Qty 1 x 22.000 @ 22.000')),
    Printable.Keyboard.enter(1),
    Printable.Align.left(Printable.Font.normal('Iced Long Black')),
    Printable.Keyboard.enter(1),
    Printable.Align.left(Printable.Font.normal('Qty 2 x 25.000 @ 50.000')),
    Printable.Keyboard.enter(2),
    Printable.Align.left(Printable.Font.normal('PPN\t: 12% ')),
    Printable.Keyboard.enter(1),
    Printable.Align.left(Printable.Font.normal('Total\t: Rp. 1.179.920 ')),
    Printable.Keyboard.enter(2),
    Printable.Align.center(Printable.Font.normal("mksh bro")),
    Printable.Align.reset(),
    Printable.Keyboard.enter(2),
  ]

  for (let text of texts) {
    await print(text)
  }
}

const disconnect = () => {
  if (printer) {
    printer.close();
    txtStatus.innerHTML = `<span class='badge bg-danger'>OFF</span>`;
    txtNamaDevice.innerHTML = "";
    writer = null;
  }
}

const connect = () => {
  navigator.serial.requestPort()
    .then(port => {
      printer = port;
      txtNamaDevice.innerHTML = `Menghubungkan ${printer.name}`;
      return printer.open({ baudRate: 9600 });
    })
    .then(() => {
      txtStatus.innerHTML = `<span class='badge bg-primary'>CONNECTED</span>`;
      writer = printer.writable.getWriter();
    })
    .catch(error => {
      console.error(error);
      alert("Printer ada masalah atau tidak ditemukan");
    });
}

btnConnect.addEventListener("click", () => {
  if (printer && writer) {
    alert("Printer sudah terhubung!");
    return;
  }
  connect();
});

btnPrint.addEventListener("click", () => {
  if (!printer || !writer) {
    alert("Pastikan printer sudah terhubung.");
    return;
  }
  myPrintingTest();
});

btnDisconnect.addEventListener('click', () => {
  if (!printer) {
    alert("Bluetooth belum terkoneksi");
  }
  disconnect();
});
