import * as React from 'react';
import { Nav, INavLinkGroup, INavLink, INavStyles } from '@fluentui/react/lib/Nav';
import { PersonaSize } from "@fluentui/react/lib/Persona";
import { useCallback, useContext, useMemo } from 'react';
import { FlowContext } from '../../context/flow-context';
import { Badge } from '../badge/badge';

interface IProps {
  isCollapsed: boolean
}

const NodeTree = ({ isCollapsed }: IProps) => {
  const { nodes, selectedPath, moveToNode, onExpandNode } = useContext(FlowContext);

  const mapNodesToNavLinks = useCallback((parentId: string | null = null, includeCollapsed: boolean = false): INavLink[] => {
    let filteredNodes = nodes.filter((node) => includeCollapsed || (parentId ? node.data.parentId === parentId : !node.data.parentId));

    if(isCollapsed)
      filteredNodes = filteredNodes.filter((node) => !node.hidden)
    
    return filteredNodes.map((node) => {
        const label = node.data.label && typeof node.data.label === 'string' ? node.data.label : '-';
        const isSelected = selectedPath?.includes(node.id);
        const childrenLinks = includeCollapsed ? undefined : mapNodesToNavLinks(node.id);

        return {
          key: node.id,
          name: label,
          url: "",
          isSelected,
          isExpanded: node.data.expanded,
          links: childrenLinks?.length ? childrenLinks : undefined,
          onClick: () => moveToNode(node.id)
        } as INavLink;
      });
  }, [nodes, isCollapsed]);

  const navLinkGroups: INavLinkGroup[] = useMemo(() => [
    {
      links: mapNodesToNavLinks(null, isCollapsed),
    },
  ], [nodes, isCollapsed]);

  const navStyles: Partial<INavStyles> = {
    link: {
      selectors: {
        '&.is-selected': {
          backgroundColor: '#e5f1fb',
          fontWeight: 'bold',
          borderLeft: '3px solid #0078d4',
        },
      },
      color: "#3b3b3b"
    },
  };

  return <Nav 
    groups={navLinkGroups} 
    styles={navStyles} 
    selectedKey={selectedPath?.[selectedPath.length - 1]}
    onRenderLink={(props) => {
      return <Badge key={props?.key} name={props?.name as string} size={PersonaSize.size32} isCollapsed={isCollapsed} />
    }}
    onLinkExpandClick={(ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
      ev?.preventDefault();
      if ((ev?.target as HTMLElement).closest('.ms-Nav-chevron')) {
        moveToNode(item?.key as string)
        onExpandNode(item?.key as string);
      }
    }}
  />;
};

export default NodeTree;