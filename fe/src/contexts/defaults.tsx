// const UNKNOWN_IMAGE =

import { uImage } from "@/schema/simple";

export const UNKNOWN_IMAGE: uImage = {
  name: "error",
  distance: 1,
  titles: ["error image", "test image"],
  url: "https://webcolours.ca/wp-content/uploads/2020/10/webcolours-unknown.png",
};

export const LOADING_IMAGE: uImage = {
  name: "loading",
  distance: 1,
  titles: [],
  url: "",
};

export const TEST_IMAGE_LIST = [
  LOADING_IMAGE,
  LOADING_IMAGE,
  LOADING_IMAGE,
  LOADING_IMAGE,
  LOADING_IMAGE,
  LOADING_IMAGE,
  LOADING_IMAGE,
  LOADING_IMAGE,
];

export const MAX_DISPLAY_IMAGE = 8;

export const API_SERVER = "http://localhost:8080";
export const API_SEARCH = API_SERVER + "/api/search";
export const API_SEARCH_ITEM = API_SERVER + "/api/search/item";

export const EYE_SERVER = "http://localhost:1111";
export const API_GAZELIST = EYE_SERVER + "/gaze/get";

export const API_DEFAULT_TRACK = API_SERVER + "/api/dres/task";
export const API_FETCH_SEQ = API_SERVER + "/api/fetch/sequence";
export const API_FETCH_SEGMENT = API_SERVER + "/api/fetch/segment";

export const API_LOGIN = API_SERVER + "/api/dres/login";
export const API_SUBMIT = API_SERVER + "/api/dres/submit";

// export { TEST_IMAGE_LIST, UNKNOWN_IMAGE, API_SEARCH, API_LOGIN, API_SUBMIT };
// https://lifeseeker-ci.computing.dcu.ie/images/lsc22
