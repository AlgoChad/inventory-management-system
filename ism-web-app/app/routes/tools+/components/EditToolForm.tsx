import { useState } from "react";
import { Form, useFetcher } from "@remix-run/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { ToolModel } from "~/data/models/tool/ToolModel";

interface EditToolFormProps {
    isOpen: boolean;
    onClose: () => void;
    item: ToolModel;
    conditionTypes: Array<{ id: number; name: string }>;
    statusTypes: Array<{ id: number; name: string }>;
    projects: Array<{ id: number; name: string }>;
    personnel: Array<{ id: number; name: string }>;
}

const EditToolForm: React.FC<EditToolFormProps> = ({ isOpen, onClose, item, conditionTypes, statusTypes, projects, personnel }) => {
    const fetcher = useFetcher();
    const [toolNumber, setToolNumber] = useState(item.toolNumber);
    const [toolDescription, setToolDescription] = useState(item.toolDescription);
    const [quantity, setQuantity] = useState(item.quantity);
    const [conditionId, setConditionId] = useState(item.conditionId || "");
    const [statusId, setStatusId] = useState(item.statusId || "");
    const [projectId, setProjectId] = useState(item.projectId || "");
    const [personnelId, setPersonnelId] = useState(item.personnelId || "");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("id", item.id.toString()); // Ensure id is included
        formData.append("toolNumber", toolNumber);
        formData.append("toolDescription", toolDescription);
        formData.append("quantity", quantity.toString());
        if (conditionId) formData.append("conditionId", conditionId.toString());
        if (statusId) formData.append("statusId", statusId.toString());
        if (projectId) formData.append("projectId", projectId.toString());
        if (personnelId) formData.append("personnelId", personnelId.toString());
    
        fetcher.submit(formData, { method: "post", action: `/tools/update` });
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
                        Edit Tool
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <Form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="toolNumber" className="block text-sm font-medium text-gray-700">
                                Tool Number:
                            </label>
                            <input
                                type="text"
                                id="toolNumber"
                                name="toolNumber"
                                value={toolNumber}
                                onChange={(e) => setToolNumber(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
                        </div>
                        <div>
                            <label htmlFor="toolDescription" className="block text-sm font-medium text-gray-700">
                                Description:
                            </label>
                            <input
                                type="text"
                                id="toolDescription"
                                name="toolDescription"
                                value={toolDescription}
                                onChange={(e) => setToolDescription(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
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
                            <label htmlFor="conditionId" className="block text-sm font-medium text-gray-700">
                                Condition:
                            </label>
                            <select
                                id="conditionId"
                                name="conditionId"
                                value={conditionId}
                                onChange={(e) => setConditionId(Number(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            >
                                <option value="">Select Condition</option>
                                {conditionTypes.map((condition) => (
                                    <option key={condition.id} value={condition.id}>
                                        {condition.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="statusId" className="block text-sm font-medium text-gray-700">
                                Status:
                            </label>
                            <select
                                id="statusId"
                                name="statusId"
                                value={statusId}
                                onChange={(e) => setStatusId(Number(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            >
                                <option value="">Select Status</option>
                                {statusTypes.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
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
                                onChange={(e) => setProjectId(Number(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            >
                                <option value="">Select Project</option>
                                {projects.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="personnelId" className="block text-sm font-medium text-gray-700">
                                Personnel:
                            </label>
                            <select
                                id="personnelId"
                                name="personnelId"
                                value={personnelId}
                                onChange={(e) => setPersonnelId(Number(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            >
                                <option value="">Select Personnel</option>
                                {personnel.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Save</Button>
                            <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        </div>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditToolForm;
