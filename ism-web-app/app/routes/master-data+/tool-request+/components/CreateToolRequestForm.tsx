import React, { useState } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { ToolModel } from "~/data/models/tool/ToolModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { PersonnelModel } from "~/data/models/personnel/PersonnelModel";

interface CreateToolRequestFormProps {
    isOpen: boolean;
    onClose: () => void;
    tools: ToolModel[];
    projects: ProjectModel[];
    personnel: PersonnelModel[];
}

const CreateToolRequestForm: React.FC<CreateToolRequestFormProps> = ({ isOpen, onClose, tools, projects, personnel }) => {
    const submit = useSubmit();
    const [toolId, setToolId] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [projectId, setProjectId] = useState("");
    const [personnelId, setPersonnelId] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("toolId", toolId);
        formData.append("quantity", quantity.toString());
        formData.append("projectId", projectId);
        formData.append("personnelId", personnelId);

        submit(formData, { method: "post", action: "/master-data/tool-request/request-create" });
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
                        Create Tool Request
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
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                Quantity:
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
                        </div>
                        <div>
                            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
                                Project:
                            </label>
                            <select
                                id="projectId"
                                name="projectId"
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            >
                                <option value="">Select a project</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.projectName}
                                    </option>
                                ))}
                            </select>
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
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={onClose}
                                className="mr-2"
                            >
                                Cancel
                            </Button>
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

export default CreateToolRequestForm;
