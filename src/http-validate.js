import chalk from "chalk";

function extractLinks(arrLinks) {
  return arrLinks.map((objLink) => Object.values(objLink).join());
}

function handleError(error) {
  if (error.cause.code === "ENOTFOUND") {
    return "Link not found";
  } else {
    return "Error";
  }
}

async function checkStatus(urlsList) {
  const arrStatus = await Promise.all(
    urlsList.map(async (url) => {
      try {
        const res = await fetch(url);
        return `${res.status} - ${res.statusText}`;
      } catch (error) {
        return handleError(error);
      }
    })
  );

  return arrStatus;
}

export default async function validateList(linksList) {
  const links = extractLinks(linksList);
  const status = await checkStatus(links);
  return linksList.map((object, index) => ({
    ...object,
    status: status[index],
  }));
}
