const User = require("../model/user.model");
const Token = require("../model/token.model");
const { response, generateToken, except } = require("../utils");
const bcrypt = require("bcrypt");
const { sendMail } = require("../utils/mailer");
const { generateAuthToken } = require("../utils/token");

// HANDLE USER'S REGISTRATION
const handleRegister = async (req, res) => {
  try {
    if (!req.body.firstname) throw new Error("First name is required");
    if (!req.body.lastname) throw new Error("Last name is required");
    if (!req.body.email) throw new Error("Email is required");
    if (!req.body.password) throw new Error("Password is required");

    // CHECK IF USER ALREADY EXISTS
    const exists = await User.findOne({ email: req.body.email });
    if (exists) throw new Error("User already exists");

    // HASH THE PASSWORD
    req.body.password = await bcrypt.hash(req.body.password, 10);

    // CREATE NEW USER
    let user = await User.create(req.body);
    user = except(user.toObject(), "password", "__v")
    
    res.status(200).send(response("Account Created!!", user));
  } catch (error) {
    res.status(400).send(response(error.message, null, false));
  }
};

const handleSignIn = async (req, res) => {
  try {
    if (!req.body.email) throw new Error("Email is required");
    if (!req.body.password) throw new Error("Password is required");

    // CHECK IF USER EXISTS
    let user = await User.findOne(
      { email: req.body.email },
      { __v: 0, createdAt: 0, updatedAt: 0 }
    );
    if (!user) throw new Error("Incorrect Crediential");

    if(!await bcrypt.compare(req.body.password, user.password)) throw new Error("Incorrect Crediential");

    // GENERATE TOKEN
    const token = generateAuthToken({ userId: user._id, role: user.role });
    
    // REMOVE PASSWORD FROM THE RESPONSE DATA
    user = except(user.toObject(), "password")
    
    // SEND RESPONSE
    res.status(200).send(response("Logged in successfully", { user, token }));
  } catch (error) {
    res.status(400).send(response(error.message, null, false));
  }
};

// HANDLE SEND TOKEN
const handleSendToken = async (req, res) => {
  try {
    if (!req.body.email) throw new Error("Email is required");

    // CHECK IF THERE TOKEN ALREADY
    const prevToken = await Token.findOne({ email: req.body.email });
    if (prevToken) {
      await prevToken.deleteOne();
    }

    // GENERATE NEW TOKEN
    const code = generateToken();
    await Token.create({
      email: req.body.email,
      token: code,
    });

    // SEND EMAIL
    const message = ` 
      <html>
        <body>
          <p>Here is your verification code <b>${code}</b></p>
        </body>
      </html>
    `;
    await sendMail(req.body.email, "Verification Token", message);

    res.status(200).send(response("Verification code sent!!"));
  } catch (error) {
    res.status(400).send(response(error.message, null, false));
  }
};

// HANDLE VERIFY TOKEN
const handleVerifyToken = async (req, res) => {
  try {
    if (!req.body.token) throw new Error("Token is required");
    if (!req.body.email) throw new Error("Email is required");

    // CHECK IF THERE'S USER TOKEN
    const storedToken = await Token.findOne({ email: req.body.email });
    if (!storedToken) throw new Error("Invalid token");

    // CHECK IF BOTH TOKENS MATCH
    if (storedToken.token != req.body.token)
      throw new Error("Token does not match");

    // DELETE STORED TOKEN
    await storedToken.deleteOne();

    res.status(200).send(response("Verification Completed!"));
  } catch (error) {
    res.status(400).send(response(error.message, null, false));
  }
};

// HANDLE SEND RESET LINK
const handleInitiateReset = async (req, res) => {
  try {
    if (!req.body.email) throw new Error("Email is required");

    // CHECK IF USER EXISTS
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User does not exist");

    // GENERATE RESET LINK
    const link = `${process.env.APP_URL}?id=${user?._id}`;
    const message = ` 
      <html>
        <body>
          <p>Here is your reset password link <a href="${link}">${link}</a></p>
        </body>
      </html>
    `;

    await sendMail(req.body.email, "Reset Link", message);

    // SEND RESET LINKS
    res.status(200).send(response("Reset link sent!!"));
  } catch (error) {
    res.status(400).send(response(error.message, null, false));
  }
};

// HANDLE RESET PASSWORD
const handleResetPassword = async (req, res) => {
  try {
    if (!req.params.id) throw new Error("Request ID  is required");
    if (!req.body.password) throw new Error("Password is required");
    if (!req.body.confirmPassword)
      throw new Error("Password Confirm is required");

    // CHECK IF USER EXISTS
    const user = await User.findOne({ _id: req.params.id });
    if (!user) throw new Error("User does not exist");

    // CHECK IF PASSWORDS MATCH
    if (req.body.confirmPassword !== req.body.password)
      throw new Error("Passwords do not match");

    // HASH PASSWORD
    req.body.password = await bcrypt.hash(req.body.password, 10);

    // UPDATE PASSWORD
    user.password = req.body.password;
    await user.save();

    // SEND NOTIFICATION MAIL
    const message = ` 
      <html>
        <body>
          <p>Hi ${user.firstname}, your password has been updated!</p>
        </body>
      </html>
    `;

    await sendMail(user.email, "Password Update", message);

    // SEND RESET LINKS
    res.status(200).send(response("Password updated!"));
  } catch (error) {
    res.status(400).send(response(error.message, null, false));
  }
};

module.exports = {
  handleRegister,
  handleVerifyToken,
  handleSendToken,
  handleSignIn,
  handleResetPassword,
  handleInitiateReset,
};