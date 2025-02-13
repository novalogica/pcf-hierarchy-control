import * as React from "react";
import { useContext } from "react";
import { NodeProps } from "@xyflow/react/dist/esm/types";
import { NodeRecord } from "../../../types/node";
import { FlowContext } from "../../../context/flow-context";
import { IconButton } from "@fluentui/react/lib/Button";
import { ControlContext } from "../../../context/control-context";

const NodeExpandButton = ({ id, data }: NodeProps<NodeRecord>) => {
  const { context } = useContext(ControlContext);
  const { onExpandNode } = useContext(FlowContext);
  
  const handleExpandNode = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation(); 
    onExpandNode(id);
  };

  const label = React.useMemo(() => {
    return context.resources.getString(data.expanded ? "collapse" : "expand")
  }, [data.expanded])

  return (
    <IconButton 
      iconProps={{ iconName: data.expanded == true ? "ChevronDown" : "ChevronUp"}} 
      title={label}
      aria-label={label}
      onClick={handleExpandNode}
      style={styles.container}
    />
  );
};

export default NodeExpandButton;

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: 30,
    width: 30,
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    background: "white",
    borderRadius: 100,
    padding: 2,
    bottom: -16
  }
}