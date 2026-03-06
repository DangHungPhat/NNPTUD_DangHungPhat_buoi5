var express = require('express');
var router = express.Router();
let { IncrementalId } = require('../utils/IncrementalIdHandler');
let { users } = require('../utils/users');

// POST /api/v1/users/enable
// Truyền lên email + username, nếu đúng thì chuyển status = true
router.post('/enable', function (req, res, next) {
  let { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).send({ message: "email và username là bắt buộc" });
  }

  let user = users.find(function (u) {
    return !u.isDeleted && u.email === email && u.username === username;
  });

  if (!user) {
    return res.status(404).send({ message: "Không tìm thấy user với email và username đã cung cấp" });
  }

  user.status = true;
  user.updatedAt = new Date(Date.now());

  res.status(200).send({
    message: "Tài khoản đã được kích hoạt (status = true)",
    user: user
  });
});

// POST /api/v1/users/disable
// Truyền lên email + username, nếu đúng thì chuyển status = false
router.post('/disable', function (req, res, next) {
  let { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).send({ message: "email và username là bắt buộc" });
  }

  let user = users.find(function (u) {
    return !u.isDeleted && u.email === email && u.username === username;
  });

  if (!user) {
    return res.status(404).send({ message: "Không tìm thấy user với email và username đã cung cấp" });
  }

  user.status = false;
  user.updatedAt = new Date(Date.now());

  res.status(200).send({
    message: "Tài khoản đã bị vô hiệu hoá (status = false)",
    user: user
  });
});

// GET tất cả users (loại bỏ đã xoá mềm)
// GET /api/v1/users
router.get('/', function (req, res, next) {
  let result = users.filter(function (user) {
    return !user.isDeleted;
  });
  res.status(200).send(result);
});

// GET user theo ID
// GET /api/v1/users/:id
router.get('/:id', function (req, res, next) {
  let result = users.find(function (user) {
    return !user.isDeleted && user.id == req.params.id;
  });

  if (result) {
    res.status(200).send(result);
  } else {
    res.status(404).send({ message: "ID NOT FOUND" });
  }
});

// POST - Tạo user mới
// POST /api/v1/users
router.post('/', function (req, res, next) {
  let { username, password, email, fullName, avatarUrl, status, role, loginCount } = req.body;

  // Validate các trường bắt buộc
  if (!username || !password || !email) {
    return res.status(400).send({ message: "username, password và email là bắt buộc" });
  }

  // Kiểm tra unique username
  let dupUsername = users.find(function (u) {
    return !u.isDeleted && u.username === username;
  });
  if (dupUsername) {
    return res.status(400).send({ message: "username đã tồn tại" });
  }

  // Kiểm tra unique email
  let dupEmail = users.find(function (u) {
    return !u.isDeleted && u.email === email;
  });
  if (dupEmail) {
    return res.status(400).send({ message: "email đã tồn tại" });
  }

  // Validate loginCount >= 0
  let parsedLoginCount = loginCount !== undefined ? parseInt(loginCount) : 0;
  if (parsedLoginCount < 0) {
    return res.status(400).send({ message: "loginCount phải >= 0" });
  }

  let newUser = {
    id: IncrementalId(users),
    username: username,
    password: password,
    email: email,
    fullName: fullName !== undefined ? fullName : "",
    avatarUrl: avatarUrl !== undefined ? avatarUrl : "https://i.sstatic.net/l60Hf.png",
    status: status !== undefined ? status : false,
    role: role !== undefined ? role : null,
    loginCount: parsedLoginCount,
    isDeleted: false,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  };

  users.push(newUser);
  res.status(201).send(newUser);
});

// PUT - Cập nhật user
// PUT /api/v1/users/:id
router.put('/:id', function (req, res, next) {
  let result = users.find(function (user) {
    return !user.isDeleted && user.id == req.params.id;
  });

  if (!result) {
    return res.status(404).send({ message: "ID NOT FOUND" });
  }

  let { username, password, email, fullName, avatarUrl, status, role, loginCount } = req.body;

  if (username !== undefined) {
    let dup = users.find(function (u) {
      return !u.isDeleted && u.username === username && u.id != req.params.id;
    });
    if (dup) return res.status(400).send({ message: "username đã tồn tại" });
    result.username = username;
  }

  if (email !== undefined) {
    let dup = users.find(function (u) {
      return !u.isDeleted && u.email === email && u.id != req.params.id;
    });
    if (dup) return res.status(400).send({ message: "email đã tồn tại" });
    result.email = email;
  }

  if (password !== undefined) result.password = password;
  if (fullName !== undefined) result.fullName = fullName;
  if (avatarUrl !== undefined) result.avatarUrl = avatarUrl;
  if (status !== undefined) result.status = status;
  if (role !== undefined) result.role = role;

  if (loginCount !== undefined) {
    let parsed = parseInt(loginCount);
    if (parsed < 0) return res.status(400).send({ message: "loginCount phải >= 0" });
    result.loginCount = parsed;
  }

  result.updatedAt = new Date(Date.now());
  res.status(200).send(result);
});

// DELETE - Xoá mềm user
// DELETE /api/v1/users/:id
router.delete('/:id', function (req, res, next) {
  let result = users.find(function (user) {
    return !user.isDeleted && user.id == req.params.id;
  });

  if (!result) {
    return res.status(404).send({ message: "ID NOT FOUND" });
  }

  result.isDeleted = true;
  result.updatedAt = new Date(Date.now());

  res.status(200).send({
    message: "User đã được xoá mềm thành công",
    user: result
  });
});

module.exports = router;
