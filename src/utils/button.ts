const LONG_PRESS_DELAY = 2500;
const SINGLE_PRESS_DELAY = 500;

var singlePressCounter = 0;
var singlePressTimeout: NodeJS.Timeout | null = null;
var longPressTimeout: NodeJS.Timeout | null = null;
var didLongPress = false;

export function initializeButton(
  onSinglePress: (count: number) => void,
  onLongPress: () => void
) {
  function handleButtonDown() {
    longPressTimeout = setTimeout(function () {
      onLongPress();
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
        onSinglePress(singlePressCounter);
        singlePressTimeout = null;
        singlePressCounter = 0;
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
}
