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
