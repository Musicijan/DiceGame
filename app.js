let connectionAttempts = 0;
let sendLastRolls = 0;
let ws;
let username = '';
function connectWS() {
   // set up WSS connection
   ws = new WebSocket('ws://localhost:3069/');
   // ws = new WebSocket('ws://web-who:3069/');

   ws.onopen = () => {
      console.log("Socket opened.");
      ws.send(JSON.stringify({ command: "get_scores" }));
   }

   ws.onerror = (error) => {
      console.log(error);
      try {
         if (connectionAttempts < 10) {
            connectionAttempts++;
            connectWS();
         }
      }
      catch (error) {
         console.log(error);
      }
   }

   ws.onmessage = (message) => {
      console.log(message);
      let msgObj = JSON.parse(message.data);
      switch (msgObj.command) {
         case "score_update":
            showAllScores(msgObj.data);
            break;
         case "chat_message":
            let originIP = msgObj.originIP;

            let color = msgObj.color;

            let messageText = msgObj.message;

            let date = new Date();
            let newLine = `<p class="message" style="border: 2px solid ${color};">${msgObj.user || "Anonymous"}: ${messageText}</p>`;
            // let newLine = `<p style="border: 2px solid ${color};">${date.toLocaleTimeString()}  | ${msgObj.user} | ${messageText}</p>`;
            $("#message-box").prepend(newLine);
            break;
         case "error":
            // code 0 = Too many dice submitted
            if (msgObj.code === 0) {
               reset(false);
               ws.send(JSON.stringify({ command: "get_scores" }));
            }
            alert(msgObj.message);
            break;
      }
      console.log(msgObj);
   }
}

connectWS();

$(document).ready(() => {
   initalizeChat(ws);
   $('#player-input').on('submit', function (e) {
      e.preventDefault();
      submitName();
  });
});

function submitName() {
   try {
      let name = document.getElementById('userName').value;
      if(name != '') {
         ws.send(JSON.stringify({
            command: "add_player",
            user: document.getElementById('userName').value,
            color: selectedColor
         }));
         
         $('#userName').attr('readonly', true);
         username = document.getElementById('userName').value;
      } else {
         alert("Input a value.");
      }
   } catch (error) {
      console.log(error);
   }
}