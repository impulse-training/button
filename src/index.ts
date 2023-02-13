import version from "consts:version";
import { initializeButton } from "./utils/button";
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
          maxLen: 20,
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
          notify: true,
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
  if (!isConnected) return blink(LED1, 3, 1000);
  blink(LED3, pressCount, 20);
  NRF.updateServices({
    0xbcde: {
      0xabcd: {
        value: pressCount.toString(),
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

  // Because the app uses what is essentially a change listener, we need to "clear" this service
  // channel by resetting it to 0. This is a little imprecise - instead, we could do something like
  // broadcast a serialised message that includes the press count and a timestamp, but this is ok
  // for now.
  setTimeout(() => {
    NRF.updateServices({
      0xbcde: {
        0xabcd: {
          value: "0",
          notify: true,
        },
      },
    });
  }, 2000);
}

function broadcastButtonLongPress() {
  if (!isConnected) return blink(LED1, 3, 1000);
  blink(LED3, 1, 1000);

  NRF.updateServices({
    0xbcde: {
      0xabcd: {
        value: "long",
        notify: true,
      },
    },
  });
}

resetServices();

NRF.setConnectionInterval(80);
NRF.on("disconnect", handleDisconnect);
NRF.on("connect", handleConnect);
