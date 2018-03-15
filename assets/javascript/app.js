// Initialize Firebase
var config = {
    apiKey: "AIzaSyB_Z3QP7CH95uVe5HnFRP49wR6PzzQuGAo",
    authDomain: "rps-multiplayer-1d8cf.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-1d8cf.firebaseio.com",
    projectId: "rps-multiplayer-1d8cf",
    storageBucket: "",
    messagingSenderId: "563863947172"
};

firebase.initializeApp(config);

var database = firebase.database();

firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + " " + errorMessage);
    // ...
});

var playersRef = database.ref().child("/players/");
var chatRef = database.ref().child("/chatroom/");
var yourName;
var move;
var user = firebase.auth().currentUser;

var player = [{
    name: "",
    choice: "",
    wins: 0,
    losses: 0,
    ties: 0
},
{
    name: "",
    choice: "",
    wins: 0,
    losses: 0,
    ties: 0
}];

database.ref('/players/').on("value", function (snapshot) {
    if (snapshot.child('player1').exists()) {
        player[0] = snapshot.val().player1;
        $("#player-1-name").text(player[0].name);
        $("#player-1-wins").text(player[0].wins);
        $("#player-1-losses").text(player[0].losses);
        $("#player-1-ties").text(player[0].ties);
    } else {
        // no player 1
        $("#player-1-name").text("Waiting for player 1");
    }
    if (snapshot.child('player2').exists()) {
        player[1] = snapshot.val().player2;
        $("#player-2-name").text(player[1].name);
        $("#player-2-wins").text(player[1].wins);
        $("#player-2-losses").text(player[1].losses);
        $("#player-2-ties").text(player[1].ties);
    } else {
        // no player 2
        $("#player-2-name").text("Waiting for player 2");
    }

    if (!snapshot.child('player1').exists() && !snapshot.child('player2').exists()) {
        $("#chat-area").empty();
        $("#move-section").empty();
        database.ref('/move/').remove()
        database.ref('/chatroom/').remove();
    }
});



$("#start-button").on("click", function (event) {
    event.preventDefault(); // don't refresh the page
    yourName = $('input[type=text]#player-name').val().trim();
    yourName = yourName.substring(0, 25);
    console.log(yourName);
    if (yourName !== "" && player[0].name === "" && player[1].name === "") {
        // add player 1
        player[0] = {
            name: yourName,
            choice: "",
            wins: 0,
            losses: 0,
            ties: 0,
        }
        database.ref().child('/players/player1').set(player[0]);
        database.ref().child('/players/player1').onDisconnect().remove();
    } else if (player[0].name !== "" && player[1].name === "") {
        // add player 2
        player[1] = {
            name: yourName,
            choice: "",
            wins: 0,
            losses: 0,
            ties: 0
        }
        database.ref().child('/players/player2').set(player[1]);
        database.ref().child('/players/player2').onDisconnect().remove();
    }
    database.ref().child('/move/').set(1);
    move = 1;
});


database.ref("/players/").on("child_added", function (snapshot) {
    var chatMessage = snapshot.val().name + " is now connected.\n";
    $("#chat-area").append(chatMessage);
});

database.ref("/players/").on("child_removed", function (snapshot) {
    var chatMessage = snapshot.val().name + " is now disconnected\n";
    $("#chat-area").append(chatMessage);
});

database.ref("/move/").on("value", function (snapshot) {
    if (snapshot.val() === 1) {
        // player 1's move
        $("#move-section").html("Waiting for " + player[0].name + "'s move.");
    } else if (snapshot.val() === 2) {
        // player 2's move
        $("#move-section").html("Waiting for " + player[1].name + "'s move.");
    }
});

$("#send-button").on("click", function (event) {
    event.preventDefault();
    var message = $("#chat-message").val().trim();
    if (message !== "") {
        database.ref().child("/chatroom/").set(message);
    }
})

database.ref("/chatroom/").on("value", function (snapshot) {
    var message = snapshot.val();
    if (message !== null) {
        $("#chat-area").append(message + "\n");
    }
});

$("#player-1-choice").on("click", ".choice", function (event) {
    event.preventDefault();
    console.log("player 1 chooses");
    if (move === 1) {
        player[0].choice = event.target.id;

        $(this).addClass("selected");
        console.log(player[0].choice);

        database.ref().child("/players/player1/choice/").set(player[0].choice);
        move = 2;
        database.ref("/move/").set(move);
    }
})

$("#player-2-choice").on("click", ".choice", function (event) {
    event.preventDefault();
    console.log("player 2 chooses");
    if (move === 2) {
        player[1].choice = event.target.id;

        $(this).addClass("selected");
        console.log(player[1].choice);

        database.ref().child("/players/player2/choice/").set(player[1].choice);
        database.ref("/move/").remove();
        getResult();
        move = 1;
    }
})

function getResult() {
    if (player[0].choice === "player-1-rock") {
        if (player[1].choice === "player-2-rock") {
            $("#move-section").text("Two rocks.\nIt's a draw!");
            $("#player-1-rock").removeClass("selected");
            $("#player-2-rock").removeClass("selected");
            database.ref().child("/players/player1/ties").set(++player[0].ties);
            database.ref().child("/players/player2/ties").set(++player[1].ties);
        } else if (player[1].choice === "player-2-paper") {
            $("#player-1-rock").removeClass("selected");
            $("#player-2-paper").removeClass("selected");
            $("#move-section").text("Paper covers rock.\n" + player[1].name + " wins!");
            database.ref().child("/players/player1/losses/").set(++player[0].losses);
            database.ref().child("/players/player2/wins/").set(++player[1].wins);
        } else if (player[1].choice === "player-2-scissors") {
            $("#player-1-rock").removeClass("selected");
            $("#player-2-scissors").removeClass("selected");
            $("#move-section").text("Rock crushes scissors.\n" + player[0].name + " wins!");
            database.ref().child("/players/player1/wins/").set(++player[0].wins);
            database.ref().child("/players/player2/losses/").set(++player[1].losses);
        }
    } else if (player[0].choice === "player-1-paper") {
        if (player[1].choice === "player-2-rock") {
            $("#player-1-paper").removeClass("selected");
            $("#player-2-rock").removeClass("selected");
            $("#move-section").text("Paper covers rock.\n" + player[0].name + " wins!");
            database.ref().child("/players/player1/wins/").set(++player[0].wins);
            database.ref().child("/players/player2/losses/").set(++player[1].losses);
        } else if (player[1].choice === "player-2-paper") {
            $("#player-1-paper").removeClass("selected");
            $("#player-2-paper").removeClass("selected");
            $("#move-section").text("Both play paper.\nIt's a draw!");
            database.ref().child("/players/player1/ties/").set(++player[0].ties);
            database.ref().child("/players/player2/ties/").set(++player[1].ties);
        } else if (player[1].choice === "player-2-scissors") {
            $("#player-1-paper").removeClass("selected");
            $("#player-2-scissors").removeClass("selected");
            $("#move-section").text("Scissors cut paper.\n" + player[1].name + " wins!");
            database.ref().child("/players/player1/losses/").set(++player[0].losses);
            database.ref().child("/players/player2/wins/").set(++player[1].wins);
        }
    } else if (player[0].choice === "player-1-scissors") {
        if (player[1].choice === "player-2-rock") {
            $("#player-1-scissors").removeClass("selected");
            $("#player-2-rock").removeClass("selected");
            $("#move-section").text("Rock crushes scissors.\n" + player[1].name + " wins!");
            database.ref().child("/players/player1/losses").set(++player[0].losses);
            database.ref().child("/players/player2/wins").set(++player[1].wins);
        } else if (player[1].choice === "player-2-paper") {
            $("#player-1-scissors").removeClass("selected");
            $("#player-2-paper").removeClass("selected");
            $("#move-section").text("Scissors cut paper.\n" + player[0].name + " wins!");
            database.ref().child("/players/player1/wins/").set(++player[0].wins);
            database.ref().child("/players/player2/losses/").set(++player[1].losses);
        } else if (player[1].choice === "player-2-scissors") {
            $("#player-1-scissors").removeClass("selected");
            $("#player-2-scissors").removeClass("selected");
            $("#move-section").text("Both play scissors.\nIt's a draw!");
            database.ref().child("/players/player1/ties/").set(++player[0].ties);
            database.ref().child("/players/player2/ties/").set(++player[1].ties);
        }
    }
    setTimeout(function () {
        $("#move-section").empty();
        move = 1;
        database.ref().child('/move/').set(1);
    }, 5000);
}