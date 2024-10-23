import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form, useSubmit } from "@remix-run/react";

interface CreateProjectFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const predefinedColors: { hex: string, name: string }[] = [
    { hex: "#000000", name: "Black" },
    { hex: "#FFFFFF", name: "White" },
    { hex: "#FF0000", name: "Red" },
    { hex: "#00FF00", name: "Lime" },
    { hex: "#0000FF", name: "Blue" },
    { hex: "#FFFF00", name: "Yellow" },
    { hex: "#FFA500", name: "Orange" },
    { hex: "#800080", name: "Purple" },
    { hex: "#00FFFF", name: "Cyan" },
    { hex: "#FFC0CB", name: "Pink" },
    { hex: "#808080", name: "Gray" },
    { hex: "#A52A2A", name: "Brown" },
    { hex: "#008000", name: "Green" },
    { hex: "#800000", name: "Maroon" },
    { hex: "#000080", name: "Navy" },
];

const getColorName = (hex: string): string => {
    const color = predefinedColors.find(color => color.hex.toUpperCase() === hex.toUpperCase());
    return color ? color.name : "Custom Color";
};

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ isOpen, onClose }) => {
    const submit = useSubmit();
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [color, setColor] = useState("#000000");
    const [isCustomColor, setIsCustomColor] = useState(false);

    useEffect(() => {
        if (!predefinedColors.some(c => c.hex === color)) {
            setIsCustomColor(true);
        } else {
            setIsCustomColor(false);
        }
    }, [color]);

    const handleCreateSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("projectName", projectName);
        formData.append("projectDescription", projectDescription);
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("color", color);

        submit(formData, { method: "post", action: "/master-data/projects/create" });
        onClose();
    };

    return (
        <Dialog
            modal
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                </DialogHeader>
                <Form onSubmit={handleCreateSubmit}>
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                            Project Name:
                        </label>
                        <input
                            type="text"
                            id="projectName"
                            name="projectName"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                        />
                    </div>
                    <div>
                        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
                            Project Description:
                        </label>
                        <textarea
                            id="projectDescription"
                            name="projectDescription"
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                        />
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Start Date:
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            End Date:
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                        />
                    </div>
                    <div>
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                            Project Color:
                        </label>
                        <div className="flex items-center">
                            <select
                                id="color"
                                name="color"
                                value={isCustomColor ? "custom" : color}
                                onChange={(e) => {
                                    if (e.target.value === "custom") {
                                        setIsCustomColor(true);
                                    } else {
                                        setColor(e.target.value);
                                        setIsCustomColor(false);
                                    }
                                }}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            >
                                {predefinedColors.map((colorOption) => (
                                    <option key={colorOption.hex} value={colorOption.hex}>
                                        {colorOption.name}
                                    </option>
                                ))}
                                <option value="custom">Custom</option>
                            </select>
                            <div
                                className="ml-2 w-6 h-6 rounded-full border border-black"
                                style={{ backgroundColor: color }}
                            ></div>
                        </div>
                        {isCustomColor && (
                            <input
                                type="color"
                                id="customColor"
                                name="customColor"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
                        )}
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                            Create Project
                        </button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectForm;
