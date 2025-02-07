import * as React from "react";
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { NodeRecord } from "../../../types/node";

export default function NodeCard({ data }: NodeProps<NodeRecord>) {
      return <div style={{ width: 300, height: 175, backgroundColor: 'white', padding: 8, borderRadius: 8, boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)'}}>
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={false}
          style={{ backgroundColor: 'transparent'  }}
        />
        {data.label}
        {
          <Handle type="source" position={Position.Bottom} isConnectable={false} style={{ backgroundColor: 'transparent'}}/>
        }
      </div>;
}