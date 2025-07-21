import { PersonaInitialsColor } from "@fluentui/react/lib/Persona";
import { Column } from "../interfaces/entity";

const nodeWidth = 550;
const nodeHeight = 450;
const nodeLengthLimit = 250;

const colors = {
  active25: 'rgba(65, 104, 189, 0.25)',
  active75: 'rgba(65, 104, 189, 0.75)',
  active85: 'rgba(65, 104, 189, 0.85)',
  black10: 'rgba(0,0,0,0.1)',
  inactive: '#ccc',
  label: 'rgb(163 155 155)',
  transparent: 'transparent',
  secondaryBackground: 'rgb(240, 240, 240, 0.3)',
  badgeColor: 'rgb(158 160 163)'
}

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

const defaultColumns = (): Column[] => {
  return [{
    logicalName: 'statecode',
    displayName: 'State',
    attributeType: 'Picklist'
  }];
}

export {
  nodeWidth,
  nodeHeight,
  colors,
  badgeColors,
  defaultColumns,
  nodeLengthLimit
}
