var express = require('express');
var router = express.Router();
const userController = require('../controllers/userControllers');
const { body, validationResult } = require('express-validator');
const paassportJWT = require('../middleware/passportJWT');

router.post('/register', [
  body('name').not().isEmpty().withMessage('กรุณากรอกชื่อผู้ใช้งาน'),
  body('email').not().isEmpty().withMessage('กรุณากรอกอีเมลล์').isEmail().withMessage('รูปแบบอีเมลล์ไม่ถูกต้อง'),
  body('password').not().isEmpty().withMessage('กรุณากรอกรหัสผ่าน').isLength({min:3}).withMessage('รหัสผ่านตั้งแต่ 3 ตัวขึ้นไป'),
],userController.register);

router.post('/login',userController.login);

router.get('/me/:id',[paassportJWT.isLogin] ,userController.me);
router.put('/editProfile',[paassportJWT.isLogin] ,userController.editProfile);
router.put('/changeEmail',[paassportJWT.isLogin, body('email').isEmail().withMessage('รูปแบบอีเมลล์ไม่ถูกต้อง')] ,userController.changeEmail);
router.put('/changePassword',[paassportJWT.isLogin] ,userController.changePassword);
router.put('/forgotPassword',userController.forgotPassword);

module.exports = router;
