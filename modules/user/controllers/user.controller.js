import User from '../models/user.model.js';

// Signup user
export const signupUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login user and create a session
export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await user.comparePassword(req.body.password);
    if (!isValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Regenerate the session to avoid fixation
    req.session.regenerate(err => {
      if (err) {
        return res.status(500).json({ message: 'Failed to regenerate session' });
      }

      // Create a new object to store the user's data
      const userData = {
        userId: user._id,
        email: user.email,
      };

      // Store the user's data in the session object using the session ID as the key
      req.session[req.session.id] = userData;

      req.session.save(err => {
        if (err) {
          return res.status(500).json({ message: 'Failed to save session' });
        }

        res.status(200).json({ message: 'Logged in successfully' });
      });
    });
  } catch (error) {
    console.log('Error during login:', error);
    res.status(500).json({ message: error.message });
  }
};

// Check if a session exists
export const checkSession = async (req, res) => {
  try {
    if (!req.session || !req.session[req.session.id]) {
      return res.status(401).json({ message: 'No session found' });
    }

    const userData = req.session[req.session.id];
    const userId = userData.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    res.status(200).json({ message: 'Session is valid' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout user and destroy the session
export const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    } else {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.status(200).json({ message: 'Logged out successfully' });
    }
  });
};
