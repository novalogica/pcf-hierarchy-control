import * as React from "react";
import { memo, useCallback, useContext, useMemo } from "react";
import { ActionButton } from "@fluentui/react/lib/Button";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";

import NodeTree from "./tree";
import { colors } from "../../utils/constants";
import { ControlContext } from "../../context/control-context";
import { FlowDataContext, FlowSelectionContext } from "../../context/flow-context";
import { useStorage } from "../../hooks/useStorage";
import useWindowDimensions from "../../hooks/useDimensions";

const SidePanel = memo(({ isCollapsed, setIsCollapsed, panelWidth }: { isCollapsed: boolean, setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>, panelWidth: number }) => {
  const { context, forms, activeForm, setActiveForm, entityName } = useContext(ControlContext);
  const { direction, setDirection, selectedNode } = useContext(FlowSelectionContext);
  const { moveToNode } = useContext(FlowDataContext);
  const menuIcon = useMemo(() => isCollapsed ? "OpenPaneMirrored": "OpenPane", [isCollapsed])
  const { setLastUsedView } = useStorage();
  const { height } = useWindowDimensions();
  
  const onFormChanged = useCallback((_: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
    if(!item)
        return;

    const form = forms.find((f) => f.formId == item.key);
    form && setActiveForm(form);

    if(form && form.formId) {
      setLastUsedView(entityName!, form.formId);
    }
  }, [forms, activeForm]);

  const formOptions = useMemo(() => forms.map((f) => ({ key: f.formId, text: f.label } as IDropdownOption)), [forms])

  return (
    <div style={{...styles.toolbar, width: panelWidth, height: `calc(${height} - 32px)`, alignItems: isCollapsed ? 'center': 'start'}}>
      <ActionButton 
        style={{...styles.toolbarItem, width: 'auto'}} 
        onClick={() => window.history.back()}
        iconProps={{ iconName: "Back" }}
      />
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
      <div style={styles.toolbarFooter}>
        <ActionButton 
          style={{...styles.toolbarItem, width: 'auto'}} 
          onClick={() => {
            setDirection((prev: string) => prev == "TB" ? "LR" : "TB")
            setTimeout(() => moveToNode(selectedNode.id, 0.5), 500);
          }}
          iconProps={{ iconName: direction == "TB" ? "HorizontalTabKey": "DistributeDown" }}
          >
          {isCollapsed ? "" : context.resources.getString(direction == "TB" ? "Horizontal" : "Vertical")}
        </ActionButton>
        <ActionButton 
          style={{...styles.toolbarItem, width: 'auto'}} 
          onClick={() => setIsCollapsed((prev: boolean) => !prev)}
          iconProps={{ iconName: menuIcon }}
          >
          {!isCollapsed && context.resources.getString("collapse")}
        </ActionButton>
      </div>
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
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.15)'
  },
  toolbarFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
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