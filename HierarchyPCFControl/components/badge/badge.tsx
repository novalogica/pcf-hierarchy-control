import * as React from "react";
import { useMemo } from "react";
import { getInitials } from "@fluentui/react/lib/Utilities";
import { IPersonaProps, Persona, PersonaSize } from "@fluentui/react/lib/Persona";
import { Text } from "@fluentui/react/lib/Text";
import { badgeColors } from "../../utils/constants";
import { getColorFromInitials } from "../../utils/utils";

interface IProps {
  name: string,
  size?: PersonaSize,
  isCollapsed?: boolean
}

export const Badge = ({ name, isCollapsed, size = PersonaSize.size40 }: IProps) => {

  const initials = useMemo(() => getInitials(name, false), [name])

  return (
    <div style={styles.badgeContainer}>
        <Persona
          text={name}
          size={size}
          imageInitials={initials}
          initialsColor={getColorFromInitials(initials, badgeColors)}
          onRenderPrimaryText={(props?: IPersonaProps) => {
            return isCollapsed ? <></> : (
              <Text style={{...styles.badgeName, display: isCollapsed ? 'none': 'flex'}} variant="medium" nowrap block>
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
