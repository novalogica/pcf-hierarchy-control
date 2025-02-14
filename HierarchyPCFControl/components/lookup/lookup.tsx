import * as React from "react";
import { memo, useContext } from "react";
import { Link } from "@fluentui/react/lib/Link";

import { ControlContext } from "../../context/control-context";
import { useNavigation } from "../../hooks/useNavigation";

interface IProps {
    item: ComponentFramework.LookupValue
}

const LookupField = memo(({ item }: IProps) => {
    const { context } = useContext(ControlContext);
    const { openForm } = useNavigation(context)
    
    const onLookupClicked = (value: ComponentFramework.LookupValue) => {
        openForm(value.entityType, value.id)
    }

    return (
        <Link 
            style={{ color: 'rgb(17, 94, 163)', borderRadius: 4, padding: 6 }}
            onClick={() => onLookupClicked(item)}
        >
            {item.name}
        </Link>
    );
})

LookupField.displayName = 'LookupField'
export default LookupField;