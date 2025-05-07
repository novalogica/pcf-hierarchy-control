import { IInputs } from "../generated/ManifestTypes";

export const useNavigation = (context: ComponentFramework.Context<IInputs>) => {

    const openForm = async (entityName: string, id?: string): Promise<void> => {
        const pageInput = {
            entityName: entityName,
            entityId: id,
            pageType: "entityrecord"
        }

        const popupOptions = {
            height: {value: 85, unit:"%"},
            width: {value: 90, unit:"%"}, 
            target: 2,  
            position: 1
        };

        //@ts-expect-error - Method does not exist in PCF SDK however it should be use to maintain control state alive
        await context.navigation.navigateTo(pageInput, popupOptions);
    }

    return {
        openForm
    }
}