import * as React from 'react';
import { Nav, INavLinkGroup, INavLink, INavStyles } from '@fluentui/react/lib/Nav';
import { useContext, useMemo } from 'react';
import { FlowContext } from '../../context/flow-context';

const NodeTree: React.FunctionComponent = () => {
  const { nodes, selectedPath, moveToNode, onExpandNode } = useContext(FlowContext);

  const handleNodeClick = (nodeId: string) => {
    moveToNode(nodeId)
  };

  const mapNodesToNavLinks = (parentId: string | null = null): INavLink[] => {
    return nodes
      .filter((node) => (parentId ? node.data.parentId === parentId : !node.data.parentId))
      .map((node) => {
        const label = typeof node.data.label === 'string' ? node.data.label : '-';
        const childrenLinks = mapNodesToNavLinks(node.id);
        const isSelected = selectedPath?.includes(node.id);

        return {
          key: node.id,
          name: label,
          url: "",
          isSelected,
          isExpanded: node.data.expanded,
          links: childrenLinks.length > 0 ? childrenLinks : undefined,
        } as INavLink;
      });
  };

  const navLinkGroups: INavLinkGroup[] = useMemo(() => [
    {
      links: mapNodesToNavLinks(null),
    },
  ], [nodes]);

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
    onLinkExpandClick={(ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
      ev?.preventDefault();
      if (item?.key) {
        onExpandNode(item.key);
      }
    }}
    onLinkClick={(ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
      ev?.preventDefault();
      if (item?.key) {
        handleNodeClick(item.key);
      }
    }}
  />;
};

export default NodeTree;