import * as React from "react";
import * as ReactDOM from "react-dom";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import App from "./app";

export class HierarchyPCFControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, _: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this.container = container;
        context.mode.trackContainerResize(true);
        this.renderControl(context);
    }

    private renderControl(context: ComponentFramework.Context<IInputs>) {
        ReactDOM.render(React.createElement(App, { context }), this.container );
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.renderControl(context);
    }

    public getOutputs(): IOutputs {
        return { };
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this.container);
    }
}
