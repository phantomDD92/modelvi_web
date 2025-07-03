// export const API_PATH = "http://localhost:5000/api";
// export const SERVER_PATH = "http://localhost:5000";
export const API_PATH = `${window.location.protocol}//${window.location.host}/api`;
export const SERVER_PATH = `${window.location.protocol}//${window.location.host}`;

export const DEFAULT_REFRESH_TIMEOUT = 180000;
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_CURRENT_PAGE = 1;

export const DEFAULT_POST_INTERVAL = 60;
export const DEFAULT_POST_COUNT = 5;
export const DEFAULT_POST_MODE = "interval";
export const DEFAULT_POST_OFFSETS = "1,21,51";
export const DEFAULT_COMMENT_INTERVAL = 30;
export const DEFAULT_STORY_INTERVAL = 10;
export const DEFAULT_STORY_COUNT = 6;
export const DEFAULT_STORY_REPLACE = 1;

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
    FANLIKE: "FANLIKE"
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
}

export const TransactionType = {
    CHARGE_NOWPAYMENT: 1,
    EXPENSE: 2,
    CHARGE_INVOICE: 3,
}