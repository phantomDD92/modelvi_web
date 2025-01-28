// export const API_PATH = "http://localhost:5000/api";
// export const SERVER_PATH = "http://localhost:5000";
export const API_PATH = `${window.location.protocol}//${window.location.host}/api`;
export const SERVER_PATH = `${window.location.protocol}//${window.location.host}`;

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
}

export const PostType = {
    FREE: 1,
    FAN: 2,
    SUBSCRIBER: 3,
    PAID: 4,
}

export const StoryType = {
    NONE: 0,
    PUBLIC: 1,
    FOLLOWER: 2,
    SUBSCRIBER: 4,
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