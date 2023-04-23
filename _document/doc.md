# Stream

- [Nodejs `fs`](https://github.com/sizarcorpse/nodejs-working-with-fs-path-url/blob/main/document/fs.md)
- [Nodejs `path`](https://github.com/sizarcorpse/nodejs-working-with-fs-path-url/blob/main/document/path.md)
- [Nodejs `url`](https://github.com/sizarcorpse/nodejs-working-with-fs-path-url/blob/main/document/url.md)

## Terms

1. **File descriptor:** A file descriptor is a non-negative integer that is used to identify an open file. It is used by the operating system to keep track of all the files that are currently open by a process. The file descriptor is used to refer to the file in subsequent read and write operations.

2. **difference between async and sync and callback** : The difference between async and sync is that async is non-blocking and sync is blocking. The difference between callback and async is that callback is a function that is passed as an argument to another function and async is a function that takes a callback as an argument.

## Streams

1. **What is a stream?** : A stream is an abstract interface for working with streaming data in Node.js. Streams are pipes that let you easily read data from a source and pipe it to a destination.

2. **What is a readable stream?** : A readable stream is an abstraction for a source from which data is consumed.

3. **What is a writable stream?** : A writable stream is an abstraction for a destination to which data is written.

4. **What is a streaming data?** : Streaming data is data that is received or sent in small chunks over a period of time.

### Types of Streams

1. Writable Streams
2. Readable Streams
3. Duplex Streams
4. Transform Streams

## Writeable Streams | `fs.createWriteStream()`,`stream.write()`

- `stram.highWaterMark` : The `highWaterMark` property specifies the maximum number of bytes to store in the internal buffer before ceasing to read from the underlying resource. default value is 16kb.
- `stream.writableLength` : The `writableLength` property specifies the number of bytes currently buffered to be written to the underlying system.
- `stream.write()` : The `write()` method writes some data to the stream, and calls the supplied callback once the data has been fully handled. If the data is a string, it will be converted to a Buffer before writing. The callback will be called with a possible error argument if an error occurred while writing the data, or with the `chunk` as the second argument if the data was successfully written.
- `stream.end()` : The `end()` method signals the end of the stream (EOF), after which no more data can be written to the stream. The optional `chunk` and `encoding` arguments allow one final additional chunk of data to be written immediately before closing the stream.
- `stream.destroy()` : The `destroy()` method destroys the stream, making all future operations on the stream error. The optional `error` argument will be emitted as an `'error'` event if provided.

```javascript
try {
  const file = await fs.open("file.txt", "w");
  const stream = file.createWriteStream();
  console.log(stream.writableHighWaterMark);
  console.log(stream.writableLength);

  const buffer = Buffer.alloc(16384, 10);
  console.log(buffer.length);
  console.log(stream.write(buffer)); // return false because buffer is full.
} catch (err) {
  console.log(err);
}
```

### **EVENTS**

- ### `stream.on('drain')`

  `drain` event is emitted when the buffer is freed and ready to write more data.
  Emitted when the writable stream becomes writable again after a write operation drained the buffer.

  ```javascript
  import { createWriteStream } from "node:fs";

  const writable = createWriteStream("./output.txt");
  writable.on("drain", () => {
    console.log("Writable stream is writable again");
  });
  ```

- ### `stream.on('finish')`

  `finish` event is emitted when the stream is closed.
  Emitted when all data has been flushed to the underlying system.

  ```javascript
  import { createWriteStream } from "node:fs";

  const writable = createWriteStream("./output.txt");
  writable.on("finish", () => {
    console.log("All data has been flushed to the underlying system");
  });
  ```

- ### `stream.on('close')`

  `close` event is emitted when the stream and the file descriptor is closed.
  Emitted when the writable stream and any underlying resources have been closed. The event indicates that no more events will be emitted, and no further computation will occur.

  ```javascript
  import { createWriteStream } from "node:fs";

  const writable = createWriteStream("./output.txt");
  writable.on("close", () => {
    console.log("Writable stream closed");
  });
  ```

- ### `stream.on('error')`

  `error` event is emitted when there is an error while writing data.

  ```javascript
  import { createWriteStream } from "node:fs";

  const writable = createWriteStream("./output.txt");
  writable.on("error", (err) => {
    console.log(err);
  });
  ```

- ### `stream.on('pipe',(src)=>{})`

  `pipe` event is emitted when the stream is piped to another stream.

  - `src <stream.Readable>` source stream that is `piping` to this writable

  ```javascript
  import { createWriteStream, createReadStream } from "node:fs";

  const writable = createWriteStream("./output.txt");
  const readable = createReadStream("./input.txt");

  readable.pipe(writable);
  writable.on("pipe", (source) => {
    console.log("Piping from", source.path);
  });
  ```

- ### `stream.on('unpipe')`

  `unpipe` event is emitted when the stream is unpiped from another stream.

  - `src <stream.Readable>` The source stream that `unpiped` this writable

  ```javascript
  import { createWriteStream, createReadStream } from "node:fs";

  const writable = createWriteStream("./output.txt");
  const readable = createReadStream("./input.txt");

  readable.pipe(writable);
  writable.on("unpipe", (source) => {
    console.log("Unpiping from", source.path);
  });
  readable.unpipe(writable);
  ```

### **METHODS**

- ### `write(chunk[, encoding][, callback])`

  `write` method is used to write data to the stream. Writes the given data to the writable stream. If the data is a string, it will be converted to a Buffer before writing.

  - `chunk` `<string> | <Buffer> | <Uint8Array> | <any>` The data to write
  - `encoding` `<string>` The encoding, if `chunk` is a string
  - `callback` `<Function>` Callback for when this chunk of data is flushed

  ```javascript
  import { createWriteStream } from "node:fs";

  const writable = createWriteStream("./output.txt");
  writable.write("Hello World", (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Data written successfully");
  });
  ```

- ### `end([chunk][, encoding][, callback])`

  `end` method is used to signal that no more data will be written to the stream. The optional `chunk` and `encoding` arguments allow one final additional chunk of data to be written immediately before closing the stream.

  - `chunk` `<string> | <Buffer> | <Uint8Array> | <any>` Optional data to write
  - `encoding` `<string>` The encoding, if `chunk` is a string
  - `callback` `<Function>` Callback for when this chunk of data is flushed

  ```javascript
  import { createWriteStream } from "node:fs";

  const writable = createWriteStream("./output.txt");

  writable.write("Hello World", (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Data written successfully");
  });

  writable.end("This is the end", (err) => {
    if (err) {
      console.log(err);
    }
    console.log("End written successfully");
  });
  ```

- ### `setDefaultEncoding(encoding)`

  `setDefaultEncoding` method is used to set the default encoding for a writable stream.

  - `encoding` `<string>` The encoding

  ```javascript
  import { createWriteStream } from "node:fs";

  const writable = createWriteStream("./output.txt");

  writable.setDefaultEncoding("utf8");
  writable.write("Hello World");
  ```

- ### `setDefaultHighWaterMark(highWaterMark)`

  `setDefaultHighWaterMark` method is used to set the default highWaterMark for a writable stream.

  - `highWaterMark` `<number>` The new highWaterMark value

  ```javascript
  import { createWriteStream } from "node:fs";

  const writable = createWriteStream("./output.txt");

  writable.setDefaultHighWaterMark(100);
  writable.write("Hello World");
  ```

### **PROPERTIES**

- ### `writable.closed`

  `writable.closed` property is used to check whether the stream is closed or not.

  ```javascript
  const isClosed = writable.closed;
  console.log(isClosed);
  ```

- ### `writable.writable`

  `writable.writable` property is used to check whether the stream is writable or not.

  ```javascript
  const isWritable = writable.writable;
  console.log(isWritable);
  ```

- ### `writable.writableEnded`

- ### `writable.writableFinished`

- ### `writable.errored`

- ### `writable.writableLength`

  This property contains the number of bytes (or objects) in the queue ready to be written. The value provides introspection data regarding the status of the highWaterMark.

### **EXAMPLE**

```javascript
try {
  console.time("timeTaken");
  const file = await fs.open("file.txt", "w");
  const stream = file.createWriteStream();

  let i = 0;
  const writeOnFile = async () => {
    while (i < 1000000) {
      const buffer = Buffer.from(` ${i} `, "utf-8");
      if (i === 999999) {
        return stream.end(buffer);
      }
      if (!stream.write(buffer)) break;
      i++;
    }
  };

  writeOnFile();

  stream.on("drain", () => {
    writeOnFile();
  });

  stream.on("finish", () => {
    console.log("File written successfully");
    file.close();
    console.timeEnd("timeTaken");
  });
} catch (error) {
  console.log(error);
}
```

---

## Readable Streams | `fs.createWriteStream()`,`stream.write()`

### `Two modes`

- Flowing mode
- Paused mode

all Readable streams start in paused mode but can be switched to flowing mode in one of the following ways:

### `Three states`'

- `readable.readableFlowing === null` : The stream is in paused mode.
- `readable.readableFlowing === false` : The stream is in paused mode.
- `readable.readableFlowing === true` : The stream is in flowing mode.

### Choose one API style

- `stream.on('data', function(chunk) {})`
- `stream.on('readable', function() {})`
- `stream.pipe(destination[, options])`

The main difference between `readable.on('data',(chunk)=>{})` and `readable.on('readable',()=>{})` is that the `data` event is emitted when there is data available to be read, while the `readable` event is emitted when data may be available to be read.

_You should use `readable.on('data', function(chunk) {})` when you want to consume data as soon as it is available and you are able to process it efficiently. You should use `readable.on('readable', function() {})` when you want to check whether there is data available to be read, or if you need to perform some other action before consuming the data._

### **EVENTS**

- ### `stream.on('data', function(chunk) {})`

  The `data` event is emitted when data is available to be consumed from the stream. When the `data` event is emitted, the callback function provided as the event listener is called with a `chunk` parameter, which represents a chunk of data that can be read from the stream. The `data` event is a simple way to consume data from a Readable stream, as it automatically handles buffering and flow control.

  - Pros: This method will give you access to the data as soon as it is available, and you can consume it immediately. This is especially useful when dealing with large amounts of data, as it allows you to process it in chunks.
  - Cons: This method can potentially cause back-pressure, as it will continue to emit data events until all the available data has been consumed. This can be problematic if you are processing the data slowly, as it can cause the buffer to fill up and the program to run out of memory.

  ```javascript
  import fs from "node:fs/promises";
  try {
    const fileHandle = await fs.open("file.txt", "r");
    const stream = await fileHandle.createReadStream({
      highWaterMark: 64 * 1024,
    });

    // check if stream is readable
    console.log(stream.readable);
    // highWaterMark is 64kb
    console.log(stream.readableHighWaterMark);

    stream.on("data", (chunk) => {
      console.log(chunk);
      // type of chunk is Buffer
      console.log(chunk instanceof Buffer);
      // length of chunk is 64kb
      console.log(chunk.length);
    });

    stream.on("end", () => {
      console.log("end");
      // close file
      fileHandle.close();
    });
  } catch (error) {
    console.log(error);
  }
  ```

- ### `stream.on('readable', function() {})`

  The `readable` event, on the other hand, is emitted when there is data available to be read from the stream, but it does not guarantee that data is immediately available. The `readable` event is emitted when the stream transitions from a state of not having enough data to read to a state where data can be read. When the `readable` event is emitted, the stream's `read()` method can be called to read data from the stream. The `readable` event provides more control over the flow of data, as it allows the consumer to read data on demand, but it requires more complex handling of buffering and flow control.

  - Pros: This method allows you to check whether there is data available to be read, without actually consuming it. This is useful if you want to read data only when it is needed, or if you need to perform some other action before consuming the data.
  - Cons: This method may not provide access to the data immediately, as it only emits the event when data may be available to be read. This can be less efficient if you need to process the data quickly, as it may require multiple iterations of the event loop.

  ```javascript
  try {
    const readable = await fs.open("read.txt", "r");
    const x = await readable.createReadStream();
    x.on("readable", () => {
      let chunk;
      // console.log("readable", x.read());
      // console.log("readable", typeof x.read());
      while ((chunk = x.read()) !== null) {
        console.log(chunk.toString("utf-8"));
      }
    });
    x.on("end", () => {
      console.log("end");
      readable.close();
    });
  } catch (error) {
    console.log(error);
  }
  ```

- ### `stream.on('end')`

  `end` event is emitted when there is no more data to read. it will trigger when the stream is finished reading.

  ```javascript
  stream.on("end", () => {
    console.log("No more data to read");
  });
  ```

- ### `stream.on('pause')`

  `pause` event is emitted when the stream is paused.

  ```javascript
  stream.on("pause", () => {
    console.log("stream is paused");
  });
  ```

- ### `stream.on('resume')`

  `resume` event is emitted when the stream is resumed.

  ```javascript
  stream.on("resume", () => {
    console.log("stream is resumed");
  });
  ```

### EXAMPLE

```javascript
try {
  const readFileHandle = await fs.open("read.txt", "r");
  const writeFileHandle = await fs.open("write.txt", "w");
  const readStream = await readFileHandle.createReadStream({
    highWaterMark: 64 * 1024,
  });
  const writeStream = await writeFileHandle.createWriteStream();

  readStream.on("data", (chunk) => {
    // check writeStream is writable if not then pause readStream
    if (!writeStream.write(chunk)) {
      readStream.pause();
    }
  });

  // wait for drain event and continue reading
  writeStream.on("drain", () => {
    readStream.resume();
  });

  readStream.on("end", () => {
    readFileHandle.close();
    writeFileHandle.close();
  });
} catch (error) {
  console.log(error);
}
```

### **METHODS**

- ### `stream.pipe(destination[, options])`

  **Nodejs will handle all the `pause`, `drain` and `resume` events.**

  The `readable.pipe(destination[, options])` method is a convenient way to quickly and easily transfer data from a readable stream to a writable stream. When called on a readable stream, it sets up a `pipe` between the readable stream and a writable `destination` stream, allowing data to flow seamlessly between them.

  options:

  - `data`: When the readable stream emits a `data` event, the data is written to the destination stream.
  - `end`: When the readable stream emits an `end` event, the destination stream is ended if the `end` option is set to `true`.
  - `error`: If an error occurs on either the readable or writable stream, the error is emitted on both streams.

  ```javascript
  try {
    try {
      const copy_to = await fs.open("to-write.txt", "w");
      const copy_from = await fs.open("from-read.txt", "r");

      const readStream = copy_from.createReadStream();
      const writStream = copy_to.createWriteStream();

      readStream.pipe(writStream);
      readStream.on("end", () => {
        console.log("copy end");
      });
      readStream.on("error", (error) => {
        readStream.destroy();
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
  ```

- ### `readable.unpipe(destination[, options])`

  The `readable.unpipe([destination])` method is used to stop piping data from a readable stream to a writable stream. If `destination` is specified, then only that destination is removed. If `destination` is not specified, then all destinations are removed.

- ### `read(size)`

  The `readable.read([size])` method pulls some data out of the internal buffer and returns it. If there is no data available, then it will return `null`.

- ### `readable.setEncoding(encoding)`

  The `readable.setEncoding(encoding)` method sets the encoding for the readable stream. This will cause the stream to emit strings rather than `Buffer` objects.

- ### `readable.pause()`

  The `readable.pause()` method pauses the stream. Any data that becomes available will remain in the internal buffer.

- ### `readable.resume()`

  The `readable.resume()` method resumes a paused stream.

- ### `readable.isPaused()`

  The `readable.isPaused()` method returns a boolean indicating whether the stream is paused or not.

### EXAMPLE

```javascript
import fs from "node:fs";

// Create a Readable stream from a file
const readableStream = fs.createReadStream("file.txt");

// Set the encoding to UTF-8
readableStream.setEncoding("utf8");

// Read the first 10 bytes of data from the stream
const chunk = readableStream.read(10);

// Pause the stream
readableStream.pause();

// Check if the stream is paused
console.log(readableStream.isPaused()); // true

// Resume the stream after a 1 second delay
setTimeout(() => {
  readableStream.resume();
}, 1000);
```

### **PROPERTIES**

- ### `readable.readable`

  The `readable.readable` property is a boolean that indicates whether the stream is readable or not.

- ### `readable.readableEncoding`

  The `readable.readableEncoding` property is a string that indicates the encoding of the stream.

- ### `readable.readableEnded`

  `readable.readableEnded` property is a boolean that indicates whether the stream has ended or not.

- ### `readable.readableFlowing`

  The `readable.readableFlowing` property is a boolean that indicates whether the stream is flowing or not.

- ### `readable.readableHighWaterMark`

  The `readable.readableHighWaterMark` property is a number that indicates the high water mark of the stream.

- ### `readable.readableLength`

  The `readable.readableLength` property is a number that indicates the length of the stream.

- ### `readable.readableObjectMode`

  The `readable.readableObjectMode` property is a boolean that indicates whether the stream is in object mode or not.

### **Utility Method**

### `Pipeline()`

In Node.js, the pipeline() method is used to transfer data between multiple streams, typically a readable stream, one or more transform streams, and a writable stream. The pipeline() method makes it easy to pipe multiple streams together and handle errors.

**Arguments**

- `readableStream`: The source readable stream.
- `transformStream1 ... transformStreamN`: Any number of transform streams to transform data before writing to the writable stream.
- `writableStream`: The destination writable stream.
- `options (optional)`: An object with optional properties that can be used to customize the behavior of the pipeline.
- `callback (optional)`: A function that will be called once the pipeline has completed or an error occurs.

```javascript
try {
  const copy_to = await fs.open("to-write.txt", "w");
  const copy_from = await fs.open("from-read.txt", "r");

  const readStream = copy_from.createReadStream();
  const writStream = copy_to.createWriteStream();

  await pipeline(readStream, writStream);
} catch (error) {
  console.log(error);
} finally {
  copy_to.close();
  copy_from.close();
}
```

```javascript
const fs = require("fs");
const { pipeline } = require("stream");
const readableStream = fs.createReadStream("input.txt");
const writableStream = fs.createWriteStream("output.txt");
const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});
pipeline(readableStream, transformStream, writableStream, (err) => {
  if (err) {
    console.error(`Error during pipeline: ${err}`);
  } else {
    console.log("Pipeline complete");
  }
});
writableStream.on("close", () => {
  console.log("Writable stream closed");
});
writableStream.on("drain", () => {
  console.log("Writable stream drained");
});
writableStream.on("error", (err) => {
  console.error(`Error writing to stream: ${err}`);
});
writableStream.on("finish", () => {
  console.log("Finished writing to stream");
});
```

## Custom WritableStream

<!-- https://nodejs.org/api/stream.html#new-streamwritableoptions -->

- MUST IMPLEMENT THOSE SPECIFIC FUNCTIONS

  - `_write(chunk, encoding, callback)`
  - `_writev(chunks, callback)`
  - `_final(callback)`

- NEVER EMIT EVENTS INSIDE CHILD CLASS
- NEVER OVERWRITTEN THE ORIGINAL METHOD `write()` METHOD
- NEVER CALL `_write()` OR `_writev()` DIRECTLY

**options**

- `highWaterMark`: The maximum number of bytes to store in the internal buffer before ceasing to read from the underlying resource. Default: `16384` (16kb).
- `decodeStrings`: Specifies whether or not to decode strings into `Buffer` objects before passing them to `_write()`. Default: `true`.
- `defaultEncoding`: The default character encoding to use if `decodeStrings` is set to `true`. Default: `'utf8'`.
- `objectMode`: Specifies whether or not this stream should operate in object mode. Default: `false`.
- `write`: A function that is called when the stream is ready to receive new data to write. Implementation for the `stream._write()` method.
- `writev`: A function that is called when the stream is ready to receive an array of chunks of new data to write. Implementation for the `stream._writev()` method.
- `destroy`: A function that is called when the stream is being destroyed. Implementation for the `stream._destroy()` method.
- `final`: A function that is called when the stream is finished writing data. Implementation for the `stream._final()` method.
- `autoDestroy`: Specifies whether or not the stream should automatically call `destroy()` after `end()` has been called. Default: `true`.
- `emitClose`: Specifies whether or not the stream should emit a `'close'` event after `destroy()` has been called. Default: `true`.

### `Class`: `Writable`

### `constructor`

### `_construct(callback)`

`_construct()` is called during object construction. The `callback` must be called once the construction is complete.

### `_write(chunk, encoding, callback)`

### `callback(err, data)`

callback is called when the supplied chunk of data has been fully handled. If an error occurred, you should pass it as the first argument. If the chunk is accepted, but not yet fully handled, you can pass a second argument to the callback to signal that you want to receive the next chunk.

```javascript
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
```

## Custom ReadableStream `new stream.Readable([options])`

**_options_**

- `highWaterMark <number>` : default 16kb. The maximum number of bytes to store in the internal buffer before ceasing to read from the underlying resource.
- `encoding <string>` : default `null`. If specified, then buffers will be decoded to strings using the specified encoding.
- `objectMode <boolean>` : default `false`. If `true`, the stream will operate in object mode. In this mode, the stream will emit JavaScript objects rather than `Buffer` objects. The `encoding` option must not be set if `objectMode` is `true`.
- `read <Function>` : default `null`. If specified, then the specified function will be used as the implementation of the stream's `read()` method, allowing the user to provide a custom implementation for reading chunks from the stream.
- `destroy <Function>` : default `null`. If specified, then the specified function will be used as the implementation of the stream's `_destroy()` method, allowing the user to provide a custom implementation for destroying the stream.
- `autoDestroy <boolean>` : default `true`. If `true`, then the stream will automatically call the `destroy()` method when the stream ends, and after the `'error'` event is emitted if no error handler is set. If `false`, then the stream will not automatically call the `destroy()` method, and it is the user's responsibility to manually call `stream.destroy()` in order to close the stream and release any underlying resources.
- `emitClose <boolean>` : default `true`. If `true`, then the stream will emit a `'close'` event when the stream and any of its underlying resources (a file descriptor, for example) have been closed. If `false`, then the `'close'` event will not be emitted.

- MUST IMPLEMENT THOSE SPECIFIC FUNCTIONS

  - `_read()`
  - `_destroy()`

### `Class`: `Readable`

### `readable._construct(callback)`

`_construct()` is called during object construction. The `callback` must be called once the construction is complete.

### `readable._read(size)` : MUST IMPLEMENT

```javascript
fs.read(this.fd, buff, 0, size, null, (err, bytesRead){}
```

`size <number>` Number of bytes to read asynchronously

### `readable._destroy(error, callback)`

### `readable.push(chunk[, encoding])`

```javascript
this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
```

```javascript
import fs from "node:fs";
import { Readable } from "node:stream";

class ReadEmAll extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (err, fd) => {
      if (err) return callback(err);
      this.fd = fd;
      callback();
    });
  }

  _read(size) {
    const buff = Buffer.alloc(size);
    fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);
      // null is to indicate the end of the stream
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => callback(err || error));
    } else {
      callback(error);
    }
  }
}

const readStream = new ReadEmAll({
  highWaterMark: 64,
  fileName: "../_document/doc.md",
});

readStream.on("data", (chunk) => {
  console.log(chunk.toString());
});

readStream.on("end", () => {
  console.log("Done reading");
});
```

## Duplex Stream

duplex streams are streams that implement both the `Readable` and `Writable` interfaces. In other words, they are streams that are both readable and writable at the same time.

duplex streams has two internal buffers, one for the readable side and one for the writable side. When the writable side buffer is full, the stream will stop reading from the underlying resource. When the readable side buffer is empty, the stream will stop writing to the underlying resource.

there are not related to the `readable` and `writable` events.

```javascript
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
```

## Transform Stream

Transform streams are a type of duplex streams where the output is in some way computed from the input. They implement both the `Readable` and `Writable` interfaces.

## PassThrough Stream

PassThrough streams are a type of duplex streams where the output is identical to the input. They implement both the `Readable` and `Writable` interfaces.
