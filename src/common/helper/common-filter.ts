export function commonFilter(imgArr, owner, ownerName: string) {
  if (ownerName === "category") {
    return imgArr.map((e) => {
      return { url: e.filename, category: owner, type: ownerName };
    });
  }
  if (ownerName === "post") {
    return imgArr.map((e) => {
      return { url: e.filename, post: owner, type: ownerName };
    });
  }
}
