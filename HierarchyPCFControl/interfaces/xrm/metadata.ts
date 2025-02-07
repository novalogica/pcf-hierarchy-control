import { XrmParameterTypeCollection } from ".";

export default interface XrmRequestMetadata {
    boundParameter?: object | null,
    parameterTypes: XrmParameterTypeCollection,
    operationType: number,
    operationName: string,
}