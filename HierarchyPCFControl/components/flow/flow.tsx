import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ReactFlow, Background, NodeMouseHandler, ReactFlowInstance, MiniMap, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowContext } from '../../context/flow-context';
import { findPath, getLayoutedElements, nodeHeight, nodeWidth } from '../../utils/utils';
import NodeCard from './node/node';
import { graph } from '../../app';

const nodeTypes = {
    card: NodeCard,
};

const HierarchyFlow = () => {
    const { nodes, edges, onNodesChange, setFlow, onNodeClick } = useContext(FlowContext);

    return (
        <div style={{ height: 'calc(100vh - 48px)', width: '100%' }}>
            <ReactFlow
                onInit={setFlow}
                nodes={nodes}
                edges={edges}
                nodesDraggable={false}
                edgesFocusable={false}
                onNodesChange={onNodesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background gap={24} />
                <Controls position='bottom-right' />
                <MiniMap position='top-right' />
            </ReactFlow>
        </div>
    );
};

export default HierarchyFlow;
