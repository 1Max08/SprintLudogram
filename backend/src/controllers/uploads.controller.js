export const uploadImage = (req, res) => {
  res.status(201).json({
    imageUrl: `/uploads/${req.file.filename}`,
  });
};
