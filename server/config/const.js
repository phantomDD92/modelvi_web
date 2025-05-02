
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

const AgencyRole = {
    MANAGER: 1,
    AGENCY: 2,
}

const PaymentStatus = {
    WAITING: "waiting",
    CONFIRMING: "confirming",
    CONFIRMED: "confirmed",
    SENDING: "sending",
    PARTIALLY_PAID: "partially_paid",
    FINISHED: "finished",
    EXPIRED: "expired",
    CANCEL: "cancel",
}

const TransactionType = {
    CHARGE: 1,
    EXPENSE: 2,
}

const ScheduleStatus = {
    WAITING: 1,
    SCHEDULED: 2,
    FINISHED: 3,
    FAILED: 4,
}

module.exports = {
    Status,
    Platform,
    Protocol,
    PostType,
    AdminRole: AgencyRole,
    StoryType,
    PostMode,
    PaymentStatus,
    TransactionType,
    ScheduleStatus,
}