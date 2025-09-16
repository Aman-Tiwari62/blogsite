import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token; // comes from httpOnly cookie
  if (!token) {
    return res.redirect("/auth/loginForm"); // not logged in
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    console.log("JWT error:", err.message);
    return res.redirect("/auth/loginForm");
  }
};
