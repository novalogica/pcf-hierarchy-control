export default interface XrmResponse {
    ok: boolean,
    status: number,
    statusText?: string,
    json: () => object
}