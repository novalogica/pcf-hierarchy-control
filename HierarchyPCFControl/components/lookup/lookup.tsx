import * as React from "react";
import { useContext } from "react";
import { ControlContext } from "../../context/control-context";
import { useNavigation } from "../../hooks/useNavigation";
import { Link } from "@fluentui/react/lib/Link";

interface IProps {
    item: ComponentFramework.LookupValue
}

const LookupField = React.memo(({ item }: IProps) => {
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