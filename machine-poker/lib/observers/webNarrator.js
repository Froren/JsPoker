function init(socket, webPlayer) {

  var WebNarrator = {};

  function actionString (action, bet) {
    switch (action) {
      case 'bet':
        return 'bet $' + bet;
      case 'raise':
        return 'raised by $' + bet;
      case 'fold':
        return 'folded';
      case 'allIn':
        return 'went ALL IN with $' + bet;
      case 'call':
        return 'called $' + bet;
      case 'check':
        return 'checked';
    }
  };

  WebNarrator.roundStart = function (status) {
    //nobody cares
    return true;
  };

  WebNarrator.betAction = function (player, action, bet, err) {
    socket.emit('narration', player.name + " " + actionString(action, bet));
    return true;
  };

  WebNarrator.stateChange = function (status) {

    var blindsText = "", pot = 0;
      status.players.forEach(function(player) {

        if (status.state === 'pre-flop' && player.blind > 0)
          blindsText += player.name + " paid a blind of " + player.blind + "\n";

        if (player.wagered > 0)
          pot += player.wagered;

      });

      socket.emit('narration', blindsText + "Pot is: " + pot);

    return true;
  };

  WebNarrator.complete = function (status) {
    var outputText = "Round " + status.hand + " complete. Board was: ";

    status.community.forEach(function(card) {
      outputText += card + " ";
    });

    outputText += "\n";

    if (status.winners.length > 1) {
      outputText += "Winners are:\n";

      status.winners.forEach(function(winner) {
        outputText += status.players[winner.position].name + " with " + status.players[winner.position].handName + ". Amount won: " + winner.amount + "\n"
      });
    } else {
      var winningPlayer = status.players[status.winners[0].position]
      var handName = winningPlayer.handName ? " with " + winningPlayer.handName : "";

      outputText += "Winner was " + status.players[status.winners[0].position].name + handName + ". Amount won: " + status.winners[0].amount + "\n";
    }

    outputText += "Positions: \n";

    var playerEliminated = false;
    status.players.forEach(function(player) {
      var cardString = "";

      if (player.name === webPlayer && player.chips === 0)
        playerEliminated = true;

      if (player.cards) {
        player.cards.forEach(function(card) {
          cardString += card + " ";
        });
      }

      var handName = player.handName ? player.handName : "";

      outputText += player.name + " (" + player.chips + ") had " + cardString + " " + handName + "\n";
    });

    outputText += "\n";

    socket.emit('narration', outputText);

    if (playerEliminated)
      socket.emit('eliminated', webPlayer);

    return true;
  };

  return WebNarrator;
}

module.exports = init;
