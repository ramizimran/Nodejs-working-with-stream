import fs from "fs";
import { Duplex } from "node:stream";

class DuplexEmAll extends Duplex {
  constructor({
    writableHighWaterMark,
    readableHighWaterMark,
    readFileName,
    writeFileName,
  }) {
    super({
      writableHighWaterMark,
      readableHighWaterMark,
    });
    this.readFileName = readFileName;
    this.writeFileName = writeFileName;
    this.readFd = null;
    this.writeFd = null;
    this.chunks = [];
    this.chunksSize = 0;
  }

  _construct(callback) {
    fs.open(this.readFileName, "r", (err, readFd) => {
      if (err) return callback(err);
      this.readFd = readFd;
      fs.open(this.writeFileName, "w", (err, writeFd) => {
        if (err) return callback(err);
        this.writeFd = writeFd;
        callback();
      });
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        this.chunks = [];
        this.chunksSize = 0;
        callback();
      });
    } else {
      callback();
    }
  }

  _read(size) {
    const buff = Buffer.alloc(size);
    fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);
      // null is to indicate the end of the stream
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _final(callback) {
    fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);
      this.chunks = [];
      callback();
    });
  }

  _destroy(err, callback) {
    fs.close(this.readFd, () => {
      fs.close(this.writeFd, () => {
        callback(err);
      });
    });
  }
}

const duplex = new DuplexEmAll({
  readFileName: "read.txt",
  writeFileName: "write.txt",
});

duplex.write(Buffer.from("this is a string 0"));
duplex.write(Buffer.from("this is a string 1"));
duplex.write(Buffer.from("this is a string 2"));
duplex.write(Buffer.from("this is a string 3"));

duplex.end();

duplex.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
});
