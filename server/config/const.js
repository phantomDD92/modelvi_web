
const Status = {
    ALL: 0,
    ENABLED: 1,
    DISABLED: 2,
};

const Platform = {
    ALL: "ALL",
    FNC: "FNC",
    F2F: "F2F",
}

const PostType = {
    FREE: 1,
    FAN: 2,
    PAID: 3,
}

const Protocol = {
    HTTP: "http",
    HTTPS: "https",
}

const AdminRole = {
    SUPER: 1,
    NORMAL: 2,
}

module.exports = {
    Status,
    Platform,
    Protocol,
    PostType,
    AdminRole
}