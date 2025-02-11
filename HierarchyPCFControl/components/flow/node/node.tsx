import * as React from "react";
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { NodeRecord } from "../../../types/node";
import { useContext, useMemo } from "react";
import { FlowContext } from "../../../context/flow-context";
import NodeExpandButton from "./expand-node";

const NodeCard = (props: NodeProps<NodeRecord>) => {
  const { id, data } = props;
  const { selectedPath, moveToNode, getChildrenIds } = useContext(FlowContext);

  const cardStyle = useMemo(() => {
    return selectedPath.includes(id) ? { ...styles.card, ...styles.activeCard } : { ...styles.card };
  }, [selectedPath, id]);

  const hasChildrens = useMemo(() => {
    const childrens = getChildrenIds(id);
    return childrens && childrens.length > 0;
  }, [id]);

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation(); 
    moveToNode(id);
  };

  return (
    <div style={cardStyle} onClick={handleCardClick}>
      <Handle type="target" position={Position.Top} isConnectable={false} style={{ backgroundColor: 'transparent', border: 0 }}
      />
      {data.label}
      {
        hasChildrens && <NodeExpandButton {...props} />
      }
      {
        <Handle type="source" position={Position.Bottom} isConnectable={false} style={{ backgroundColor: 'transparent', border: 0}}/>
      }
    </div>
  );
}

export default NodeCard;

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 300, 
    height: 175, 
    backgroundColor: 'white', 
    padding: 8, 
    borderRadius: 8, 
    boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)'
  },
  activeCard: {
    padding: 8, 
    borderRadius: 8,
    border: '1.5px solid rgba(65, 104, 189, 0.25)',
    boxShadow: '0px 10px 15px -3px rgba(65, 104, 189, 0.25)'
  },
};