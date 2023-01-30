# Impulse espruino interface

People use [impulse](https://impulse.training) to overcome unwanted patterns of thinking and behavior, including things like nicotine, internet addiction, overspending, overeating, negative thoughts, gaming addiction, sex addiction, "trauma-loops" and other PTSD-related issues, repetitive body-focussed behaviors like biting nails, and more.

This repository contains the source code for our V1 impulse button, which is powered by [espruino](https://www.espruino.com/).

## Building code

We build code with `yarn build`, which compiles code and makes it available in `dist/impulse.js`.

## Deploying code

We deploy code onto buttons using the [Espruino IDE](https://www.espruino.com/ide/). In future, we will have code pre-deployed to buttons when they are manufactured.

1. `cat dist/impulse.js | pbcopy`
2. Paste the code into the [Espruino IDE](https://www.espruino.com/ide/)
3. Click the Deployment button to open the bluetooth device picker

![deployment button](/static/images/espruino-deploymnet-button.png)

4. Find the impulse button in the Bluetooth picker and connect to it. It may have a name like "Puck.js" if new, or "Impulse" if it has already been flashed
5. After the button has connected, the code will be loaded
6. Close the tab to close the connection
