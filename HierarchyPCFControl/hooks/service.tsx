import { XrmRequest, XrmResponse } from "../interfaces/xrm";

export class XrmService {
    private static instance: XrmService | null = null;

    private constructor() {
    }

    static getInstance(): XrmService {
        if (!XrmService.instance) {
            XrmService.instance = new XrmService();
        }
        return XrmService.instance;
    }

    async fetch(endpoint: string, headers?: any): Promise<object[]> {
        const response = await fetch(endpoint, headers);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        return data.value;
    }

    async execute(request: XrmRequest): Promise<object> {
        //@ts-expect-error - Currently is the only way to execute an action
        const result: XrmResponse = await Xrm.WebApi.online.execute(request);
        if (result?.ok) {
            return result.json();
        } else {
            throw new Error(result?.statusText || 'XrmService execute failed');
        }
    }
}