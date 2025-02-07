import { IInputs } from "../generated/ManifestTypes";
import { XrmRequest, XrmResponse } from "../interfaces/xrm";

export class XrmService {
    private static instance: XrmService | null = null;
    private context: ComponentFramework.Context<IInputs> | null = null;

    private constructor() {
    }

    static getInstance(): XrmService {
        if (!XrmService.instance) {
            XrmService.instance = new XrmService();
        }
        return XrmService.instance;
    }

    setContext(context: ComponentFramework.Context<IInputs>): void {
        this.context = context;
    }

    async fetch(endpoint: string): Promise<object[]> {
        return new Promise((resolve, reject) => {
            fetch(endpoint)
                .then((response) => {
                    return response?.ok ? response.json(): reject(response.statusText);
                })
                .then((data) => {
                    return resolve(data.value);
                })
                .catch((e) => reject(e));
        });
    }

    async execute(request: XrmRequest): Promise<object> {
        return new Promise((resolve, reject) => {
            //@ts-expect-error - Currently is the only way to execute an action
            Xrm.WebApi.online.execute(request).then(
                (result: XrmResponse) => {
                    return result?.ok ? resolve(result?.json()) : reject(result?.ok);
                },
                (error: object) => { return reject(error); }
            ).catch((e: object) => reject(e));
        });
    }
}