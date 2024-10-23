import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form, useSubmit } from "@remix-run/react";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { ToolModel } from "~/data/models/tool/ToolModel";
import { Button } from "~/components/ui/button";

interface EditCheckinFormProps {
    isOpen: boolean;
    onClose: () => void;
    item: CheckinModel | null;
    projects: ProjectModel[];
    tools: ToolModel[];
}

const EditCheckinForm: React.FC<EditCheckinFormProps> = ({ isOpen, onClose, item, projects, tools }) => {
    const submit = useSubmit();
    const [toolId, setToolId] = useState(item?.toolId || "");
    const [projectId, setProjectId] = useState(item?.projectId || "");
    const [checkInDate, setCheckInDate] = useState(item?.checkInDate ? new Date(item.checkInDate).toISOString().split('T')[0] : "");
    const [checkInQuantity, setCheckInQuantity] = useState(item?.checkInQuantity || 0);
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [projectColor, setProjectColor] = useState<string>("#000000");

    useEffect(() => {
        if (item) {
            setToolId(item.toolId);
            setProjectId(item.projectId);
            setCheckInDate(item.checkInDate ? new Date(item.checkInDate).toISOString().split('T')[0] : "");
            setCheckInQuantity(item.checkInQuantity || 0);
        }
    }, [item]);

    useEffect(() => {
        const selectedTool = tools.find(tool => tool.id === Number(toolId));
        if (selectedTool) {
            setAvailableQuantity(selectedTool.quantity);
        } else {
            setAvailableQuantity(0);
        }
    }, [toolId, tools]);

    useEffect(() => {
        const selectedProject = projects.find(project => project.id === Number(projectId));
        if (selectedProject) {
            setProjectColor(selectedProject.color);
        } else {
            setProjectColor("#000000");
        }
    }, [projectId, projects]);

    const handleEditSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (item) {
            const formData = new FormData();
            formData.append("id", item.id.toString());
            formData.append("toolId", toolId.toString());
            formData.append("projectId", projectId.toString());
            formData.append("checkInDate", checkInDate);
            formData.append("checkInQuantity", checkInQuantity.toString());

            submit(formData, { method: "post", action: "/master-data/checkins/update" });
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
                        Edit Check-In
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <Form onSubmit={handleEditSubmit} className="space-y-4">
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
                            {toolId && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Available Quantity: {availableQuantity}
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
                                Project:
                            </label>
                            <div className="flex items-center">
                                <select
                                    id="projectId"
                                    name="projectId"
                                    value={projectId}
                                    onChange={(e) => setProjectId(e.target.value)}
                                    required
                                    className="mt-1 block w-auto px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                                >
                                    <option value="">Select a project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.projectName}
                                        </option>
                                    ))}
                                </select>
                                {projectId && (
                                    <div className="ml-2 flex items-center space-x-2">
                                        <div className="flex items-center space-x-1">
                                            <div
                                                className="w-6 h-6 rounded-full border border-black"
                                                style={{ backgroundColor: item?.checkInColor }}
                                            ></div>
                                            <span className="text-sm">Current</span>
                                        </div>
                                        {item?.checkInColor !== projectColor && (
                                            <div className="flex items-center space-x-1">
                                                <div
                                                    className="w-6 h-6 rounded-full border border-black"
                                                    style={{ backgroundColor: projectColor }}
                                                ></div>
                                                <span className="text-sm">From Project</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
                                Check-In Date:
                            </label>
                            <input
                                type="date"
                                id="checkInDate"
                                name="checkInDate"
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
                        </div>
                        <div>
                            <label htmlFor="checkInQuantity" className="block text-sm font-medium text-gray-700">
                                Check-In Quantity:
                            </label>
                            <input
                                type="number"
                                id="checkInQuantity"
                                name="checkInQuantity"
                                value={checkInQuantity}
                                onChange={(e) => setCheckInQuantity(Number(e.target.value))}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                disabled={item?.checkOutDate !== null}
                                type="submit"
                            >
                                Update
                            </Button>
                        </div>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditCheckinForm;
