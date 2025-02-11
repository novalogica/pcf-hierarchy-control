import { Column, EntityMetadata, Form, RelationshipInfo } from "../interfaces/entity";
import EntityDefinition from "../interfaces/entity/definition";

export const extractColumns = (
  cardXml: string,
  relationship: RelationshipInfo,
  attributes: EntityDefinition[],
  metadata: EntityMetadata
): Column[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(cardXml, "text/xml");

  const controls = Array.from(xmlDoc.getElementsByTagName("control")).filter((control) => {
    const cell = control.closest("cell");
    return cell?.getAttribute("visible") != "false" && control.getAttribute("datafieldname")
  });

  const columns = controls.length
    ? controls.map((control) => {
        const logicalName = control.getAttribute("id") as string;

        const cell = control.closest("cell");
        const label = cell?.querySelector("label");
        const displayName = label?.getAttribute("description") || logicalName;

        const attribute = attributes.find((attr) => attr.LogicalName === logicalName);
        const isUniqueIdentifier = attribute?.AttributeType === "Lookup" || attribute?.AttributeType === "Owner" || attribute?.AttributeType === "Customer";

        return {
          logicalName: isUniqueIdentifier ? `_${logicalName}_value` : logicalName,
          displayName,
          attributeType: attribute?.AttributeType
        } as Column;
      })
    : [];

  const requiredColumns: Column[] = [
    {
      logicalName: relationship.ReferencedAttribute,
      displayName: relationship.ReferencedAttribute,
    },
    {
      logicalName: `_${relationship.ReferencingAttribute}_value`,
      displayName: relationship.ReferencingAttribute,
    },
  ];

  const primaryKeyColumn: Column = {
    logicalName: metadata._entityDescriptor.PrimaryKeyName,
    displayName: attributes.find(a => a.LogicalName === metadata._entityDescriptor.PrimaryKeyName)?.DisplayName.UserLocalizedLabel.Label ?? metadata._entityDescriptor.PrimaryKeyName
  };

  const primaryNameColumn: Column = {
    logicalName: metadata._entityDescriptor.PrimaryNameAttribute,
    displayName: attributes.find(a => a.LogicalName === metadata._entityDescriptor.PrimaryNameAttribute)?.DisplayName.UserLocalizedLabel.Label ?? metadata._entityDescriptor.PrimaryNameAttribute
  };

  if (!columns.some((c) => c.logicalName === primaryKeyColumn.logicalName)) {
    columns.push(primaryKeyColumn);
  }

  if (!columns.some((c) => c.logicalName === primaryNameColumn.logicalName)) {
    columns.push(primaryNameColumn);
  }

  requiredColumns.forEach((column) => {
    if (!columns.some((c) => c.logicalName === column.logicalName)) {
      columns.push(column);
    }
  });

  return columns;
};

export const generateColumns = (forms: Form[]): Column[] => {
  const uniqueColumns = forms.reduce((acc, form) => {
    form.columns.forEach(column => acc.set(column.logicalName, column));
    return acc;
  }, new Map<string, Column>());

  return Array.from(uniqueColumns.values())
}