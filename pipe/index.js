import fs from "node:fs/promises";
import { pipeline } from "node:stream/promises";
// bad copy.
// 2gb limitation
// bad memory usage
// try {
//   const copy_to = await fs.open("to-write.txt", "w");
//   const copy_from = await fs.readFile("from-read.txt");
//   await copy_to.write(copy_from);
// } catch (error) {
//   console.log(error);
// }

// good copy not using streams
// try {
//   const copy_to = await fs.open("to-write.txt", "w");
//   const copy_from = await fs.open("from-read.txt", "r");

//   let bytesRead = -1;
//   while (bytesRead !== 0) {
//     const bytesWritten = await copy_from.read();
//     bytesRead = bytesWritten.bytesRead;

//     // if the buffer is not full, we need to create a new buffer
//     // avoiding 0 or null end of buffer
//     if (bytesRead !== 16384) {
//       const indexOfNotFilled = bytesWritten.buffer.indexOf(0);
//       const newBytesWritten = Buffer.alloc(indexOfNotFilled);
//       bytesWritten.buffer.copy(newBytesWritten, 0, 0, indexOfNotFilled);
//       bytesWritten.buffer = newBytesWritten;
//     } else {
//       await copy_to.write(bytesWritten.buffer);
//     }
//   }
// } catch (error) {
//   console.log(error);
// }

// try {
//   const copy_to = await fs.open("to-write.txt", "w");
//   const copy_from = await fs.open("from-read.txt", "r");

//   const readStream = copy_from.createReadStream();
//   const writStream = copy_to.createWriteStream();

//   readStream.pipe(writStream);

//   readStream.on("end", () => {
//     console.log("copy end");
//   });

//   readStream.on("error", (error) => {
//     readStream.destroy();
//   });
// } catch (error) {
//   console.log(error);
// }

// try {
//   const copy_to = await fs.open("to-write.txt", "w");
//   const copy_from = await fs.open("from-read.txt", "r");

//   const readStream = copy_from.createReadStream();
//   const writStream = copy_to.createWriteStream();

//   await pipeline(readStream, writStream);
// } catch (error) {
//   console.log(error);
// } finally {
//   copy_to.close();
//   copy_from.close();
// }
