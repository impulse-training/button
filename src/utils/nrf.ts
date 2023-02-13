export function setDeviceName() {
  NRF.setAdvertising({}, { name: "Impulse" });
}

// For now, we pass in raw bytes to this method
export function getAdvertisingDataBinary(byteArrays: Array<Array<number>>) {
  const out = [0x02, 0x01, 0x06];

  // Push binary strings into the output string of hex bytes
  byteArrays.forEach((ary) => ary.forEach((byte) => out.push(byte)));

  return [out] as any;
}
