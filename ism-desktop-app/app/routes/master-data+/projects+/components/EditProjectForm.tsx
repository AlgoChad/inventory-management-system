import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form, useSubmit } from "@remix-run/react";
import { ProjectModel } from "~/data/models/project/ProjectModel";

interface EditProjectForm {
    isOpen: boolean;
    onClose: () => void;
    item: ProjectModel | null;
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

const EditProjectForm: React.FC<EditProjectForm> = ({ isOpen, onClose, item }) => {
    const submit = useSubmit();
    const [projectName, setProjectName] = useState(item?.projectName || "");
    const [projectDescription, setProjectDescription] = useState(item?.projectDescription || "");
    const [startDate, setStartDate] = useState(item?.startDate ? new Date(item.startDate).toISOString().substring(0, 10) : "");
    const [endDate, setEndDate] = useState(item?.endDate ? new Date(item.endDate).toISOString().substring(0, 10) : "");
    const [color, setColor] = useState(item?.color || "#000000");
    const [isCustomColor, setIsCustomColor] = useState(false);

    useEffect(() => {
        if (!predefinedColors.some(c => c.hex === color)) {
            setIsCustomColor(true);
        } else {
            setIsCustomColor(false);
        }
    }, [color]);

    const handleEditSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (item) {
            const formData = new FormData();
            formData.append("id", item.id.toString());
            formData.append("projectName", projectName);
            formData.append("projectDescription", projectDescription);
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);
            formData.append("color", color);

            submit(formData, { method: "post", action: "/master-data/projects/update" });
            onClose();
        }
    };

    return (
        <Dialog
            modal
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Edit Project
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <Form onSubmit={handleEditSubmit} className="space-y-4">
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
                            <input
                                type="text"
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
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-black shadow-sm text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            >
                                Update
                            </button>
                        </div>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditProjectForm;
