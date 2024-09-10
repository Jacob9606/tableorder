const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

const createUrl = (path) => {
  // BASE_URL이 슬래시로 끝나면, path 앞에 슬래시 없이 결합
  // 그렇지 않으면 path 앞에 슬래시 추가
  return BASE_URL.endsWith("/") ? `${BASE_URL}${path}` : `${BASE_URL}/${path}`;
};

export { BASE_URL };
