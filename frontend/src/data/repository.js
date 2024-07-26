import axios from "axios";

export const createUser = async fields => {
  const response = await axios.post("/users", fields).catch(function (error) {
    return error.response;
  });

  return response;
};
