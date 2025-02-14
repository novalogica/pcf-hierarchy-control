import * as React from "react";
import { Handle, type NodeProps } from '@xyflow/react';
import { Attribute, NodeRecord } from "../../../types/node";
import { useContext, useMemo, useCallback, useRef } from "react";
import { FlowContext } from "../../../context/flow-context";
import NodeExpandButton from "./expand-node";
import { colors, handles, nodeHeight, nodeWidth } from "../../../utils/constants";
import { PersonaSize } from "@fluentui/react/lib/Persona";
import { Text } from "@fluentui/react/lib/Text";
import { Badge } from "../../badge/badge";
import { IconButton } from "@fluentui/react";
import LookupField from "../../lookup/lookup";
import { useNavigation } from "../../../hooks/useNavigation";
import { ControlContext } from "../../../context/control-context";

const NodeCard = React.memo((props: NodeProps<NodeRecord>) => {
  const { id, data } = props;
  const { context, entityName, entityId } = useContext(ControlContext);
  const { selectedNode, selectedPath, moveToNode, getChildrenIds } = useContext(FlowContext);
  const { openForm } = useNavigation(context)
  const detailRef = useRef<HTMLDivElement>(null);

  const cardStyle = useMemo(() => {
    return selectedNode?.id === id ? { ...styles.card, ...styles.activeCard } : styles.card;
  }, [selectedNode, id]);

  const hasChildrens = useMemo(() => {
    const childrens = getChildrenIds(id);
    return childrens && childrens.length > 0;
  }, [id, getChildrenIds]);

  const handleCardClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation(); 
    moveToNode(id);
  }, [id, moveToNode]);

  const handleOpenRecord = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation(); 
    openForm(entityName, id);
  }, [id]);

  const attributes = useMemo(() => {
    return data.attributes ? Object.keys(data.attributes).filter(key => key != "_ownerid_value" && key != "statecode").map((key) => (
        <div key={key} style={styles.info}>
          <Text style={styles.infoLabel} nowrap block>
            {data.attributes![key].displayName}
          </Text>
          <Text style={styles.infoValue} nowrap block>
            {
              typeof data.attributes![key].value === "object" 
                ? <LookupField item={data.attributes![key].value} /> 
                : data.attributes![key].value
            }
          </Text>
        </div>
    )) : []
  }, [data.attributes])  

  const owner = useMemo(() => data.attributes!["_ownerid_value"].value as ComponentFramework.LookupValue, [data.attributes])

  const state = useMemo(() => data.attributes!["statecode"] as Attribute, [data.attributes])

  return (
    <div style={cardStyle} onClick={handleCardClick}>
      <div style={styles.header}>
        <Badge name={data.label} etn={entityName} id={entityId} size={PersonaSize.size48} nameStyle={styles.cardBadgeName} />
        <span style={styles.statusBadge}>{state.value}</span>
      </div>
      <div ref={detailRef} style={styles.detailsContainer}>
        {attributes}
      </div>
      <div style={styles.footerContainer}>
        <Badge name={owner.name} etn={owner.entityType} id={owner.id} size={PersonaSize.size32} nameStyle={styles.ownerText}/>
        <IconButton text="Open" iconProps={{ iconName: 'ChevronRight' }} onClick={handleOpenRecord}/>
      </div>
      {hasChildrens && <NodeExpandButton {...props} />}      
      {handles.map((handle) => (
        <Handle key={handle.type} type={handle.type} position={handle.position} isConnectable={false} style={styles.handle} id={handle.position}/>
      ))}
    </div>
  );
});

NodeCard.displayName = "NodeCard"
export default NodeCard;

const styles: { [key: string]: React.CSSProperties } = {
    card: {
      width: nodeWidth - 100, 
      height: nodeHeight - 100, 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
      alignItems: 'center',
      padding: "1.5rem",
      backgroundColor: "white",
      borderRadius: "0.75rem",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
    cardBadgeName: {
      fontSize: 22, 
      fontWeight: 600, 
      maxWidth: 300
    },
    activeCard: {
      border: `2px solid ${colors.active75}`,
      boxShadow: `0px 10px 15px -3px ${colors.active75}`
    },
    header: {
      display: "flex",
      width: '100%',
      flexDirection: 'row',
      alignItems: "center",
      justifyContent: 'space-between',
      gap: "1rem",
    },
    icon: {
      width: "3rem",
      height: "3rem",
      borderRadius: "50%",
      border: "2px solid #dcfce7",
      backgroundColor: "#f0fdf4",
    },
    detailsContainer: {
      width: '100%',
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginTop: "1.5rem",
      overflowY: 'auto',
    },
    info: {
      display: "flex",
      flexDirection: "row",
      flex: 1,
      flexWrap: 'nowrap',
      alignItems: 'center',
      textAlign: "center",
      gap: 16,
    },
    infoLabel: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#6b7280",
      width: 150,
      textAlign: 'end'
    },
    infoValue: {
      width: '100%',
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#111827",
      backgroundColor: colors.secondaryBackground,
      padding: 8,
      borderRadius: 8,
      textAlign: 'start'
    },
    footerContainer: {
      width: '100%',
      display: "flex",
      flexDirection: 'row',
      alignItems: "center",
      justifyContent: 'space-between',
      gap: "0.5rem",
      marginTop: "1.5rem"
    },
    statusBadge: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      fontWeight: 500,
      backgroundColor: colors.badgeColor,
      color: "white",
    },
    handle: {
      border: 0,
      backgroundColor: 'transparent'
    },
    ownerText: {
      textDecoration: 'underline',
      color: colors.active75
    }
}
