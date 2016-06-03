var
	express = require('express'),
	app = express(),
	io = require('socket.io').listen(app.listen(3000)),
	hbs = require('hbs');

app.engine('html', hbs.__express);
app.set('view engine', 'hbs');
app.set('views', './');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('JsPoker.html');
});

io.on('connection', function(socket) {

  socket.once('action', function() {
    var tournament = require('./test/tournament')
        , MachinePoker = require('./machine-poker')
        , ChallBot = require('./players/liveBot')
        , challenger = MachinePoker.seats.Live.create(ChallBot, null, socket)
        , webNarrator = MachinePoker.observers.webNarrator(socket, challenger.name);

    var table = tournament.createTable(challenger, {hands:500});
    table.addObserver(webNarrator);
    table.start();
  });
});
