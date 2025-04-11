const jwt = require("jsonwebtoken");
const ManagerModel = require("../models/manager");
const AgencyService2 = require("../services/v2/agency");

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
        const manager = await AgencyService2.getAgency(id);
        if (!manager || !manager.status) {
            res.status(401).json();
            return
        }
        req.manager = manager.toJSON();
        next();
    } catch (error) {
        res.status(401).json();
        return
    }
}

module.exports = authenticate