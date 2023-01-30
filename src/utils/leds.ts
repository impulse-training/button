var flashingTimeout: NodeJS.Timeout | null = null;

export function blink(led: any, times: number, frequency: number) {
  for (var i = 0; i < times; i++) {
    setTimeout(function () {
      led.write(true);
    }, frequency * 2 * i + 1);
    setTimeout(function () {
      led.write(false);
    }, frequency * 2 * i + frequency);
  }
}

export function startFlashing() {
  flashingTimeout = setInterval(function () {
    blink(LED2, 3, 20);
  }, 2000);
}

export function stopFlashing() {
  clearTimeout(flashingTimeout);
  flashingTimeout = null;
}
