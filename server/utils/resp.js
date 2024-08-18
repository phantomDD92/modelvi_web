function ApiError(message = "") {
  this.name = "ApiError";
  this.message = message;
}
ApiError.prototype = Error.prototype;

const sendResult = (res, payload) => {
  res.json({ success: true, payload });
};

const sendError = (res, error) => {
    if (error.name == "ApiError") {
        res.json({success: false, message: error.message})
    } else {
        console.error(error)
        res.json({success: false, message: "internal server error"})
    }
}

module.exports = {
    ApiError,
    sendResult,
    sendError,
}