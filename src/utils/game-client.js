const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]", "::1"];
export function resolveGameClient(runtime = window) {
    if (runtime.location.hostname === "origin.jx3box.com") return "origin";
    if (
        LOCAL_HOSTS.includes(runtime.location.hostname) &&
        new URLSearchParams(runtime.location.search).get("client") === "origin"
    )
        return "origin";
    return "std";
}
