import { spawn } from "node:child_process";
import net from "node:net";

function isPortOpen(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(800);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => resolve(false));
  });
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", shell: process.platform === "win32" });
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`));
    });
  });
}

const authRunning = await isPortOpen(9099);
const firestoreRunning = await isPortOpen(8080);

if (authRunning && firestoreRunning) {
  console.info("Firebase emulators already running. Seeding existing local emulators...");
  await run("node", ["scripts/seed-firebase-emulator.mjs"]);
} else {
  console.info("Starting temporary Firebase emulators, seeding, then exporting to .firebase-data...");
  await run("firebase", [
    "emulators:exec",
    "--only",
    "auth,firestore",
    "--export-on-exit=.firebase-data",
    "node scripts/seed-firebase-emulator.mjs",
  ]);
}
