const router = require("express").Router();
const authRoutes = require("./auth-routes");
const publicRoutes = require("./public-routes");

router.use("/auth", authRoutes);
router.use('/', publicRoutes);

module.exports = router;
