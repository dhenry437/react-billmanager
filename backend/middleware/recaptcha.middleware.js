const axios = require("axios");

const verifyReCaptcha = async (req, res, next) => {
  const { token } = req.body;

  let requestBody = `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;

  const reCaptchaResponse = await axios
    .post("https://www.google.com/recaptcha/api/siteverify", requestBody)
    .catch(function (error) {
      return error.response;
    });

  if (reCaptchaResponse.data.success) {
    next();
  } else {
    res.status(400).send({
      alert: {
        type: "danger",
        message: "Invalid reCaptcha",
      },
    });

    return;
  }
};

module.exports = {
  verifyReCaptcha,
};
