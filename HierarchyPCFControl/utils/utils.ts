import { Edge, Node } from "@xyflow/react/dist/esm/types";
import { PersonaInitialsColor } from '@fluentui/react/lib/Persona';

import { colors } from './constants';

export const findPath = (nodeId: string, edges: Edge[]): string[] => {
    return edges.reduce((path, _) => {
        const edge = edges.find((e) => e.target === (path[0] || nodeId));
        return edge ? [edge.source, ...path] : path;
    }, [nodeId]);
};

export const getNodeColor = (node: Node, selectedPath: string[]): string => {
    if (selectedPath?.includes(node.id) && selectedPath?.[selectedPath.length - 1] != node.id) 
        return colors.active25;
    if (selectedPath?.[selectedPath.length - 1] == node.id) 
        return colors.active85;
    return colors.inactive;
}

export const getColorFromInitials = (initials: string, colorPalette: PersonaInitialsColor[]) => {
    const charSum = initials
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return colorPalette[charSum % colorPalette.length];
}

export const getWindowDimensions = () => {
    const { innerHeight: height } = window;

    return {
        width: '100%',
        height: height && height > 0 ? height - 48 : '95vh'
    };
}