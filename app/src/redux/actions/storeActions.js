
export const setStoreData = (data) => ({
  type: "SET_STORE_DATA",
  payload: data,
});

export const setHeaders = (headers) => ({
  type: "SET_HEADERS",
  payload: headers,
});

export const setStatusAction = (status) => ({
  type: "SET_STATUS",
  payload: status
})