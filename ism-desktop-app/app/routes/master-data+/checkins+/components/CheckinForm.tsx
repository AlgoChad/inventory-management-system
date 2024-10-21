import { useState } from "react";
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
    const [checkOutDate, setCheckOutDate] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("toolId", toolId);
        formData.append("projectId", projectId);
        formData.append("checkInDate", checkInDate);
        formData.append("checkOutDate", checkOutDate);

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
                                        {tool.toolDescription}
                                    </option>
                                ))}
                            </select>
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
                                        {project.projectDescription}
                                    </option>
                                ))}
                            </select>
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
                            <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">
                                Check-Out Date:
                            </label>
                            <input
                                type="date"
                                id="checkOutDate"
                                name="checkOutDate"
                                value={checkOutDate}
                                onChange={(e) => setCheckOutDate(e.target.value)}
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
