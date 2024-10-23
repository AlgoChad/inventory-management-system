import React, { useState, useEffect } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { ToolModel } from "~/data/models/tool/ToolModel";

interface TransferCheckinFormProps {
    isOpen: boolean;
    onClose: () => void;
    item: CheckinModel;
    projects: ProjectModel[];
    tools: ToolModel[];
}

const TransferCheckinForm: React.FC<TransferCheckinFormProps> = ({ isOpen, onClose, item, projects, tools }) => {
    const submit = useSubmit();
    const [projectId, setProjectId] = useState<string>("");
    const [transferQuantity, setTransferQuantity] = useState<string>("");
    const [availableQuantity, setAvailableQuantity] = useState<number>(0);

    useEffect(() => {
        const selectedTool = tools.find(tool => tool.id === item.tool.id);
        if (selectedTool) {
            setAvailableQuantity(selectedTool.quantity);
        } else {
            setAvailableQuantity(0);
        }
    }, [item.toolId, tools]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("checkInId", item.id.toString());
        formData.append("projectId", projectId);
        formData.append("transferQuantity", transferQuantity);
        submit(formData, { method: "post", action: "/master-data/checkins/transfer" });
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
                        Transfer Check-In
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <Form onSubmit={handleSubmit} className="space-y-4">
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
                            </div>
                        </div>
                        <div>
                            <label htmlFor="transferQuantity" className="block text-sm font-medium text-gray-700">
                                Transfer Quantity:
                            </label>
                            <input
                                type="number"
                                id="transferQuantity"
                                name="transferQuantity"
                                value={transferQuantity}
                                onChange={(e) => setTransferQuantity(e.target.value)}
                                required
                                min="1"
                                max={item.checkInQuantity}
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Available Quantity: {availableQuantity}
                            </p>
                            <p className="text-sm text-gray-600">
                                Checked In Quantity: {item.checkInQuantity}
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">
                                Transfer
                            </Button>
                            <Button variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TransferCheckinForm;
