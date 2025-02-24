
const Status = {
    ALL: 0,
    ENABLED: 1,
    DISABLED: 2,
};

const Platform = {
    ALL: "ALL",
    FNC: "FNC", // fancentro posting
    F2F: "F2F", // f2f posting
    FAN: "FAN", // fansly posting
    FNS: "FNS", // fancentro storying
    KNKY: "KNKY", 
    FANVUE: "FANVUE", 
    MALOUM: "MALOUM",
}

const PostType = {
    FREE: 1,
    FAN: 2,
    PAID: 3,
}

const PostMode = {
    INTERVAL: "interval",
    OFFSETS: "offsets",
    LIMITED: "limited",
}

const StoryType = {
    NONE: 0,
    PUBLIC: 1,
    FOLLOWER: 2,
    SUBSCRIBER: 4,
};

const Protocol = {
    HTTP: "http",
    HTTPS: "https",
}

const AdminRole = {
    MANAGER: 1,
    AGENCY: 2,
}

module.exports = {
    Status,
    Platform,
    Protocol,
    PostType,
    AdminRole,
    StoryType,
    PostMode,
}