export const isAdmin = (req, res, next) => {
  console.log(req.user)
  const userIdToCheck = req.params.id;
  const loggedInUserId = req.user.id;

  if (userIdToCheck === loggedInUserId) {
    next();
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
}