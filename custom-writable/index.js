import fs, { write } from "node:fs";
import { Writable } from "node:stream";

class WriteEmAll extends Writable {
  constructor({ highWaterMark, filename }) {
    super({ highWaterMark });
    this.filename = filename;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.writeCounts = 0;
  }

  //   * MUST IMPLEMENT THOSE SPECIFIC FUNCTIONS
  //   * _ write(chunk, encoding, callback)
  //   * _ writev(chunks, callback)
  //   * _ final(callback)

  //   This wilt run after the constructor, and it will put off all calling the other functions until the file is opened/ call the callback
  _construct(callback) {
    fs.open(this.filename, "w", (error, fd) => {
      if (error) {
        callback(error);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    // console.log("fd", this.fd);

    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (error) => {
        if (error) {
          callback(error);
        } else {
          this.chunks = [];
          this.chunksSize = 0;
          ++this.writeCounts;
          callback();
        }
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (error) => {
      if (error) {
        callback(error);
      } else {
        ++this.writeCounts;
        this.chunks = [];
        callback();
      }
    });
  }

  _destroy(error, callback) {
    console.log("number of writes: ", this.writeCounts);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

try {
  const customWriteStream = new WriteEmAll({
    highWaterMark: 1800,
    filename: "test.txt",
  });

  const readStream = fs.createReadStream("../readable-streams/write.txt", {
    highWaterMark: 1800,
  });

  readStream.on("data", (chunk) => {
    if (!customWriteStream.write(chunk)) {
      readStream.pause();
    }
  });

  customWriteStream.on("drain", () => {
    readStream.resume();
  });

  readStream.on("end", () => {
    console.log("Nothing to read");
    customWriteStream.end();
  });

  customWriteStream.on("finish", () => {
    console.log("Write complete");
  });
} catch (error) {
  console.log(error);
}
