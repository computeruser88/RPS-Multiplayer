var database = firebase.database();

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snapshot) {
    if (snapshot.val()){
      var con = connectionsRef.push(true);
      con.onDisconnect().remove();
    }
  });

connectionsRef.on("value", function(snapshot) {
    if (snapshot.numChildren() === 2){
        // start game only if there are 2 players
    }
  })

var player = [{
    name: "Waiting for player 1",
    choice: "",
    chatComment: "",
    wins: 0,
    losses: 0
},
{
    name: "Waiting for player 2",
    choice: "",
    chatComment: "",
    wins: 0,
    losses: 0
}];
var name = "";
var playerIndex = 0;

database.ref().on("value", function (snapshot) {
    console.log(snapshot.val().player1name);
    console.log(snapshot.val().player1choice);
    console.log(snapshot.val().player1chatComment);
    console.log(snapshot.val().player1wins);
    console.log(snapshot.val().player1losses);
    console.log(snapshot.val().player2name);
    console.log(snapshot.val().player2choice);
    console.log(snapshot.val().player2chatComment);
    console.log(snapshot.val().player2wins);
    console.log(snapshot.val().player2losses);
    $("#player-1-name").text(snapshot.val().player1name);
    $("#player-1-choice").text(snapshot.val().player1choice);
    $("#player-1-comment").text(snapshot.val().player1chatComment);
    $("#player-1-wins").text(snapshot.val().player1wins);
    $("#player-1-losses").text(snapshot.val().player1losses);
    $("#player-2-name").text(snapshot.val().player2name);
    $("#player-2-choice").text(snapshot.val().player2choice);
    $("#player-2-comment").text(snapshot.val().player2chatComment);
    $("#player-2-wins").text(snapshot.val().player2wins);
    $("#player-2-losses").text(snapshot.val().player2losses);
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

$("#start-button").on("click", function (event) {
    event.preventDefault(); // don't refresh the page
    name = $('input[type=text]#player-name').val().trim();
    if (name === "") {
        name = "Player " + (playerIndex + 1);
    }
    if (name.length > 20) {
        name = name.substring(0, 20);
    }
    console.log(name);
    if (playerIndex === 0) {
        database.ref().set({
            player1name: name
        });
        $("#player-1-name").text(name);
        playerIndex++;
    } else if (database.ref().player1name !==  "") {
        database.ref().set({
            player2name: name
        });
        $("#player-2-name").text(name);
    }
});
