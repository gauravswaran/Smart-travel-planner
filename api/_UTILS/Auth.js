import jwt from "jsonwebtoken";

export function authenticate(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Please login first"
    });
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return decoded.userId;

  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token"
    });
    return null;
  }
}