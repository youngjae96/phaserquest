// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 회원가입
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: '이미 존재하는 닉네임입니다.' });

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error('회원가입 중 오류 발생:', err); // ✅ 이 줄 추가
    res.status(500).json({ message: '서버 오류' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: '존재하지 않는 유저입니다.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });

    req.session.user = { id: user._id, username: user.username };
    res.json({ message: '로그인 성공' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
