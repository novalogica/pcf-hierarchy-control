import { XrmProperty, XrmRequestMetadata } from ".";

export default interface XrmRequest extends XrmProperty {
    getMetadata: () => XrmRequestMetadata;
}