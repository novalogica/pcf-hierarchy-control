import * as React from 'react';
import { memo, useCallback, useContext, useMemo } from 'react';
import { Nav, INavLinkGroup, INavLink, INavStyles } from '@fluentui/react/lib/Nav';
import { PersonaSize } from "@fluentui/react/lib/Persona";

import { FlowContext } from '../../context/flow-context';
import { Badge } from '../badge/badge';

interface IProps {
  isCollapsed: boolean
}

const NodeTree = memo(({ isCollapsed }: IProps) => {
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

  const navLinkGroups: INavLinkGroup[] = useMemo(() => [{
      links: mapNodesToNavLinks(null, isCollapsed),
  }], [nodes, isCollapsed]);

  const handleLinkExpandClick = useCallback((ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    ev?.preventDefault();

    if ((ev?.target as HTMLElement).closest('.ms-Nav-chevron')) {
      onExpandNode(item?.key as string);
    }
  }, [])

  return <Nav 
    groups={navLinkGroups} 
    styles={navStyles} 
    selectedKey={selectedPath?.[selectedPath.length - 1]}
    onRenderLink={(props) => <Badge key={props?.key} name={props?.name as string} size={PersonaSize.size32} isCollapsed={isCollapsed} />}
    onLinkExpandClick={handleLinkExpandClick}
  />;
});


NodeTree.displayName = "NodeTree"
export default NodeTree;

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