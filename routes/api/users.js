const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const router = express.Router();


//load config
const keys = require('../../config/keys')

//load user model
const User = require('../../models/User')

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get('/test', (req, res) => res.json({
  msg: 'Users Works'
}));

// @route GET api/users/register
// @desc Register a user
router.post('register', (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route GET api/users/login
// @desc Login user / returning JWT
// @access Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({
      email
    })
    .then(user => {
      //Check for user
      if (!user) {
        return res.status(404).json({
          email: 'Email or password is incorrect'
        });
      }

      //check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // User matched

            //create jwt payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }

            // Sign the token
            // Set token to expire in 1 hour
            jwt.sign(
              payload,
              keys.secrerOrKey,
              {expiresIn: 3600},
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                })
            });
          } else {
            return res.status(400).json({
              password: 'Email or password is incorrect'
            });
          }
        })
    })
})

module.exports = router;