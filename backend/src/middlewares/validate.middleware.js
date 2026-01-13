export const validate =
  (schema, property = 'body') =>
  (req, res, next) => {
    try {
      schema.parse(req[property]);
      next();
    } catch (err) {
      res.status(400).json({
        message: 'Validation error',
        errors: err.errors,
      });
    }
  };
