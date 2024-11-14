import * as React from "react";
import {MediatorKeys} from "./Profile.tsx";

interface InputWithElementsProps{
    elements:string[]
    addItem:(value:string)=>void,
    removeItem:(value:number)=>void,
    name:MediatorKeys
}
const InputWithElements:React.FC<InputWithElementsProps>= ({elements,addItem,removeItem,name}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{name}</label>
            <div className="space-y-2">
                {elements.map((service, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span>{service}</span>
                        <button type="button" onClick={() => removeItem(index)}
                                className="text-red-600">Remove
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onKeyDown={(e) => {
                        const value = e.currentTarget.value.trim();
                        if (e.key === 'Enter' && value) {
                            e.preventDefault(); // Prevent form submission
                            addItem(value);
                            e.currentTarget.value = ''; // Clear the input
                        }
                    }}
                    placeholder="Add item"
                />
            </div>
        </div>
    );
};

export default InputWithElements;