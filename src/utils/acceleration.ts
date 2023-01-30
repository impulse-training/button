// Ten minutes
const TIMEOUT_DURATION = 60 * 1000 * 10;

require("puckjsv2-accel-movement").on({ threshold: 10 });

const g = global as any;

// When motion is detected, we check the time that we last woke up. If it's more than 30 minutes ago
// then we wake up. Otherwise

export function initializeAccelerometer(
  onWake: () => void,
  onSleep: () => void
) {
  g.idleTimeout = null;

  // There's a strange glitch where a motion event is fired directly after enabling the
  // accelerometer. We throw this event away using this global flag.
  g.throwawayMovementEvent = true;
  g.lastWokeAtSeconds = 0;

  Puck.on("accel", function () {
    if (g.idleTimeout) {
      clearTimeout(g.idleTimeout);
    } else {
      if (g.throwawayMovementEvent) {
        g.throwawayMovementEvent = false;
        return;
      }

      const timeSeconds = new Date().getTime() / 1000;
      if (timeSeconds - g.lastWokeAtSeconds < 30 * 60) return;

      g.lastWokeAtSeconds = timeSeconds;
      onWake();
    }

    g.idleTimeout = setTimeout(
      function () {
        g.idleTimeout = null;
        onSleep();
      },
      g.throwawayMovementEvent ? 3000 : TIMEOUT_DURATION
    );
  });
}

// import { blink } from "./leds";

// const accelMovement = require("puckjsv2-accel-movement");

// // We only want to enable movement detection periodically;
// var idleTimeout: NodeJS.Timeout | null = null;

// var accelState: "idle" | "active" = "idle";

// // After a minute,
// const IDLE_TIMEOUT = 1000 * 5; // * 60;

// export function initializeAccelerometer(
//   onWake: () => void,
//   onSleep: () => void
// ) {
//   var n = 0;

//   function enableTracking() {
//     n = 0;
//     accelMovement.on({ duration: 2000, threshold: 15 });
//   }

//   function disableTracking() {
//     accelMovement.off();
//   }

//   enableTracking();

//   Puck.on("accel", function (a) {
//     console.log({ a });

//     if (idleTimeout) {
//       clearTimeout(idleTimeout);
//     } else {
//       print("Motion", a);

//       disableTracking();

//       setTimeout(() => {
//         // Start tracking again after 10 seconds
//         enableTracking();
//       }, 5000);

//       onWake();
//     }

//     idleTimeout = setTimeout(function () {
//       idleTimeout = null;
//       onSleep();
//     }, IDLE_TIMEOUT);
//   });
// }
