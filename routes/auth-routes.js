const router = require("express").Router();
const {
  login,
  register,
  updateOne,
  logout, forgotPassword, resetPassword
} = require("../controllers/auth-controller");

const {ensureAuthenticated} = require("../middleware/auth");


router.post("/login", async (req, res) => {
  await login(req.body, res);
});

router.post("/register", async (req, res) => {
  await register(req.body, res);
});

router.post("/update", ensureAuthenticated, async (req, res) => {
  await updateOne(req, res);
});

router.post("/forgot", async (req, res) => {
  await forgotPassword(req, res);
});

router.post("/reset", async (req, res) => {
  await resetPassword(req, res);
});

router.get("/logout", ensureAuthenticated, async (req, res) => {
  await logout(req, res)
});
module.exports = router;
