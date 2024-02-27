const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");
const { forgotPasswordSender } = require("../mailers/senders");


const register = async (data, res) => {
  try {
    const userTaken = await validateEmail(data.email);
    if (userTaken) {
        return res.render('signup', { error: 'email taken' });
    }
    const nameTaken = await validateName(data.name);
    if (nameTaken) {
      return res.render('signup', { error: 'name taken' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new User({
      ...data,
      password: hashedPassword,
    });

    await newUser.save();

    return res.render('index', {error: ''});

  } catch (err) {

  return res.render('signup', { error: 'error creating account' });
  }
};

const login = async (data, res) => {
  try {
    let { email, password } = data;
    const user = await User.findOne({ email });
    if (!user) {
    return res.render('index.ejs', { error: 'email or password invalid' });

    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let token = jwt.sign(
        {
          user_id: user._id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7 days",
        }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
      });

    res.redirect('/');

    } else {
     return res.render('index', { error: 'error logging in' });

    }
  } catch (err) {
    return res.render('index', { error: 'an error occured' });

  }
};

const updateOne = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const { name, email} = req.body;
    const updateData = {
      name,
      email: email.toLowerCase(),
    };

    const updatedData = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });


    if (!updatedData) {
      console.log('user not found');
    }

    req.user.name = updatedData.name;
    req.user.email = updatedData.email;

    res.redirect('/')
    
  } catch (error) {

  res.render('account', { username: req.user.name, error: 'error updating user' , email: req.user.email });

  }
};

const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
};

const forgotPassword = async (req, res) => {
    try {
        let { email } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
          res.render('forgot', {error: 'Invalid Email'})

        }

        const code = crypto.randomInt(100000, 1000000);
        const passwordResetCode = await bcrypt.hash(code.toString(), 16);
        user.passwordResetCode = passwordResetCode;
        await user.save();
        forgotPasswordSender(user.email, user.name, code);
        res.redirect('/reset')

    } catch (err) {
      console.log(err);
        res.render('forgot', {error: 'Failed!!'})

    }
};

const resetPassword = async (req, res) => {
    try {
        let { email, code, newPassword } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
              return res.render('reset', {error: 'invalid email'})
        }
        let isMatch = await bcrypt.compare(code.toString(), user.passwordResetCode);

        if (isMatch) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            user.password = hashedPassword;
            user.passwordResetCode = "";
            await user.save();
            res.redirect('/')
        } else {
              res.render('reset', {error: 'invalid code'})
        }
    } catch (err) {
      console.log(err);
      res.render('reset', {error: 'password reset error'})

    }
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  if (user) {
    return true;
  } else {
    return false;
  }
};
const validateName = async (name) => {
  let user = await User.findOne({ name });
  return user !== null;
};

module.exports = {
  login,
  register,
  updateOne,
  logout,
  forgotPassword, resetPassword
};
