import { DOMAIN_NAME } from "./consts";
import {
    compressToEncodedURIComponent as compress,
    decompressFromEncodedURIComponent as decompress
} from "lz-string";
import { isString, isArray, uniq } from "lodash";

const WATCHED_LOCAL_STORAGE_KEY = "w";

export const fetcher = <T>(url: string) => fetch(url).then<T>(r => r.json());

type SuspensifyStatus = "pending" | "error" | "success";

export const suspensify = <T>(promise: Promise<T>) => {
    let status: SuspensifyStatus = "pending";
    let result: T;

    const suspender = promise.then(
        response => {
            status = "success";
            result = response;
        },
        error => {
            status = "error";
            result = error;
        }
    );

    return {
        read() {
            console.log(status);
            if (status === "pending") throw suspender;
            if (status === "error") throw result;
            return result; // success
        }
    };
};

export const stripSpecialChars = (str?: string | null) =>
    str ? str.replace(/[^a-z0-9]/gi, "") : "";

export const sanitizeStr = (str?: string | null, maxLength = 1024) =>
    str ? stripSpecialChars(str).slice(0, maxLength) : undefined;

/** Clientside only isProd check */
const isProd = () =>
    typeof window !== "undefined"
        ? window.location.hostname === DOMAIN_NAME
        : undefined;

export const isDoNotTrackEnabledClientside = () =>
    Boolean(
        isProd() && typeof window !== "undefined"
            ? window.navigator.doNotTrack || (window as any).doNotTrack
            : false
    );

export const logServer = (str: string, ...args: (string | undefined)[]) => {
    if (typeof window !== "undefined") return;
    console.log(str, ...args);
};

let gotInitialReferrer = false;

export const getInitialReferrer = () => {
    if (gotInitialReferrer || typeof window === "undefined") return;

    gotInitialReferrer = true;
    return window.document.referrer;
};

export const firstResolve = (promises: Promise<any>[]) => {
    return new Promise(function(fulfil, reject) {
        let rejectCount = 0;
        promises.forEach(function(promise) {
            promise.then(fulfil, () => {
                rejectCount++;
                if (rejectCount == promises.length) {
                    reject("All promises were rejected");
                }
            });
        });
    });
};

export const scoreToShortScore = (score: number) => {
    if (score < 1000) return score.toString();

    return (score / 1000).toFixed(1) + "k";
};

export const compressArray = (strings: string[]) => {
    return compress(JSON.stringify(strings));
};

export const decompressArray = (s: string) => {
    if (typeof s === "undefined" || !s) return [];
    const decompressed = decompress(s);
    if (!decompressed) return [];
    try {
        const watched = JSON.parse(decompressed);
        if (isArray(watched)) {
            return watched.filter(isString);
        }
    } catch (error) {
        console.warn("Invalid watched string", error);
    }
    return [];
};

export const getWatched = () => {
    const watchedCompressed = localStorage.getItem(WATCHED_LOCAL_STORAGE_KEY);
    if (!watchedCompressed) return [];
    return decompressArray(watchedCompressed);
};

export const addWatched = (id: string) => {
    let watched = getWatched();
    watched.unshift(id);
    watched = uniq(watched).slice(0, 1024);
    const compressed = compressArray(watched);
    localStorage.setItem(WATCHED_LOCAL_STORAGE_KEY, compressed);
    return watched;
};

export const isWatched = (id: string) => getWatched().includes(id);

export const getUserAgent = () => {
    return window?.navigator.userAgent || "";
};

export const isiPhone = () => {
    return !!getUserAgent().match(/iPhone/gi);
};
