import fs from "fs/promises";

// v1
// 20.491s
// try {
//   console.time("timeTaken");
//   const file = await fs.open("file1.txt", "w");
//   for (let i = 0; i < 1000000; i++) {
//     await file.write(` ${i} `);
//   }
//   console.timeEnd("timeTaken");
//   file.close();
// } catch (error) {
//   console.log(error);
// }

// v2 sync
// 2.419s
// import fs from "fs";
// try {
//   console.time("timeTaken");
//   fs.open("file1.txt", "w", (err, fd) => {
//     for (let i = 0; i < 1000000; i++) {
//       fs.writeSync(fd, ` ${i} `);
//     }
//     console.timeEnd("timeTaken");
//     fs.close(fd);
//   });
// } catch (error) {
//   console.log(error);
// }

// v3 - callback
// not in order and not executed in sync
// import fs from "fs";
// try {
//   console.time("timeTaken");
//   fs.open("file1.txt", "w", (err, fd) => {
//     for (let i = 0; i < 1000000; i++) {
//       fs.write(fd, ` ${i} `, () => {});
//     }
//     console.timeEnd("timeTaken");
//     fs.close(fd);
//   });
// } catch (error) {
//   console.log(error);
// }

// v4 - buffer
// import fs from "fs";
// try {
//   console.time("timeTaken");
//   fs.open("file1.txt", "w", (err, fd) => {
//     for (let i = 0; i < 1000000; i++) {
//       const buff = Buffer.from(` ${i} `, "utf-8");
//       fs.writeSync(fd, buff);
//     }
//     console.timeEnd("timeTaken");
//     fs.close(fd);
//   });
// } catch (error) {
//   console.log(error);
// }

// v5 - createWriteStream
// not memory efficient
// not good method
// try {
//   console.time("timeTaken");

//   const file = await fs.open("file.txt", "w");
//   const stream = file.createWriteStream();

//   for (let i = 0; i < 1000000; i++) {
//     const buff = Buffer.from(` ${i} `, "utf-8");
//     stream.write(buff);
//   }
//   console.timeEnd("timeTaken");
//   file.close();
// } catch (error) {
//   console.log(error);
// }

// try {
//   const file = await fs.open("file.txt", "w");
//   const stream = file.createWriteStream();

//   const buffer = Buffer.alloc(16383, "a");
//   console.log(stream.write(buffer));
//   const buffer1 = Buffer.alloc(1, "a");
//   console.log(stream.write(buffer1));

//   stream.on("drain", () => {
//     console.log("Buffer is freed");
//   });
//   const buffer2 = Buffer.alloc(1, "a");
//   console.log(stream.write(buffer2));
// } catch (error) {
//   console.log(error);
// }

// try {
//   console.time("timeTaken");
//   const file = await fs.open("file.txt", "w");
//   const stream = file.createWriteStream();

//   let i = 0;
//   const writeOnFile = async () => {
//     while (i < 1000000) {
//       const buffer = Buffer.from(` ${i} `, "utf-8");
//       if (i === 999999) {
//         return stream.end(buffer);
//       }
//       if (!stream.write(buffer)) break;
//       i++;
//     }
//   };

//   writeOnFile();
//   stream.on("drain", () => {
//     writeOnFile();
//   });

//   stream.on("finish", () => {
//     console.log("File written successfully");
//     file.close();
//     console.timeEnd("timeTaken");
//   });
// } catch (error) {
//   console.log(error);
// }
