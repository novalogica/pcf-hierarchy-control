import * as React from "react";
import { memo, useCallback, useContext, useMemo, useState } from "react";
import { ActionButton } from "@fluentui/react/lib/Button";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";

import NodeTree from "./tree";
import { colors } from "../../utils/constants";
import { ControlContext } from "../../context/control-context";
import { FlowContext } from "../../context/flow-context";

const SidePanel = memo(() => {
  const { context, forms, activeForm, setActiveForm } = useContext(ControlContext);
  const { direction, setDirection } = useContext(FlowContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const panelWidth = useMemo(() => isCollapsed ? 90 : 275, [isCollapsed])
  const menuIcon = useMemo(() => isCollapsed ? "OpenPaneMirrored": "OpenPane", [isCollapsed])
  
  const onFormChanged = useCallback((_: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
    if(!item)
        return;

    const form = forms.find((f) => f.formId == item.key);
    form && setActiveForm(form);
  }, [forms, activeForm]);

  const formOptions = useMemo(() => forms.map((f) => ({ key: f.formId, text: f.label } as IDropdownOption)), [forms])

  return (
    <div style={{...styles.toolbar, width: panelWidth, alignItems: isCollapsed ? 'center': 'start'}}>
      <ActionButton 
        style={{...styles.toolbarItem, width: 'auto'}} 
        onClick={() => setIsCollapsed(prev => !prev)}
        iconProps={{ iconName: menuIcon }}
      >
        {!isCollapsed && context.resources.getString("collapse")}
      </ActionButton>
      <Dropdown
        label={isCollapsed ? "" : context.resources.getString("form")}
        selectedKey={activeForm ? activeForm.formId : undefined}
        onChange={onFormChanged}
        options={formOptions}
        styles={{
          root: { width: '100%' }, 
          title: { border: "none" },
          callout: { borderRadius: "0px 0px 16px 16px", minWidth: 'fit-content' }, 
          label: { textTransform: 'capitalize', fontSize: 12, marginLeft: 8, color: colors.label}
        }}
      />
      <div style={{...styles.treeContainer, overflowY: 'auto', overflowX: isCollapsed ? 'hidden': 'auto'}}>
        <NodeTree isCollapsed={isCollapsed}/>
      </div>
      <ActionButton 
        style={{...styles.toolbarItem, width: 'auto'}} 
        onClick={() => setDirection(prev => prev == "TB" ? "LR" : "TB")}
        iconProps={{ iconName: direction == "TB" ? "HorizontalTabKey": "DistributeDown" }}
      >
        {isCollapsed ? "" : context.resources.getString(direction == "TB" ? "Horizontal" : "Vertical")}
      </ActionButton>
    </div>
  );
})

SidePanel.displayName = "SidePanel";
export default SidePanel;

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
    alignItems: 'center',
    height: '100%'
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