// When the puck is picked up, start transmitting the active service
// When the button is pressed once, start transmitting the impulseMode service
// When the button is pressed with a long press, start transmitting the rescueMode service

import { initializeAccelerometer } from "./utils/acceleration";
import { initializeButton } from "./utils/button";
import { blink } from "./utils/leds";
import { setDeviceName, setServices } from "./utils/nrf";

declare global {
  var debugMode: boolean;
}

global.debugMode = false;

var mode: "idle" | "active" | "press" | "longPress" = "idle";
var isConnected = false;
var connectedAddresses: string[] = [];

setDeviceName();

function transitionToActiveMode() {
  mode = "active";
  setServices(mode);
  blink(LED3, 6, 20);
}

function transitionToIdleMode() {
  mode = "idle";
  NRF.sleep();
}

// The button has been pressed, so we broadcast this over bluetooth. We transmit a different UUID
// for the number of times the button was pressed. This would certainly be "better" with the number
// of presses simply encoded as a characteristic value, but I've found this approach simpler, as we
// don't need to do characteristic discovery. It will do for now.
function broadcastButtonPress(pressCount: number) {
  mode = "press";
  if (pressCount < 2) setServices(1);
  else if (pressCount < 6) setServices(pressCount as 2 | 3 | 4 | 5);
  blink(LED2, 6, 20);
}

function broadcastLongPress() {
  mode = "longPress";
  setServices("longPress");
  blink(LED1, 12, 20);
}

const onWake = () => {
  if (mode === "idle") {
    transitionToActiveMode();
    blink(LED2, 6, 20);
  }
};

const onSleep = () => {
  if (mode === "active") transitionToIdleMode();
};

initializeAccelerometer(onWake, onSleep);
initializeButton(broadcastButtonPress, broadcastLongPress);

function handleConnect(addr: string) {
  isConnected = true;

  if (!connectedAddresses.includes(addr)) {
    // This is a little bit of visual feedback to show the first connection to a new device
    blink(LED3, 10, 20);
    connectedAddresses.push(addr);
  }
}

function handleDisconnect() {
  isConnected = false;
  mode = "idle";
  NRF.sleep();

  if (global.debugMode) {
    LED2.write(false);
    blink(LED1, 2, 250);
  }
}

NRF.on("disconnect", handleDisconnect);
NRF.on("connect", handleConnect);
