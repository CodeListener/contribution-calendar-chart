export function fullZero(num: number, len = 2) {
    return `${num}`.padStart(len, "0");
  }
  export function format(timestamp: number | string | Date, format = "yyyy-MM-dd") {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return format
      .replace("yyyy", `${year}`)
      .replace("MM", `${fullZero(month)}`)
      .replace("dd", `${fullZero(day)}`)
      .replace("hh", `${fullZero(hour)}`)
      .replace("mm", `${fullZero(minutes)}`)
      .replace("ss", `${fullZero(seconds)}`);
  }
  