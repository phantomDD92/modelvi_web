// export const API_PATH = "http://localhost:5000/api";
// export const SERVER_PATH = "http://localhost:5000";
export const API_PATH = `${window.location.protocol}//${window.location.host}/api`;
export const SERVER_PATH = `${window.location.protocol}//${window.location.host}`;

export const STRIPE_PUBLIC_KEY="pk_test_51T7E3qKCantw8sNkmRHZdAcQoHY2ftX3WeUSi3e95Mar0WAi9Mq6T6PJmftL1cqBPR2TN7rETZKhRh5McQY3eV5f0039BluVL9"

export const DEFAULT_REFRESH_TIMEOUT = 180000;
export const DEFAULT_PAGE_SIZE = 20;
export const LARGE_PAGE_SIZE = 100;
export const DEFAULT_CURRENT_PAGE = 1;

export const DEFAULT_POST_INTERVAL = 60;
export const DEFAULT_POST_COUNT = 5;
export const DEFAULT_POST_MODE = "interval";
export const DEFAULT_POST_OFFSETS = "1,21,51";
export const DEFAULT_COMMENT_INTERVAL = 30;
export const DEFAULT_STORY_INTERVAL = 10;
export const DEFAULT_STORY_COUNT = 6;
export const DEFAULT_STORY_REPLACE = 1;

export const DEFAULT_DUE_DATE = 1;

export const Platform = {
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
    PORNHUB: "PORNHUB",
    BESTFANS: "BESTFANS",
    FANLIKE: "FANLIKE",
    FETLIFELIKE: "FETLIFELIKE",
}

export const AgencyRole = {
    MANAGER: 1,
    AGENCY: 2,
}

export const PostType = {
    FREE: 1,
    FAN: 2,
    PAID: 3,
}

// fancentro story type
export const StoryType = {
    NONE: 0,
    PUBLIC: 1,
    FOLLOWER: 2,
    SUBSCRIBER: 4,
};

// knky story type
export const KnkyStoryType = {
    NONE: 0,
    PUBLIC: 1,
    PRIME: 2,
    PAYTOVIEW: 4,
};

export const PricePlanMode = {
    PER_MODEL: 0,
    PER_ACCOUNT: 1,
}

export const F2FStoryType = {
    NONE: 0,
    PUBLIC: 1,
    FOLLOWERS: 2,
    FANS: 4,
};

export const AdminRole = {
    MANAGER: 1,
    AGENCY: 2,
}

export const PostMode = {
    INTERVAL: "interval",
    LIMITED: "limited",
    OFFSET: "offset",
}

export const ScheduleStatus = {
    WAITING: 1,
    SCHEDULED: 2,
    FINISHED: 3,
    FAILED: 4,
    EXPIRED: 5,
}

export const TransactionType = {
    CHARGE_NOWPAYMENT: 1,
    EXPENSE: 2,
    CHARGE_INVOICE: 3,
}

export const ActionType = {
    LOGIN: 0,
    UPDATE: 1,
    UPLOAD: 2,
    POST: 3,
    STORY: 4,
    COMMENT: 5,
    CHAT: 6,
    BALANCE: 7,
    SCHEDULE: 8,
};