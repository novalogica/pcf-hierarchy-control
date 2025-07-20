const StorageKeys = {
    HIERARCHY_VIEW: 'HIERARCHY_VIEW'
} as const;

export type StorageKeysType = (typeof StorageKeys)[keyof typeof StorageKeys];

export const useStorage = () => {
    const getLastUsedView = (entityName: string): string | null => {
        return localStorage.getItem(`${StorageKeys.HIERARCHY_VIEW}-${entityName}`);
    }
    const setLastUsedView = (entityName: string, value: string): void => {
        localStorage.setItem(`${StorageKeys.HIERARCHY_VIEW}-${entityName}`, value);
    }

    return {
        getLastUsedView,
        setLastUsedView
    }
}