import * as React from "react";
import { useContext, useMemo } from "react";
import { NodeProps } from "@xyflow/react/dist/esm/types";
import { NodeRecord } from "../../../types/node";
import { FlowContext } from "../../../context/flow-context";
import { IconButton } from "@fluentui/react/lib/Button";
import { ControlContext } from "../../../context/control-context";

const NodeExpandButton = React.memo(({ id, data }: NodeProps<NodeRecord>) => {
  const { context } = useContext(ControlContext);
  const { onExpandNode, direction } = useContext(FlowContext);
  
  const handleExpandNode = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation(); 
    onExpandNode(id);
  };

  const btnStyle = useMemo(() => direction == 'TB' ? styles.horizontalContainer: styles.verticalContainer, [direction])

  const label = useMemo(() => {
    return context.resources.getString(data.expanded ? "collapse" : "expand")
  }, [data.expanded])

  return (
    <IconButton 
      iconProps={{ iconName: data.expanded == true ? "ChevronDown" : "ChevronUp"}} 
      title={label}
      aria-label={label}
      onClick={handleExpandNode}
      style={btnStyle}
    />
  );
});

NodeExpandButton.displayName = "NodeExpandButton";
export default NodeExpandButton;

const styles: Record<string, React.CSSProperties> = {
  horizontalContainer: {
    height: 30,
    width: 30,
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    background: "white",
    borderRadius: 100,
    padding: 2,
    bottom: -12
  },
  verticalContainer: {
    height: 30,
    width: 30,
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    background: "white",
    borderRadius: 100,
    padding: 2,
    right: -16,
    top: 183,
    transform: "rotate(-90deg)"
  }
}