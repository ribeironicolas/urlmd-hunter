#!/usr/bin/env node
import fs from "fs";
import catchFile from "./index.js";
import validateList from "./http-validate.js";

import chalk from "chalk";

const path = process.argv;

async function printList(validate, result, id = "") {
  if (validate) {
    console.log(
      chalk.yellow("validated list: "),
      chalk.black.bgGreen(id),
      await validateList(result)
    );
  } else {
    console.log(chalk.yellow("links list: "), chalk.black.bgGreen(id), result);
  }
}

async function processContent(args) {
  const path = args[2];
  const validate = args[3] === "validate";

  try {
    fs.lstatSync(path);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("File or Directory doesn't exist");
      return;
    }
  }

  if (fs.lstatSync(path).isFile()) {
    const result = await catchFile(path);
    printList(validate, result);
  } else if (fs.lstatSync(path).isDirectory()) {
    const files = await fs.promises.readdir(path);
    files.forEach(async (fileName) => {
      const list = await catchFile(`${path}/${fileName}`);
      printList(validate, list, fileName);
    });
  }
}

processContent(path);
