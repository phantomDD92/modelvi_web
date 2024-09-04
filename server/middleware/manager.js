const { AdminRole } = require("../config/const");

const checkManager = async (req, res, next) => {
    if (req.manager && req.manager.role == AdminRole.MANAGER) {
        next();
    } else {
        res.status(403).json();
    }
}

module.exports = checkManager