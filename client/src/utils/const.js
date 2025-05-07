// export const API_PATH = "http://localhost:5000/api";
// export const SERVER_PATH = "http://localhost:5000";
export const API_PATH = `${window.location.protocol}//${window.location.host}/api`;
export const SERVER_PATH = `${window.location.protocol}//${window.location.host}`;

export const DEFAULT_REFRESH_TIMEOUT = 180000;
export const DEFAULT_PAGE_SIZE = 10;
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
    FANVUE: "FANVUE",
    FNS: "FNS", // for fancentro story
    KNKY: "KNKY",
    MALOUM: "MALOUM",
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

export const AdminRole = {
    MANAGER: 1,
    AGENCY: 2,
}

export const PostMode = {
    INTERVAL: "interval",
    LIMITED: "limited",
    OFFSET: "offset",
}

export const F2FPostType = {
    PUBLIC: 0,
    EXCLUSIVE_FOR_FANS: 1,
    ONLY_NON_FANS_MUST_PAY: 2,
    PAID_FOR_EVERYONE: 3,
    VIP_POST: 4,
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