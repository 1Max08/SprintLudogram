export const success = (res, status, data) => {
  res.status(status).json({ success: true, data });
};

export const error = (res, status, message) => {
  res.status(status).json({ success: false, message });
};
