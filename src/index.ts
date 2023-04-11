import version from "consts:version";
import { initializeAccelerometer } from "./utils/acceleration";
import { blink } from "./utils/leds";
import { setDeviceName } from "./utils/nrf";

declare global {
  var isConnected: boolean;
}

var isConnected = false;

setDeviceName();

initializeButton(broadcastButtonPress, broadcastButtonLongPress);

function handleDisconnect() {
  LED3.write(false);
  blink(LED1, 5, 20);
  isConnected = false;
  resetServices();
}

function handleConnect() {
  blink(LED3, 3, 20);
  isConnected = true;
}

function resetServices() {
  NRF.setServices(
    {
      0xbcde: {
        // Short press
        0xabcd: {
          maxLen: 50,
          readable: true,
          notify: true,
          value: null,
        },
        // Motion tracking control
        0xabce: {
          maxLen: 50,
          writable: true,
          value: null,
          onWrite: listenForMotion,
        },
        // Motion tracking indication
        0xabcf: {
          maxLen: 50,
          readable: true,
          notify: true,
          value: null,
        },
        // VERSION
        0xeeee: {
          maxLen: 20,
          readable: true,
          broadcast: true,
          value: version,
        },
      },
      0x180f: {
        // Battery Service
        0x2a19: {
          readable: true,
          broadcast: true,
          value: [Puck.getBatteryPercentage()],
        },
      },
    },
    {
      advertise: [
        "0000bcde-0000-1000-8000-00805f9b34fb",
        "0000180f-0000-1000-8000-00805f9b34fb",
      ],
    }
  );
}

function broadcastButtonPress(pressCount: number) {
  blink(LED3, pressCount, 150);
  if (!isConnected) return blink(LED1, 3, 1000);

  // We need to move this off the main thread due to an apparent issue with global variables
  setTimeout(() => {
    NRF.updateServices({
      0xbcde: {
        0xabcd: {
          // We broadcast the presscount and timestamp using the keys 'p' and 't' respectively.
          value: JSON.stringify({
            p: pressCount,
            t: Math.round(new Date().getTime() / 1000),
          }),
          readable: true,
          notify: true,
        },
        0xabce: {
          maxLen: 50,
          readable: false,
          writable: true,
          value: null,
          onWrite: listenForMotion,
        },
        0xabcf: {
          value: null,
          readable: true,
          notify: true,
        },
      },
      0x180f: {
        0x2a19: {
          value: [Puck.getBatteryPercentage()],
          readable: true,
          notify: true,
        },
      },
    });
  }, 100);
}

function listenForMotion() {
  initializeAccelerometer(broadcastMotion);
}

function broadcastMotion() {
  setTimeout(() => {
    NRF.updateServices({
      0xbcde: {
        0xabcf: {
          // We broadcast the presscount and timestamp using the keys 'p' and 't' respectively.
          value: JSON.stringify({
            t: Math.round(new Date().getTime() / 1000),
          }),
          readable: true,
          notify: true,
        },
      },
    });
  }, 100);
}

resetServices();

NRF.setConnectionInterval(7);
NRF.on("disconnect", handleDisconnect);
NRF.on("connect", handleConnect);
