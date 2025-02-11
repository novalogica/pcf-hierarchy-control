import * as React from "react";
import { useMemo, useState } from "react";
import { IconButton } from "@fluentui/react/lib/Button";
import NodeTree from "./tree";

const SidePanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const panelWidth = useMemo(() => isCollapsed ? 50 : '275px', [isCollapsed])
  const menuIcon = useMemo(() => isCollapsed ? "OpenPaneMirrored": "OpenPane", [isCollapsed])
  
  return (
    <div style={{...styles.toolbar, width: panelWidth, alignItems: isCollapsed ? 'center': 'start'}}>
      <IconButton
        style={{...styles.toolbarItem, width: 'auto'}}
        aria-label={"Collapse"}
        onClick={() => setIsCollapsed(prev => !prev)}
        iconProps={{ iconName: menuIcon }}
      />
      <div style={{...styles.toolbarItem, justifyContent: 'center', alignItems: 'end'}}>
        { 
        /*
          !isCollapsed && <div style={styles.formDropdownContainer}>
            <label style={styles.dropdownLabel}>Forms</label>
            <Dropdown 
              appearance="outline" 
              onOptionSelect={onFormSelected} 
              selectedOptions={[currentForm.id]}
              value={currentForm.name}
            >
              { formOptions }
            </Dropdown>
          </div>
          <ToolbarButton
          aria-label={"Refresh"}
          appearance="primary"
          onClick={onRefreshClick}
          icon={<div style={isRefreshing ? styles.rotate : undefined}><ArrowClockwiseRegular /></div>}
          />
          */
        }
      </div>
      <div style={styles.sidePanel}>
        { 
          !isCollapsed && <div style={styles.formDropdownContainer}>
            <label style={styles.dropdownLabel}>Hierarchy</label>
            <NodeTree />
          </div>
        }
      </div>
    </div>
  );
}

export default SidePanel;

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
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
  sidePanel: {
    width: '100%', 
    height: '100%',
    display: 'flex', 
    overflow: 'scroll',
    flexDirection: 'row',
    justifyContent: 'start',
    gap: 8
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
    gap: 4
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgb(163 155 155)'
  }
}