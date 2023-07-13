import version from "consts:version";
import { initializeAccelerometer } from "./utils/acceleration";
import { blink } from "./utils/leds";
import { setDeviceName } from "./utils/nrf";

const LONG_PRESS_DELAY = 2500;
const SINGLE_PRESS_DELAY = 500;

var singlePressCounter = 0;
var singlePressTimeout: NodeJS.Timeout | null = null;
var longPressTimeout: NodeJS.Timeout | null = null;
var didLongPress = false;

declare global {
  var isConnected: boolean;
}

var isConnected = false;

setDeviceName();

function handleButtonDown() {
  longPressTimeout = setTimeout(function () {
    broadcastButtonPress(1, true);
    didLongPress = true;
  }, LONG_PRESS_DELAY);
}

function handleButtonUp() {
  clearTimeout(longPressTimeout);

  if (didLongPress) {
    // We've already handled the long press using the NodeJS timeout callback. Therefore, we
    // simply unset this flag and return.
    didLongPress = false;
  } else {
    singlePressCounter += 1;
    if (singlePressTimeout) clearTimeout(singlePressTimeout);
    singlePressTimeout = setTimeout(function () {
      broadcastButtonPress(Number(singlePressCounter.toString()));
      singlePressCounter = 0;
      singlePressTimeout = null;
    }, SINGLE_PRESS_DELAY);
  }
}

setWatch(handleButtonUp, BTN, {
  edge: "falling",
  repeat: true,
  debounce: 10,
});

setWatch(handleButtonDown, BTN, {
  edge: "rising",
  repeat: true,
  debounce: 10,
});

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
        },
        // Motion tracking control
        0xabce: {
          maxLen: 50,
          writable: true,
          onWrite: listenForMotion,
        },
        // Motion tracking indication
        0xabcf: {
          maxLen: 50,
          readable: true,
          notify: true,
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

function broadcastButtonPress(pressCount: number, isLongPress = false) {
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
            t: Math.round(new Date().getTime() / 1000)
              .toString()
              .slice(-6),
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
  blink(LED2, 3, 20);
  initializeAccelerometer(broadcastMotion);
}

function broadcastMotion() {
  setTimeout(() => {
    NRF.updateServices({
      0xbcde: {
        0xabcf: {
          // We broadcast the timestamp using the key 't'
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
