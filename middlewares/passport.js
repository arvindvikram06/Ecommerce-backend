const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback", // Callback URL after Google login
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        // If user doesn't exist, create a new one
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: null, // No password for Google-authenticated users
          });
          await user.save();
        }

        done(null, user); // Passing user info for serialization
      } catch (err) {
        done(err, null); // Error handling
      }
    }
  )
);

// Serialize and deserialize user for maintaining the session (if needed)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
