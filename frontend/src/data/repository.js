import axios from "axios";

export const createUser = async fields => {
  const response = await axios.post("/users", fields).catch(function (error) {
    return error.response;
  });

  return response;
};

export const signIn = async fields => {
  const response = await axios
    .post("/auth/sign-in", fields)
    .catch(function (error) {
      return error.response;
    });

  return response;
};

export const signOut = async () => {
  const response = await axios.post("/auth/sign-out").catch(function (error) {
    return error.response;
  });

  return response;
};

export const getUser = async () => {
  const response = await axios.get("/auth/user").catch(function (error) {
    return error.response;
  });

  return response;
};

export const createEvent = async fields => {
  const response = await axios.post("/events", fields).catch(function (error) {
    return error.response;
  });

  return response;
};

export const getEventsCurrentUser = async type => {
  const response = await axios
    .get("/events", { params: { type } })
    .catch(function (error) {
      return error.response;
    });

  return response;
};

export const getEventById = async id => {
  const response = await axios
    .get("/events", { params: { id } })
    .catch(function (error) {
      return error.response;
    });

  return response;
};

export const updateEvent = async (id, fields) => {
  const response = await axios
    .put(`/events/${id}`, fields)
    .catch(function (error) {
      return error.response;
    });

  return response;
};

export const deleteEventById = async id => {
  const response = await axios
    .delete(`/events/${id}`, { params: { id } })
    .catch(function (error) {
      return error.response;
    });

  return response;
};

export const getCalendarEvents = async yearMonth => {
  const response = await axios
    .get(`/calendar/${yearMonth}`, { params: {} })
    .catch(function (error) {
      return error.response;
    });

  return response;
};
