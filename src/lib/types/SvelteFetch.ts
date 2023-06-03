type SvelteFetch = (
    input: URL | RequestInfo,
    init?: RequestInit | undefined
) => Promise<Response>;

export default SvelteFetch;
