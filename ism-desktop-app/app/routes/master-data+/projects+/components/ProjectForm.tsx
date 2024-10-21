import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form, useSubmit } from "@remix-run/react";

interface CreateProjectFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ isOpen, onClose }) => {
    const submit = useSubmit();
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleCreateSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("projectName", projectName);
        formData.append("projectDescription", projectDescription);
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);

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
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Create New Project
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <Form onSubmit={handleCreateSubmit} className="space-y-4">
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
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-black shadow-sm text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            >
                                Create
                            </button>
                        </div>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectForm;
