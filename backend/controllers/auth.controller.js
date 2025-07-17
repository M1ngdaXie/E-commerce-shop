export const signup = (req, res) => {
  const { name, email, password } = req.body;
  // TODO: Implement signup logic
  res.send("Signup route");
};

export const login = (req, res) => {
  res.send("Login route");
};

export const logout = (req, res) => {
  res.send("Logout route");
};
