var express = require('express');
var router = express.Router();
const userController = require('../controllers/userControllers');
const { body, validationResult } = require('express-validator');
const paassportJWT = require('../middleware/passportJWT');
//localhost:3000/users/register
router.post('/register', [
  body('name').not().isEmpty().withMessage('กรุณากรอกชื่อข้อมูล'),
  body('email').not().isEmpty().withMessage('กรุณากรอกอีเมลล์').isEmail().withMessage('รูปแบบอีเมลล์ไม่ถูกต้อง'),
  body('password').not().isEmpty().withMessage('กรุณากรอกรหัสผ่าน').isLength({min:3}).withMessage('รหัสผ่านตั้งแต่ 3 ตัวขึ้นไป'),
],userController.register);

router.post('/login',userController.login);

router.post('/me',[paassportJWT.isLogin] ,userController.me);

module.exports = router;
