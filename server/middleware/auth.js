const jwt = require("jsonwebtoken");
const ManagerModel = require("../models/manager");

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
        const { id } = jwt.verify(tokens[1], process.env.SECRET_KEY || "SECRET_KEY_MODELVI");
        const manager = await ManagerModel.findById(id, "name email telegram role balance status verified maxAccounts maxActors");
        if (!manager || !manager.status) {
            res.status(401).json();
            return
        }
        req.manager = manager;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json();
        return
    }
}

module.exports = authenticate