import { useState, useEffect } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { ToolModel } from "~/data/models/tool/ToolModel";

interface CreateCheckinFormProps {
    isOpen: boolean;
    onClose: () => void;
    projects: ProjectModel[];
    tools: ToolModel[];
}

const CreateCheckinForm: React.FC<CreateCheckinFormProps> = ({ isOpen, onClose, projects, tools }) => {
    const submit = useSubmit();
    const [toolId, setToolId] = useState("");
    const [projectId, setProjectId] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkInColor, setCheckInColor] = useState("#000000");
    const [checkInQuantity, setCheckInQuantity] = useState(0);
    const [availableQuantity, setAvailableQuantity] = useState(0);

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
            setCheckInColor(selectedProject.color);
        } else {
            setCheckInColor("#000000");
        }
    }, [projectId, projects]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("toolId", toolId);
        formData.append("projectId", projectId);
        formData.append("checkInDate", checkInDate);
        formData.append("checkInColor", checkInColor);
        formData.append("checkInQuantity", checkInQuantity.toString());

        submit(formData, { method: "post", action: "/master-data/checkins/create" });

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
                        Create Check-In
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
                                    className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                                >
                                    <option value="">Select a project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.projectName}
                                        </option>
                                    ))}
                                </select>
                                {projectId && (
                                    <div
                                        className="ml-2 w-6 h-6 rounded-full border border-black"
                                        style={{ backgroundColor: checkInColor }}
                                    ></div>
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

export default CreateCheckinForm;
