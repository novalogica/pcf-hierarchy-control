import { EntityDescriptor } from "./descriptor";

export interface EntityMetadata {
    _entityDescriptor: EntityDescriptor,
    _ownershipType: OwnershipType
}

export enum OwnershipType {
    None = 0,
    UserOwned = 1,
    TeamOwned = 2,
    BusinessOwned = 4,
    OrganizationOwned = 8,
    BusinessParented = 16,
    Filtered = 32
}