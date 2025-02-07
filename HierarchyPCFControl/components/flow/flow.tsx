import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ReactFlow, Background, NodeMouseHandler, ReactFlowInstance, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowContext } from '../../context/flow-context';
import { findPath, getLayoutedElements, nodeHeight, nodeWidth } from '../../utils/utils';
import NodeCard from './node/node';
import { graph } from '../../app';

const nodeTypes = {
    card: NodeCard,
};

const HierarchyFlow = () => {
    const { nodes, edges, selectedPath, onNodesChange, setSelectedPath } = useContext(FlowContext);
    const [flow, setFlow] = useState<ReactFlowInstance | null>(null);

    const onNodeClick: NodeMouseHandler = (event, node) => {
        if (!flow) return;

        const path = findPath(node.id, edges);
        setSelectedPath(path);

        const currentZoom = flow.getZoom();
        const nodeCenterX = node.position.x + nodeWidth / 2;
        const nodeCenterY = node.position.y + nodeHeight / 2;

        flow.setCenter(nodeCenterX, nodeCenterY, {
            zoom: currentZoom,
            duration: 500,
        });
    };

    const visibleNodes = useMemo(() => {
        return nodes.map((node) => {
            const isVisible = selectedPath.length === 0 || selectedPath.includes(node.id);
            return {
                ...node,
                //hidden: !isVisible,
            };
        });
    }, [nodes, selectedPath]);

    const visibleEdges = useMemo(() => {
        return edges.map((edge) => {
            const isInPath = selectedPath.length === 0 || (selectedPath.includes(edge.source) && selectedPath.includes(edge.target));
            return {
                ...edge,
                //hidden: !isInPath,
                style: {
                    stroke: isInPath && selectedPath.length > 0 ? 'red' : '#ccc',
                    strokeWidth: isInPath ? 3 : 1,
                },
            };
        });
    }, [edges, selectedPath]);
    
    useEffect(() => {
        getLayoutedElements(graph, visibleNodes, visibleEdges)
    }, [setSelectedPath, visibleEdges, visibleNodes])
    
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <ReactFlow
                onInit={setFlow}
                nodes={visibleNodes}
                edges={visibleEdges}
                nodesDraggable={false}
                edgesFocusable={false}
                onNodesChange={onNodesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background gap={16} />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};

export default HierarchyFlow;
