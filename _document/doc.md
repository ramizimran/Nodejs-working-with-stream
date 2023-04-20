# Stream

## Terms

1. **File descriptor:** A file descriptor is a non-negative integer that is used to identify an open file. It is used by the operating system to keep track of all the files that are currently open by a process. The file descriptor is used to refer to the file in subsequent read and write operations.

2. **difference between async and sync and callback** : The difference between async and sync is that async is non-blocking and sync is blocking. The difference between callback and async is that callback is a function that is passed as an argument to another function and async is a function that takes a callback as an argument.

## Streams

1. **What is a stream?** : A stream is an abstract interface for working with streaming data in Node.js. Streams are pipes that let you easily read data from a source and pipe it to a destination.

2. **What is a readable stream?** : A readable stream is an abstraction for a source from which data is consumed.

3. **What is a writable stream?** : A writable stream is an abstraction for a destination to which data is written.

4. **What is a streaming data?** : Streaming data is data that is received or sent in small chunks over a period of time.

### Types of Streams

- Writable Streams
- Readable Streams
- Duplex Streams
- Transform Streams

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

- event | properties | method

### **EVENTS**

### `stream.on(data,(chunk))`

```javascript
stream.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

### `stream.on('end')`

`end` event is emitted when there is no more data to read.

```javascript
stream.on("end", () => {
  console.log("No more data to read");
});
```

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

### `stream.pause()` and `stream.resume()`

`stream.pause()` method is used to pause the stream.

`stream.resume()` method is used to resume the stream.

`stream.on('end')` event is emitted when there is no more data to read. it will trigger when the stream is finished reading.

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

### `Two modes`

- Flowing mode
- Paused mode

all Readable streams start in paused mode but can be switched to flowing mode in one of the following ways:

- Adding a 'data' event handler.
- Calling the `stream.resume()` method.
- Calling the `stream.pipe()` method to send the data to a `Writable`.
- `stream.pause()` method is used to pause the stream.

#### `Three states`'

- `readable.readableFlowing === null` : The stream is in paused mode.
- `readable.readableFlowing === false` : The stream is in paused mode.
- `readable.readableFlowing === true` : The stream is in flowing mode.

## Choose one API style

- `stream.on('data', function(chunk) {})`
- `stream.on('readable', function() {})`
- `stream.pipe(destination[, options])`
-

### `stream.on('data', function(chunk) {})`

```javascript
try {
  const readable = await fs.open("read.txt", "r");
  const x = await readable.createReadStream();
  console.log(x.readable);
  x.on("data", (chunk) => {
    console.log(chunk.toString("utf-8"));
  });
  x.on("end", () => {
    console.log("end");
    readable.close();
  });
} catch (error) {
  console.log(error);
}
```

### `stream.on('readable', function() {})`

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

### `stream.pipe(destination[, options])`

**Nodejs will handle all the `pause`, `drain` and `resume` events.**

- `close` - emitted when the writable stream is closed
- `drain` - emitted when the writable stream is drained - and can receive more data
- `error` - emitted when an error occurs during piping
- `finish` - emitted when all data has been written to the writable stream

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

### `readable.unpipe(destination[, options])`

### `stream.finished(stream[, options], callback)`

### `pipeline()`

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

````javascript
const fs = require('fs');
const { pipeline } = require('stream');
const readableStream = fs.createReadStream('input.txt');
const writableStream = fs.createWriteStream('output.txt');
const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});
pipeline(
  readableStream,
  transformStream,
  writableStream,
  (err) => {
    if (err) {
      console.error(`Error during pipeline: ${err}`);
    } else {
      console.log('Pipeline complete');
    }
  }
);
writableStream.on('close', () => {
  console.log('Writable stream closed');
});
writableStream.on('drain', () => {
  console.log('Writable stream drained');
});
writableStream.on('error', (err) => {
  console.error(`Error writing to stream: ${err}`);
});
writableStream.on('finish', () => {
  console.log('Finished writing to stream');
});
```
````

## Custom WritableStream

<!-- https://nodejs.org/api/stream.html#new-streamwritableoptions -->

- MUST IMPLEMENT THOSE SPECIFIC FUNCTIONS

  - `_write(chunk, encoding, callback)`
  - `_writev(chunks, callback)`
  - `_final(callback)`

- NEVER EMIT EVENTS INSIDE CHILD CLASS
- NEVER OVERWRITTEN THE ORIGINAL METHOD `write()` METHOD
- NEVER CALL `_write()` OR `_writev()` DIRECTLY

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
