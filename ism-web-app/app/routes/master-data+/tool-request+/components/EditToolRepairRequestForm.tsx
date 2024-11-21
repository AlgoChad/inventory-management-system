import React, { useState } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { ToolRepairRequest } from "~/data/models/tool/ToolModel";

interface EditToolRepairRequestFormProps {
    isOpen: boolean;
    onClose: () => void;
    item: ToolRepairRequest;
}

const EditToolRepairRequestForm: React.FC<EditToolRepairRequestFormProps> = ({ isOpen, onClose, item }) => {
    const submit = useSubmit();
    const [toolName, setToolName] = useState(item.tool.toolName);
    const [description, setDescription] = useState(item.description);
    const [requestedBy, setRequestedBy] = useState(item.personnel.name);
    const [status, setStatus] = useState(item.status);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("id", item.id.toString());
        formData.append("toolName", toolName);
        formData.append("description", description);
        formData.append("requestedBy", requestedBy);
        formData.append("status", status);

        submit(formData, { method: "post", action: "/tool-repair-requests/edit" });
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
                        Edit Tool Repair Request
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <Form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="toolName" className="block text-sm font-medium text-gray-700">
                                Tool Name:
                            </label>
                            <input
                                type="text"
                                id="toolName"
                                name="toolName"
                                value={toolName}
                                onChange={(e) => setToolName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
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
                            <label htmlFor="requestedBy" className="block text-sm font-medium text-gray-700">
                                Requested By:
                            </label>
                            <input
                                type="text"
                                id="requestedBy"
                                name="requestedBy"
                                value={requestedBy}
                                onChange={(e) => setRequestedBy(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status:
                            </label>
                            <input
                                type="text"
                                id="status"
                                name="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
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
                                Save
                            </Button>
                        </div>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditToolRepairRequestForm;
