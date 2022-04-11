export function commonFilter(imgArr, owner, ownerName: string) {
  if (ownerName === "message") {
    return imgArr.map((e) => {
      return { url: e.filename, message: owner, type: ownerName };
    });
  }
  if (ownerName === "post") {
    return imgArr.map((e) => {
      return { url: e.filename, post: owner, type: ownerName };
    });
  }
}
