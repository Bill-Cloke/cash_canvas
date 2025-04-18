import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Forbidden - Invalid token" });
    req.user = decoded; // decoded contains userId and other data
    next();
  });
};

export default authenticate;