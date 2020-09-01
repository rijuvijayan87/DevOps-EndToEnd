const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization');
  if (typeof token !== 'string'){
    res.status(400).json({
      msg: 'Invalid Auth header'
    });
    return;  
  }
  const jwtTokenArr = token.split(' ');
  
  if (jwtTokenArr.length < 2){
    res.status(400).json({
      msg: 'Invalid Auth header'
    })
    return;
  }


  var jwtToken = jwtTokenArr[1];

  // Check if not token
  if (!jwtToken) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    jwt.verify(jwtToken, config.get('jwtSecret'), (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};
