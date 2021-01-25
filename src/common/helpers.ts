import { DOMAIN_NAME } from "./consts";

export const fetcher = <T>(url: string) => fetch(url).then<T>(r => r.json());

type SuspensifyStatus = "pending" | "error" | "success";

export const suspensify = <T>(promise: Promise<T>) => {
    let status: SuspensifyStatus = "pending";
    let result: T;

    let suspender = promise.then(
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

export const sanitizeStr = (str?: string | null, maxLength: number = 1024) =>
    str ? stripSpecialChars(str).slice(0, maxLength) : undefined;

/** Clientside only isProd check */
const isProd = () =>
    typeof window !== "undefined"
        ? window.location.hostname === DOMAIN_NAME
        : undefined;

export const isDoNotTrackEnabledClientside = () =>
    Boolean(
        isProd() && typeof window !== "undefined"
            ? window.navigator.doNotTrack || window.doNotTrack
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
        var rejectCount = 0;
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

export const playNext = () => {
    const nextThumbnailEl =
        (document.querySelector<HTMLAnchorElement>(".thumbnail.active")
            ?.nextElementSibling as HTMLAnchorElement | null) || null;
    if (!nextThumbnailEl) return;
    try {
        nextThumbnailEl.click();
        nextThumbnailEl.scrollIntoView();
    } catch {
        console.warn("Autoplay next unsupported");
    }
};
