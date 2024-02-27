const router = require("express").Router();
const User = require("../models/user");
const {ensureAuthenticated} = require("../middleware/auth");

router.get("/home", (req, res) => {
 
       res.render('index', {error: ''})
 });
router.get("/register", (req, res) => {
    res.render('signup', {error: ''})
});

router.get("/forgot", (req, res) => {
    res.render('forgot', {error: ''})
});

router.get("/reset", (req, res) => {
    res.render('reset', {error: ''})
});


router.get("/", ensureAuthenticated, async (req, res) => {

    const id = req.user.user_id;
    
  try {
    const doc = await User.findById(id);
    res.render('account', { username: doc.name, error: '' , email: doc.email });

  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
