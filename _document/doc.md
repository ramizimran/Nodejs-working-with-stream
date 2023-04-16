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

- event | properties | method
- internal buffer | size 16kb
- drain event

- `stram.highWaterMark` : The `highWaterMark` property specifies the maximum number of bytes to store in the internal buffer before ceasing to read from the underlying resource. default value is 16kb.
- `stream.writableLength` : The `writableLength` property specifies the number of bytes currently buffered to be written to the underlying system.

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

### `stream.on('drain')`

`drain` event is emitted when the buffer is freed and ready to write more data.

```javascript
stream.on("drain", () => {
  console.log("Buffer is freed");
});
```

### `stream.end()`

`stream.end()` method is used to close the stream.

### `stream.on('finish')`

`finish` event is emitted when the stream is closed.

### `stream.on('close')`

`close` event is emitted when the stream and the file descriptor is closed.

### `stream.on('error')`

`error` event is emitted when there is an error while writing data.

### `stream.destroy()`

`stream.destroy()` method is used to destroy the stream.

### `stream.writable`

`stream.writable` property is used to check whether the stream is writable or not.

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

## Readable Streams | `fs.createWriteStream()`,`stream.write()`

- event | properties | method

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
