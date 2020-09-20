const express = require('express');
const port = 8080;
const app = express();
let browser;

app.listen(port, async()=>{
    console.log('test')
})

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });


app.get('/stream', (req, res) => {
    console.log('request received');
    res.writeHead(200, {
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
    setInterval(async () => {
      res.write('event: ping\n');  // added these
      res.write(`data: ${JSON.stringify({ hasUnread: true })}`);
      res.write("\n\n");
    }, 5000);
  });