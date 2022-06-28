import { FRONTEND_URL } from "../config";
import { addTextAt } from "../helpers";

export const addSearchParam = (href = "", search = "", param = "") => {
  console.log(href);
  if (!(href || search)) return href;
  let searchStart = href.indexOf("?");
  searchStart = searchStart >= 0 ? searchStart : null;
  if (searchStart) {
    let start = href.indexOf(search);
    const searchEnd = href.substring(searchStart).length + searchStart;
    if (start <= -1) {
      console.log("jing tink...", searchStart, searchEnd, href[searchEnd]);
      href = addTextAt(
        href,
        `${
          href[searchEnd] &&
          (href[searchEnd] !== "&" || href[searchEnd] !== "?")
            ? "&"
            : ""
        }${param}&`,
        searchEnd
      );
    } else {
      let end = href.indexOf("&", start);
      end = end >= 0 ? end : href.length;
      console.log("first else...", href);
      href = href.slice(start, end)
        ? href
        : addTextAt(
            href,
            `${
              href[searchEnd] &&
              (href[searchEnd] !== "&" || href[searchEnd] !== "?")
                ? "&"
                : ""
            }${param}&`,
            searchEnd
          );
    }
  } else {
    console.log("lase else...");
    href = href + `?${`${param}&`}`;
  }
  console.log(href);
  return href;
};
export const createRedirectURL = (
  from = "",
  baseURL = FRONTEND_URL,
  redirectPath = `/u/login`
) => {
  if (from === "no-redirect")
    return (
      baseURL + redirectPath + window.location.search + window.location.hash
    );
  return (
    baseURL +
    addSearchParam(
      redirectPath,
      "redirect_url",
      "redirect_url=" +
        (from ||
          `${encodeURIComponent(
            window.location.pathname +
              window.location.search +
              window.location.hash
          )}`)
    )
  );
};
