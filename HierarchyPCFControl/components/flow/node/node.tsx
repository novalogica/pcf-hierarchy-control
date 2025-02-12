import * as React from "react";
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { NodeRecord } from "../../../types/node";
import { useContext, useMemo } from "react";
import { FlowContext } from "../../../context/flow-context";
import NodeExpandButton from "./expand-node";
import { colors, handles, nodeHeight, nodeWidth } from "../../../utils/constants";

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
      {data.label}
      { hasChildrens && <NodeExpandButton {...props} />}
      {
        handles.map((handle) => (
          <Handle key={handle.type} type={handle.type} position={handle.position} isConnectable={false} style={styles.handle} id={handle.position}/>
        ))
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
    width: nodeWidth, 
    height: nodeHeight, 
    backgroundColor: 'white', 
    padding: 8, 
    borderRadius: 8, 
    boxShadow: `0px 10px 15px -3px ${colors.black10}`
  },
  activeCard: {
    padding: 8, 
    borderRadius: 8,
    border: `1.5px solid ${colors.active25}`,
    boxShadow: `0px 10px 15px -3px ${colors.active25}`
  },
  handle : {
    backgroundColor: colors.transparent, 
    border: 0
  }
};
