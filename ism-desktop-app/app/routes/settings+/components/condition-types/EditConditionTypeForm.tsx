import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form, useNavigate, useSubmit } from "@remix-run/react";
import { ConditionTypeModel } from "~/data/models/condition-type/ConditionTypeModel";

interface EditConditionTypeFormProps {
    isOpen: boolean;
    onClose: () => void;
    item: ConditionTypeModel | null;
}

const EditConditionTypeForm: React.FC<EditConditionTypeFormProps> = ({ isOpen, onClose, item }) => {
    const submit = useSubmit();
    const [name, setName] = useState(item?.name || "");

    const handleEditSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (item) {
            const formData = new FormData();
            formData.append("id", item.id.toString());
            formData.append("name", name);

            submit(formData, { method: "post", action: "/settings/condition-types/update" });
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
                        Edit Condition Type
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <Form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name:
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-black shadow-sm text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            >
                                Update
                            </button>
                        </div>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditConditionTypeForm;
