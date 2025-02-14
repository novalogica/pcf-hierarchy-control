import * as React from "react";
import { useContext, useMemo } from "react";
import { getInitials } from "@fluentui/react/lib/Utilities";
import { IPersonaProps, Persona, PersonaSize } from "@fluentui/react/lib/Persona";
import { Text } from "@fluentui/react/lib/Text";
import { badgeColors } from "../../utils/constants";
import { getColorFromInitials } from "../../utils/utils";
import { useNavigation } from "../../hooks/useNavigation";
import { ControlContext } from "../../context/control-context";

interface IProps {
  name?: string,
  id?: string,
  etn?: string,
  size?: PersonaSize,
  isCollapsed?: boolean,
  nameStyle?: React.CSSProperties,
  isClickable?: boolean
}

export const Badge = ({ name, etn, id, isCollapsed, size = PersonaSize.size40, nameStyle, isClickable = false }: IProps) => {
  const { context } = useContext(ControlContext);
  const { openForm } = useNavigation(context)
  const initials = useMemo(() => getInitials(name, false), [name])

  const handleBadgeClick = () => {
    isClickable && etn && id && openForm(etn, id)
  }

  return (
    <div style={styles.badgeContainer} onClick={handleBadgeClick}>
        <Persona
          text={isCollapsed ? "" : name}
          size={size}
          imageInitials={initials}
          initialsColor={getColorFromInitials(initials, badgeColors)}
          onRenderPrimaryText={(props?: IPersonaProps) => {
            return isCollapsed ? <></> : (
              <Text style={{...styles.badgeName, display: isCollapsed ? 'none': 'flex', ...nameStyle}} variant="medium" nowrap block>
                {props?.text}
              </Text>
            )
          }}
        />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  badgeContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  badgeName: {
    maxWidth: '150px'
  }
}
