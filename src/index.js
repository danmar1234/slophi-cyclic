const express = require("express");
const app = new express();
const ytdl = require("ytdl-core");
const port = process.env.PORT || 5000;
app.use(express.static(__dirname));

const AudioStream = async (req, res) => {
  try {
    const url = req.query.URL;

    const videoInfo = await ytdl.getInfo(url);
    let audioFormat = ytdl.chooseFormat(videoInfo.formats, {
      filter: 'audioonly'
    });

    const { itag, container, contentLength } = audioFormat;

    const rangeHeader = req.headers.range || null;
    const rangePosition = rangeHeader
      ? rangeHeader.replace(/bytes=/, "").split("-")
      : null;
    const startRange = rangePosition ? parseInt(rangePosition[0], 10) : 0;
    const endRange =
      rangePosition && rangePosition[1].length > 0
        ? parseInt(rangePosition[1], 10)
        : contentLength - 1;
    const chunksize = endRange - startRange + 1;

    res.writeHead(206, {
      "Content-Type": `audio/${container}`,
      "Content-Length": chunksize,
      "Content-Range":
        "bytes " + startRange + "-" + endRange + "/" + contentLength,
      "Accept-Ranges": "bytes"
    });

    const range = { start: startRange, end: endRange };
    const audio = ytdl(url, {
      filter: (format) => format.itag === itag,
      range
    });

    audio.pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

app.get("/direct-url", AudioStream);

/*



      filter: "audioonly",
      quality: "highestaudio"





app.get("/direct-url", (req, res) => {
  const url = req.query.URL;
  const audio = ytdl(url, {
    format: "webm",
    quality: "highest"
  });
  const contentLength = audio;
  const rangeHeader = req.headers.range || null;
  const rangePosition = rangeHeader
    ? rangeHeader.replace(/bytes=/, "").split("-")
    : null;
  console.log(`rangePosition`, rangePosition);
  const start = rangePosition ? parseInt(rangePosition[0], 10) : 0;
  const end =
    rangePosition && rangePosition[1].length > 0
      ? parseInt(rangePosition[1], 10)
      : contentLength - 1;
  const chunksize = end - start + 1;
  res.writeHead(206, {
    "Content-Range": "bytes " + start + "-" + end + "/" + contentLength,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": "audio/webm"
  });
  audio.pipe(res);
});










app.get("/direct-url", (req, res) => {
  const url = req.query.URL;
  const options = ["--get-url", "-f 249"];

  youtubedl.getInfo(url, options, function (err, info) {
    if (err) throw err;
    const response = info.url;
    res.json(response);
  });
});
*/

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/index.html", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => console.log("Ready!"));
