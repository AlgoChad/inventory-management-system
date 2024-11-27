import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { ToolRepairRequest } from "~/data/models/tool/ToolModel";
import { Button } from "~/components/ui/button";

interface ToolRepairRequestDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: ToolRepairRequest | null;
}

const ToolRepairRequestDetailModal: React.FC<ToolRepairRequestDetailModalProps> = ({ isOpen, onClose, request }) => {
    if (!request) return null;

    return (
        <Dialog
            modal
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Tool Repair Request Details
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    <div>
                        <strong>Tool Name:</strong> {request.tool.toolName}
                    </div>
                    <div>
                        <strong>Description:</strong> {request.description}
                    </div>
                    <div>
                        <strong>Requested By:</strong> {request.personnel.name}
                    </div>
                    <div>
                        <strong>Quantity:</strong> {request.quantity}
                    </div>
                    <div>
                        <strong>Status:</strong> {request.status}
                    </div>
                    <div>
                        <strong>Images:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {request.images.map((image) => (
                                <img key={image.id} src={`data:image/jpeg;base64,${image.base64}`} alt={image.name} className="w-24 h-24 object-cover rounded-md" />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ToolRepairRequestDetailModal;
