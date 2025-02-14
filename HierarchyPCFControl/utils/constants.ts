import { PersonaInitialsColor } from "@fluentui/react/lib/Persona";
import { Position, HandleType } from "@xyflow/react";
import { Column } from "../interfaces/entity";

const nodeWidth = 550;
const nodeHeight = 450;

const colors = {
  active75: 'rgba(65, 104, 189, 0.75)',
  active85: 'rgba(65, 104, 189, 0.85)',
  black10: 'rgba(0,0,0,0.1)',
  inactive: '#ccc',
  label: 'rgb(163 155 155)',
  transparent: 'transparent',
  secondaryBackground: 'rgb(240, 240, 240, 0.3)',
  badgeColor: '#424b54'
}

const handles: { type: HandleType, position: Position}[] = [
  {
    type: 'source',
    position: Position.Bottom
  },
  {
    type: 'target',
    position: Position.Top
  }
]

const badgeColors = [
  PersonaInitialsColor.lightBlue,
  PersonaInitialsColor.blue,
  PersonaInitialsColor.teal,
  PersonaInitialsColor.lightGreen,
  PersonaInitialsColor.green,
  PersonaInitialsColor.lightPink,
  PersonaInitialsColor.magenta,
  PersonaInitialsColor.purple,
  PersonaInitialsColor.orange,
  PersonaInitialsColor.violet,
  PersonaInitialsColor.lightRed,
  PersonaInitialsColor.gold,
  PersonaInitialsColor.burgundy,
  PersonaInitialsColor.warmGray,
  PersonaInitialsColor.coolGray,
  PersonaInitialsColor.cyan,
]

const defaultColumns: Column[] = [
  {
    logicalName: '_ownerid_value',
    displayName: 'Owner',
    attributeType: 'Owner'
  },
  {
    logicalName: 'statecode',
    displayName: 'State',
    attributeType: 'Picklist'
  }
]

export {
  nodeWidth,
  nodeHeight,
  colors,
  handles,
  badgeColors,
  defaultColumns
}
