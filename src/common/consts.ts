import { Config as ReactPlayerConfig } from "react-player";

export const DEFAULT_TITLE = "dailyblocks video player for reddit";

export const BLACKLIST = [
    "avbxpm",
    "dim0mi",
    "dfv9qt",
    "g5kq9l",
    "gfx1sf",
    "fxqx08",
    "fmi5y6",
    "grig6k",
    "g3p34u",
];

export const PLAYER_CONFIG: ReactPlayerConfig = {
    youtube: {
        playerVars: {
            showinfo: 0,
            playsinline: 1,
            rel: 0,
            widget_referrer:
                typeof window !== "undefined"
                    ? window.location.href
                    : undefined,
            color: "white",
        },
    },
};

const date = new Date();

date.setDate(1);
date.setMonth(0);
date.setHours(0);
date.setMinutes(0);
date.setSeconds(0);
date.setMilliseconds(0);
date.setFullYear(2100);

export const DEFAULT_COOKIE_EXPIRATION_DATE = date;

export const DOMAIN_NAME = "dailyblocks.tv";

export const BOT_USER_AGENTS = [
    "GoogleBot",
    "bingbot",
    "YandexBot",
    "Slurp",
    "DuckDuckBot",
    "Baiduspider",
    "Sogou",
    "Exalead",
    "ia_archiver",
];

export const URLS = {
    REDDIT: "https://www.reddit.com",
    DAILYBLOCKS: "https://" + DOMAIN_NAME,
};

export const SUBREDDITS = [
    "videos",
    "documentaries",
    "mealtimevideos",
    "cringe",
    "publicfreakout",
    "youseeingthisshit",
    "blackmagicfuckery",
    "idiotsincars",
    "roadcam",
    "whatcouldgowrong",
    "nononono",
    "youtubehaiku",
    "rage",
    "aww",
    "animalsbeingderps",
    "unexpected",
    "nottimanderic",
    "interdimensionalcable",
    "badvibes",
    "unknownvideos",
    "nintendoswitch",
    "ps4",
    "games",
    "eve",
    "dayz",
    "retrotube",
    "gamegrumps",
    "instantregret",
    "alanwatts",
    "musicvideos",
    "listentothis",
    "hiphopheads",
    "kpop",
    "afrobashment",
    "simpsonswave",
    "popheads",
    "worldmusic",
    "drums",
    "movies",
    "commercialcuts",
];

export const MINUTE_MS = 60000;

export const HOUR_MS = MINUTE_MS * 60;

export const DAY_MS = HOUR_MS * 24;
