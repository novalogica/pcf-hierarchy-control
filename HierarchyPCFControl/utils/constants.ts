import { PersonaInitialsColor } from "@fluentui/react/lib/Persona";
import { Position, HandleType } from "@xyflow/react";

const nodeWidth = 350;
const nodeHeight = 250;

const colors = {
  active25: 'rgba(65, 104, 189, 0.25)',
  active85: 'rgba(65, 104, 189, 0.85)',
  black10: 'rgba(0,0,0,0.1)',
  inactive: '#ccc',
  label: 'rgb(163 155 155)',
  transparent: 'transparent',
  secondaryBackground: 'rgba(178, 178, 178, 0.1)'
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

export {
  nodeWidth,
  nodeHeight,
  colors,
  handles,
  badgeColors
}
