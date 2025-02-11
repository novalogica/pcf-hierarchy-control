import * as React from "react";
import { useMemo, useState } from "react";
import { IconButton } from "@fluentui/react/lib/Button";
import NodeTree from "./tree";
import { colors } from "../../utils/constants";

const SidePanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const panelWidth = useMemo(() => isCollapsed ? 90 : 275, [isCollapsed])
  const menuIcon = useMemo(() => isCollapsed ? "OpenPaneMirrored": "OpenPane", [isCollapsed])
  
  return (
    <div style={{...styles.toolbar, width: panelWidth, alignItems: isCollapsed ? 'center': 'start'}}>
      <IconButton
        style={{...styles.toolbarItem, width: 'auto'}}
        aria-label={"Collapse"}
        onClick={() => setIsCollapsed(prev => !prev)}
        iconProps={{ iconName: menuIcon }}
      />
      <div style={{...styles.treeContainer, overflow: 'auto'}}>
        <NodeTree isCollapsed={isCollapsed}/>
      </div>
    </div>
  );
}

export default SidePanel;

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    position: 'absolute',
    top: 16,
    left: 16,
    bottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  toolbarItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    gap: 8
  },
  treeContainer: {
    width: '100%', 
    height: '100%',
    display: 'flex', 
    overflow: 'auto',
    flexDirection: 'row',
    justifyContent: 'start',
    backgroundColor: colors.secondaryBackground,
    gap: 8,
    borderRadius: 8
  },
  search: {
    width: '100%'
  },
  rotate: {
    animation: 'spin 1s linear infinite',
  },
  formDropdownContainer : {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: 4,
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.label,
    textAlign: 'left'
  }
}