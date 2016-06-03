module.exports = function (socket) {

  var info = {
    name: "Player",
    email: "",
    btcWallet: ""
  };

  function update(game, callback, socket) {

    if (socket) {
      if (game.state !== "complete") {

        socket.emit('message', JSON.stringify(game, null, 3));

        socket.once('action', function(data) {
            if (data == "call") {
              return callback(null, game.betting.call);
            } else if (data == "raise") {
              return callback(null, game.betting.raise);
            } else if (data == "fold") {
              return callback(null, 0);
            } else {
              //Raise custom amount
              var amount = parseInt(data);

              if (typeof amount === 'number' && amount >= game.betting.raise)
                return callback(null, amount);
              else
                return callback(null, game.betting.raise);
            }
        });
      } else {
        return callback(null, null);
      }
    } else {
        if (game.state !== "complete")
          return callback(null, game.betting.call);
    }
  }

  if (socket)
    return { update: update, info: info, socket: socket }
  else
    return { update: update, info: info }
}
