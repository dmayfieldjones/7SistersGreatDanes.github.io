export function replaceLink(str: string) {
  return str.replace(
    /\(([^,]+),\s*(\d{4})\)(?:.*?)?(https?:\/\/[^\s]+)/g,

    function (_match, author, year, url) {
      return `<a href="${url}" target="_blank">(${author}, ${year})</a>`
    },
  )
}
