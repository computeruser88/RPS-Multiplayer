var database = firebase.database();

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var rpsRef = database.ref().child("rps");
var chatRef = database.ref().child("chat");

connectedRef.on("value", function (snapshot) {
    if (snapshot.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
    }
});

connectionsRef.on("value", function (snapshot) {
    if (snapshot.numChildren() === 2) {
        // start game only if there are 2 players
    }
});



var player = [{
    name: "Player 1",
    choice: "",
    wins: 0,
    losses: 0
},
{
    name: "Player 2",
    choice: "",
    wins: 0,
    losses: 0
}];
var name = "";

database.ref().on("value", function (snapshot) {
    if (snapshot.child("rps").exists()) {
        console.log(snapshot.val().rps.player1name);
        console.log(snapshot.val().rps.player1choice);
        console.log(snapshot.val().rps.player1wins);
        console.log(snapshot.val().rps.player1losses);
        console.log(snapshot.val().rps.player2name);
        console.log(snapshot.val().rps.player2choice);
        console.log(snapshot.val().rps.player2wins);
        console.log(snapshot.val().rps.player2losses);

        $("#player-1-name").text(snapshot.val().player1name);
        $("#player-1-choice").text(snapshot.val().player1choice);
        $("#player-1-wins").text(snapshot.val().player1wins);
        $("#player-1-losses").text(snapshot.val().player1losses);
        $("#player-2-name").text(snapshot.val().player2name);
        $("#player-2-choice").text(snapshot.val().player2choice);
        $("#player-2-wins").text(snapshot.val().player2wins);
        $("#player-2-losses").text(snapshot.val().player2losses);
    } else {
        var rpsRef = database.ref().child("rps");
        rpsRef.player1name = "";
        rpsRef.player1choice = "";
        rpsRef.player1wins = 0;
        rpsRef.player1losses = 0;
        rpsRef.player2name = "";
        rpsRef.player2choice = "";
        rpsRef.player2wins = 0;
        rpsRef.player2losses = 0;
    }
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
    if (rpsRef.player1name !== "") {
        database.ref().set({
            player1name: name
        });
        $("#player-1-name").text(name);
        $("#hello-message-section").text("Hi " + name + "! You are player 1.")
    } else {
        database.ref().set({
            player2name: name
        });
        $("#player-2-name").text(name);
        $("#hello-message-section").text("Hi " + name + "! You are player 2.")
    }
});
