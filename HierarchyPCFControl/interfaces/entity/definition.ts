export default interface EntityDefinition {
    LogicalName: string;
    DisplayName: DisplayName;
    AttributeType: string;
}

interface DisplayName {
    UserLocalizedLabel: UserLocalizedLabel;
}

interface UserLocalizedLabel {
    Label: string;
}