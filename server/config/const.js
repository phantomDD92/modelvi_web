
const Status = {
    ALL: 0,
    ENABLED: 1,
    DISABLED: 2,
};

const Platform = {
    ALL: "ALL",
    F2F: "F2F",
    FNC: "FNC",
    FAN: "FAN",
    KNKY: "KNKY",
    MALOUM: "MALOUM",
    ONLYFANS: "ONLYFANS",
    LOYALFANS: "LOYALFANS",
    MYMFANS: "MYMFANS",
    FETLIFE: "FETLIFE",
    FOURBASED: "FOURBASED",
    DFANXYZ: "DFANXYZ",
    UNFILTRD: "UNFILTRD",
    MYCLUB: "MYCLUB",
    MANYVIDS: "MANYVIDS",
    FANVUE: "FANVUE",
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
    CHARGE_NOWPAYMENT: 1,
    EXPENSE: 2,
    CHARGE_INVOICE: 3,
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