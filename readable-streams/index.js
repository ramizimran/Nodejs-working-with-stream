import fs from "node:fs/promises";

// example 1
// try {
//   const fileHandle = await fs.open("file.txt", "r");
//   const stream = await fileHandle.createReadStream({
//     highWaterMark: 64 * 1024,
//   });

//   // check if stream is readable
//   console.log(stream.readable);
//   // highWaterMark is 64kb
//   console.log(stream.readableHighWaterMark);

//   stream.on("data", (chunk) => {
//     console.log(chunk);
//     // type of chunk is Buffer
//     console.log(chunk instanceof Buffer);
//     // length of chunk is 64kb
//     console.log(chunk.length);
//   });

//   stream.on("end", () => {
//     console.log("end");
//     // close file
//     fileHandle.close();
//   });
// } catch (error) {
//   console.log(error);
// }

//  example 2
//  not good : high memory usage
// try {
//   const readFileHandle = await fs.open("read.txt", "r");
//   const writeFileHandle = await fs.open("write.txt", "w");
//   const readStream = await readFileHandle.createReadStream({
//     highWaterMark: 64 * 1024,
//   });
//   const writeStream = await writeFileHandle.createWriteStream();

//   readStream.on("data", (chunk) => {
//     // write chunk to file
//     writeStream.write(chunk);
//   });

//   readStream.on("end", () => {
//     console.log("write end");
//     // close file
//     readFileHandle.close();
//     writeFileHandle.close();
//   });
// } catch (error) {
//   console.log(error);
// }

//  example 3
//  good
// try {
//   const readFileHandle = await fs.open("read.txt", "r");
//   const writeFileHandle = await fs.open("write.txt", "w");
//   const readStream = await readFileHandle.createReadStream({
//     highWaterMark: 64 * 1024,
//   });
//   const writeStream = await writeFileHandle.createWriteStream();

//   readStream.on("data", (chunk) => {
//     // check writeStream is writable if not then pause readStream
//     if (!writeStream.write(chunk)) {
//       readStream.pause();
//     }
//   });

//   // wait for drain event and continue reading
//   writeStream.on("drain", () => {
//     readStream.resume();
//   });

//   readStream.on("end", () => {
//     readFileHandle.close();
//     writeFileHandle.close();
//   });
// } catch (error) {
//   console.log(error);
// }

//  example 3
//  good
// try {
//   const readFileHandle = await fs.open("read.txt", "r");
//   const writeFileHandle = await fs.open("write.txt", "w");
//   const readStream = await readFileHandle.createReadStream({
//     highWaterMark: 64 * 1024,
//   });
//   const writeStream = await writeFileHandle.createWriteStream();

//   readStream.on("data", (chunk) => {
//     chunk.toString("utf-8").split("");

//     if (!writeStream.write(chunk)) {
//       readStream.pause();
//     }
//   });

//   // wait for drain event and continue reading
//   writeStream.on("drain", () => {
//     readStream.resume();
//   });

//   readStream.on("end", () => {
//     readFileHandle.close();
//     writeFileHandle.close();
//   });
// } catch (error) {
//   console.log(error);
// }

//  example 4

// try {
//   const readable = await fs.open("read.txt", "r");
//   const x = await readable.createReadStream();
//   console.log(x.readable);
//   x.on("data", (chunk) => {
//     console.log(chunk.toString("utf-8"));
//   });
//   x.on("end", () => {
//     console.log("end");
//     readable.close();
//   });
// } catch (error) {
//   console.log(error);
// }

//  example 5
// try {
//   const readable = await fs.open("read.txt", "r");
//   const x = await readable.createReadStream();
//   x.on("readable", () => {
//     let chunk;

//     // console.log("readable", x.read());
//     // console.log("readable", typeof x.read());

//     while ((chunk = x.read()) !== null) {
//       console.log(chunk.toString("utf-8"));
//     }
//   });
//   x.on("end", () => {
//     console.log("end");
//     readable.close();
//   });
// } catch (error) {
//   console.log(error);
// }
