export const MODES = {
  // The impulse button is being worn actively by the user, detected by the accelerometer
  active: {
    advertisingData: [0x03, 0x03, 0xdd, 0xbc],
    sixteenBit: "0000bcdd-0000-1000-8000-00805f9b34fb",
  },
  // These numbered channels indicate a sequence of button presses
  // The user has pressed the button once; activating impulse mode:
  [1]: {
    advertisingData: [0x03, 0x03, 0xde, 0xbc],
    sixteenBit: "0000bcde-0000-1000-8000-00805f9b34fb",
  },
  // The user has pressed the button twice in a row, three times in a row, etc
  [2]: {
    advertisingData: [0x03, 0x03, 0xe2, 0xbc],
    sixteenBit: "0000bce2-0000-1000-8000-00805f9b34fb",
  },
  [3]: {
    advertisingData: [0x03, 0x03, 0xe3, 0xbc],
    sixteenBit: "0000bce3-0000-1000-8000-00805f9b34fb",
  },
  [4]: {
    advertisingData: [0x03, 0x03, 0xe4, 0xbc],
    sixteenBit: "0000bce4-0000-1000-8000-00805f9b34fb",
  },
  [5]: {
    advertisingData: [0x03, 0x03, 0xe5, 0xbc],
    sixteenBit: "0000bce5-0000-1000-8000-00805f9b34fb",
  },
  // This mode represents a long-press of the button
  longPress: {
    advertisingData: [0x03, 0x03, 0xdf, 0xbc],
    sixteenBit: "0000bcdf-0000-1000-8000-00805f9b34fb",
  },
};

export function setDeviceName() {
  NRF.setAdvertising({}, { name: "Impulse" });
}

export function setServices(mode: keyof typeof MODES) {
  const { advertisingData } = MODES[mode];

  // NRF.setServices({
  //   [string]: {
  //     // The characteristic ID is currently not used
  //     abcd: {
  //       value: "Impulse",
  //       description: "Impulse mode",
  //       readable: true,
  //       notify: true,
  //       indicate: true,
  //     },
  //   },
  // });

  const data = getAdvertisingDataBinary([advertisingData]);
  NRF.setAdvertising(data);
  NRF.wake();
}

// For now, we pass in raw bytes to this method
function getAdvertisingDataBinary(byteArrays: Array<Array<number>>) {
  const out = [0x02, 0x01, 0x06];

  // Push binary strings into the output string of hex bytes
  byteArrays.forEach((ary) => ary.forEach((byte) => out.push(byte)));

  return [out] as any;
}
