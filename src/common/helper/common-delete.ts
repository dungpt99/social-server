import * as fs from "fs";

export function commonDelete(array: any) {
  array.map(e => {
    if (e.filename) {
      fs.unlinkSync(`public/uploads/${e.filename}`);
    } else {
      fs.unlinkSync(`public/uploads/${e.url}`);
    }
  });
}
