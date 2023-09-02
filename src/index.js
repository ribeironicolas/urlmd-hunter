import fs from "fs";
import chalk from "chalk";

function extractLinks(text) {
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const matches = [...text.matchAll(regex)];
  const results = matches.map((match) => ({
    [match[1]]: [match[2]],
  }));

  return results.length !== 0 ? results : "No Link Found";
}

function handleError(error) {
  throw new Error(chalk.red(error.code, "Error founded"));
}

async function catchFile(filePath) {
  try {
    const enconding = "utf-8";
    const content = await fs.promises.readFile(filePath, enconding);
    return extractLinks(content);
  } catch (error) {
    handleError(error);
  }
}

export default catchFile;
