

export const authenticateRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user['role'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: `Forbidden: ${role} not valid` });
    }

    next();
  };
};
