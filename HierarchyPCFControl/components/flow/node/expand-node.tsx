import * as React from "react";
import { NodeProps } from "@xyflow/react";
import { NodeRecord } from "../../../types/node";
import { FlowContext } from "../../../context/flow-context";
import { useContext } from "react";
import { IconButton } from "@fluentui/react/lib/Button";

const NodeExpandButton = ({ id, data }: NodeProps<NodeRecord>) => {
  const { onExpandNode } = useContext(FlowContext);
  
  const handleExpandNode = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation(); 
    onExpandNode(id);
  };

  return (
    <div style={styles.container}> 
      <IconButton 
        iconProps={{ iconName: data.expanded == true ? "ChevronDown" : "ChevronUp"}} 
        aria-label={data.expanded ? "Collapse" : "Expand"}
        onClick={handleExpandNode}
      />
    </div>
  );
};

export default NodeExpandButton;

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: 25,
    width: 25,
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    background: "white",
    borderRadius: 100,
    padding: 2,
    bottom: -12
  }
}