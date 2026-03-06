var express = require('express');
var router = express.Router();
let { IncrementalId } = require('../utils/IncrementalIdHandler');
let { roles } = require('../utils/roles');

// GET tất cả roles (loại bỏ đã xoá mềm)
// GET /api/v1/roles
router.get('/', function (req, res, next) {
    let result = roles.filter(function (role) {
        return !role.isDeleted;
    });
    res.status(200).send(result);
});

// GET role theo ID
// GET /api/v1/roles/:id
router.get('/:id', function (req, res, next) {
    let result = roles.find(function (role) {
        return !role.isDeleted && role.id == req.params.id;
    });

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

// POST - Tạo role mới
// POST /api/v1/roles
router.post('/', function (req, res, next) {
    let { name, description } = req.body;

    if (!name) {
        return res.status(400).send({ message: "name là bắt buộc" });
    }

    // Kiểm tra name trùng
    let existed = roles.find(function (role) {
        return !role.isDeleted && role.name === name;
    });
    if (existed) {
        return res.status(400).send({ message: "name đã tồn tại" });
    }

    let newRole = {
        id: IncrementalId(roles),
        name: name,
        description: description !== undefined ? description : "",
        isDeleted: false,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
    };

    roles.push(newRole);
    res.status(201).send(newRole);
});

// PUT - Cập nhật role
// PUT /api/v1/roles/:id
router.put('/:id', function (req, res, next) {
    let result = roles.find(function (role) {
        return !role.isDeleted && role.id == req.params.id;
    });

    if (!result) {
        return res.status(404).send({ message: "ID NOT FOUND" });
    }

    let { name, description } = req.body;

    if (name !== undefined) {
        // Kiểm tra name trùng với role khác
        let duplicated = roles.find(function (role) {
            return !role.isDeleted && role.name === name && role.id != req.params.id;
        });
        if (duplicated) {
            return res.status(400).send({ message: "name đã tồn tại" });
        }
        result.name = name;
    }

    if (description !== undefined) result.description = description;

    result.updatedAt = new Date(Date.now());
    res.status(200).send(result);
});

// DELETE - Xoá mềm role
// DELETE /api/v1/roles/:id
router.delete('/:id', function (req, res, next) {
    let result = roles.find(function (role) {
        return !role.isDeleted && role.id == req.params.id;
    });

    if (!result) {
        return res.status(404).send({ message: "ID NOT FOUND" });
    }

    result.isDeleted = true;
    result.updatedAt = new Date(Date.now());

    res.status(200).send({
        message: "Role đã được xoá mềm thành công",
        role: result
    });
});

module.exports = router;
