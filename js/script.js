
var app = require('http').createServer(handler),
     io = require('socket.io').listen(app),
     fs = require('fs'),
   five = require('johnny-five'), board, lcd;

  var ports = [
      { id: "mega", port: "/dev/cu.usbmodem1411" }, // this[0]
      { id: "motor", port: "/dev/cu.usbmodem411" } // this[1]
    ];
    

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

board = new five.Board();

board.on("ready", function() {
  board: this[1]

  led = new five.Led(13);
  servo = new five.Servo(6);
lcd = new five.LCD({
  pins: [7, 8, 9, 10, 11, 12],
  backlight: 6,
  rows: 2,
  cols: 20
});

   this.repl.inject({
    board: this[1],
    lcd: lcd
  });

  var stepper = new five.Stepper({
   board: this[0],
    type: five.Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: 9,
      dir: 8
    }
  });

  io.sockets.on('connection', function (socket) {
console.log("Here");
  
    
    socket.on('party', function() {
      lcd.cursor(0,0);
        lcd.clear().print("Nice party!");
    });
    socket.on('jeeej', function() {
      lcd.cursor(1, 0);
        lcd.clear().print("Jeeeejjj!");
    });

    socket.on('DISCO', function () {
  // Make 10 full revolutions counter-clockwise at 180 rpm with acceleration and deceleration
  stepper.rpm(50).ccw().accel(800).decel(800).step(98, function() {

    console.log("Done moving CCW");

    // once first movement is done, make 10 revolutions clockwise at previously
    //      defined speed, accel, and decel by passing an object into stepper.step
    stepper.step({
      steps: 100,
      direction: five.Stepper.DIRECTION.CW
    }, function() {
      console.log("Done moving CW");
});
});
    });

  });

  

  
});

