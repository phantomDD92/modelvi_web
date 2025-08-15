const { AdminRole } = require("../config/const");

const checkSuperAdmin = async (req, res, next) => {
    if (req.manager && req.manager.role == AdminRole.MANAGER && req.manager.name == "Eric") {
        next();
    } else {
        res.status(403).json();
    }
}

module.exports = checkSuperAdmin