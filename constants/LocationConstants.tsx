import {InputTypeDropdownOption} from "@/components/ui/input-field";
import {usaStatesWithCounties} from "typed-usa-states";

export const LoadCountyParishDropdownOptions = (value: string | null) => {
    let dropdownOptions: InputTypeDropdownOption[] = [];
    if(value && value.length > 1){
        let selectedState = usaStatesWithCounties.filter(state => state.abbreviation == value);
        if(selectedState && selectedState.length > 0){
            const selectedStateCounties = selectedState[0].counties ?? [];
            if(selectedStateCounties && selectedStateCounties.length > 0){
                dropdownOptions = selectedStateCounties.map(x => {
                    return {
                        id: x,
                        name: x
                    } as InputTypeDropdownOption
                })
            }
        }
    }
    return dropdownOptions;
}