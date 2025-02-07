import * as React from "react";
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { NodeRecord } from "../../../types/node";
import { useContext, useMemo } from "react";
import { FlowContext } from "../../../context/flow-context";

export const NodeCard = ({ id, data }: NodeProps<NodeRecord>) => {
  const { selectedPath } = useContext(FlowContext);

  const activeCardStyles =  useMemo(() => {
    if(selectedPath.includes(id)) {
      return {
        border: '1.5px solid #0f6cbd7c',
        boxShadow: 'rgb(15 108 189 / 15%) 0px 10px 19px -7px'
      }
    }
    return { border: 'none', boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)' }
  }, [id, selectedPath])

  return <div style={{...styles.card, ...activeCardStyles}}>
    <Handle type="target" position={Position.Top} isConnectable={false} style={{backgroundColor: 'transparent'}}/>
    {data.label}
    <Handle type="source" position={Position.Bottom} isConnectable={false} style={{backgroundColor: 'transparent'}}/>
  </div>;
}

export default NodeCard;


const styles: Record<string, React.CSSProperties> = {
  card: {
    width: 350, 
      height: 275, 
      backgroundColor: 'white', 
      padding: 8, 
      borderRadius: 16, 
      boxShadow: '0px 5px 14px 8px rgba(0,0,0,0.1)'
  }
}