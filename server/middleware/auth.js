const jwt = require("jsonwebtoken");
const ManagerService = require("../services/manager");

const authenticate = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            res.status(401).json();
            return
        }
        tokens = token.split(" ")
        if (tokens.length != 2) {
            res.status(401).json();
            return
        }
        const {id} = jwt.decode(tokens[1]);
        const manager = await ManagerService.findById(id);
        if (!manager) {
            res.status(401).json();
            return
        }
        req.manager = manager;
        next();    
    } catch (error) {
        res.status(401).json();
        return
    }
}

module.exports = authenticate