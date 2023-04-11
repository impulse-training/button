// When we click the connect button...
// fetch("https://button.impulse.training/latest.js")
//     .then((response) => response.text())
//     .then((firmware) => window.FIRMWARE = firmware);

// const FIRMWARE = `
//   var e="0.4";function t(e,t,n){for(var a=0;a<t;a++)setTimeout(function(){e.write(!0)},2*n*a+1),setTimeout(function(){e.write(!1)},2*n*a+n)}function n(){NRF.setAdvertising({},{name:"Impulse"})}var a=2500,i=500,u=0,o=null,r=null,c=!1,f=!1;function l(){r=setTimeout(function(){c=!0},a)}function s(){clearTimeout(r),c?c=!1:(u+=1,o&&clearTimeout(o),o=setTimeout(function(){v(Number(u.toString())),u=0,o=null},i))}function d(){LED3.write(!1),t(LED1,5,20),f=!1,m()}function b(){t(LED3,3,20),f=!0}function m(){NRF.setServices({48350:{43981:{maxLen:50,readable:!0,notify:!0,value:null},61166:{maxLen:20,readable:!0,broadcast:!0,value:e}},6159:{10777:{readable:!0,broadcast:!0,value:[Puck.getBatteryPercentage()]}}},{advertise:["0000bcde-0000-1000-8000-00805f9b34fb","0000180f-0000-1000-8000-00805f9b34fb"]})}function v(e){if(t(LED3,e,150),!f)return t(LED1,3,1e3);setTimeout(function(){NRF.updateServices({48350:{43981:{value:JSON.stringify({p:e,t:Math.round((new Date).getTime()/1e3)}),readable:!0,notify:!0}},6159:{10777:{value:[Puck.getBatteryPercentage()],readable:!0,notify:!0}}})},100)}n(),setWatch(s,BTN,{edge:"falling",repeat:!0,debounce:10}),setWatch(l,BTN,{edge:"rising",repeat:!0,debounce:10}),m(),NRF.setConnectionInterval(7),NRF.on("disconnect",d),NRF.on("connect",b);
// `

const FIRMWARE = `LED1.write(true);`

document.getElementById("btnConnect").addEventListener("click", function () {
  $("#pb_div").show();

  Puck.write("reset();", function () {
    $("#progress_bar").removeClass("bg-success");
    Puck.setTime();
    Puck.write(FIRMWARE, function () {
      console.log("connected and installed 1button");
      $("#pb_div").hide();
    });
  });
});
