const {
    handleRegister,
    handleInitiateReset,
    handleVerifyToken,
    handleResetPassword,  
    handleSendToken,
    handleSignIn,
  } = require("../controller/auth.controller");
  
  const router = require("express").Router();
  
  // POST REGISTER ROUTE
  router.post("/signup", handleRegister);
  
  // POST LOGIN ROUTE
  router.post("/signin", handleSignIn);
  
  // POST RESET PASSWORD INITIALIZE ROUTE
  router.post("/reset/initiate", handleInitiateReset);
  
  // POST RESET PASSWORD VERIFY ROUTE
  router.post("/reset/verify/:id", handleResetPassword);
  
  // POST SEND EMAIL VERIFICATION TOKEN ROUTE
  router.post("/send-token", handleSendToken);
  
  // POST EMAIL VERIFICATION ROUTE
  router.post("/verify-token", handleVerifyToken);
  
  module.exports = router;
  