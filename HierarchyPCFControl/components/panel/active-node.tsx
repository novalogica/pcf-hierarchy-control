import * as React from "react";
import { useContext } from "react";
import { FlowContext } from "../../context/flow-context";
import { Badge } from "../badge/badge";
import { IconButton } from "@fluentui/react/lib/Button";
import { ControlContext } from "../../context/control-context";

const ActiveNode = ({ isCollapsed } : { isCollapsed: boolean}) => {
  const { context } = useContext(ControlContext);
  const { selectedNode } = useContext(FlowContext);
  
  if(!selectedNode)
    return <></>

  const onOpenRecord = () => {

  }

  return ( 
    <div style={styles.card}>
      <Badge name={selectedNode.data.label as string} isCollapsed={isCollapsed} />
      {
        !isCollapsed && (
          <IconButton 
            style={styles.iconBtn}
            iconProps={{ iconName: "ChevronRight"}} 
            title={context.resources.getString("open-record")}
            aria-label={context.resources.getString("open-record")}
            onClick={onOpenRecord}
          />
        )
      }
    </div>
  );
}

export default ActiveNode;

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white', 
  },
  iconBtn: {
    height: 30,
    width: 30,
    background: "white",
    borderRadius: 100,
    padding: 2,
  }
}