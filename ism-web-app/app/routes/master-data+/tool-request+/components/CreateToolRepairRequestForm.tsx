import React, { useState } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { ToolModel } from "~/data/models/tool/ToolModel";
import { PersonnelModel } from "~/data/models/personnel/PersonnelModel";

interface CreateToolRepairRequestFormProps {
    isOpen: boolean;
    onClose: () => void;
    tools: ToolModel[];
    personnel: PersonnelModel[];
}

const CreateToolRepairRequestForm: React.FC<CreateToolRepairRequestFormProps> = ({ isOpen, onClose, tools, personnel }) => {
    const submit = useSubmit();
    const [toolId, setToolId] = useState("");
    const [description, setDescription] = useState("");
    const [personnelId, setPersonnelId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [images, setImages] = useState<File[]>([]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setImages(files);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("toolId", toolId);
        formData.append("description", description);
        formData.append("personnelId", personnelId);
        formData.append("quantity", quantity);

        const imagePromises = images.map((image) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(image);
            });
        });

        const base64Images = await Promise.all(imagePromises);
        base64Images.forEach((base64Image, index) => {
            formData.append(`images[${index}][name]`, images[index].name);
            formData.append(`images[${index}][base64]`, base64Image);
        });

        submit(formData, { method: "post", action: "/master-data/tool-request/repair-create" });
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
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Create Tool Repair Request
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <Form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="toolId" className="block text-sm font-medium text-gray-700">
                                Tool:
                            </label>
                            <select
                                id="toolId"
                                name="toolId"
                                value={toolId}
                                onChange={(e) => setToolId(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            >
                                <option value="">Select a tool</option>
                                {tools.map((tool) => (
                                    <option key={tool.id} value={tool.id}>
                                        {tool.toolName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description:
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
                        </div>
                        <div>
                            <label htmlFor="personnelId" className="block text-sm font-medium text-gray-700">
                                Requested By:
                            </label>
                            <select
                                id="personnelId"
                                name="personnelId"
                                value={personnelId}
                                onChange={(e) => setPersonnelId(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            >
                                <option value="">Select personnel</option>
                                {personnel.map((person) => (
                                    <option key={person.id} value={person.id}>
                                        {person.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                Quantity:
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
                        </div>
                        <div>
                            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                                Images:
                            </label>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                            >
                                Create
                            </Button>
                        </div>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateToolRepairRequestForm;
