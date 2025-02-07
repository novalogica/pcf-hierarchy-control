import { EntityRelationship } from "./relationship";

export interface EntityDescriptor {
    PrimaryNameAttribute: string,
    EntityLogicalName: string,
    DisplayName: string,
    PrimaryKeyName: string,
    OneToManyRelationships: EntityRelationship
}