const accel = require("puckjsv2-accel-movement");

const g = global as any;

// When motion is detected, call the onMotionEvent timer
export function initializeAccelerometer(onMotionEvent: () => void) {
  // There's a strange glitch where a motion event is fired directly after enabling the
  // accelerometer. We throw this event away using this global flag.
  g.throwAwayMovementEvents = true;

  accel.on({ threshold: 10 });

  setTimeout(() => {
    g.throwAwayMovementEvents = false;
  }, 1000);

  Puck.on("accel", function () {
    if (g.throwAwayMovementEvents) {
      return;
    }

    onMotionEvent();
    accel.off();
  });
}
