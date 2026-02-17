import User from "../models/User.js";

// Get Profile
export const getProfile = async (req, res) => {
  try {
    // req.user.id comes from the authMiddleware
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Find user and update
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
