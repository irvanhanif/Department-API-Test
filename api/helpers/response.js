module.exports = {
  SUCCESS: (res, code, data) => {
    return res.status(code).json({
      success: true,
      data: data,
    });
  },
  ERROR: (res, code, message, data = []) => {
    return res.status(code).json({
      success: false,
      data: data,
      message: message,
    });
  },
};
