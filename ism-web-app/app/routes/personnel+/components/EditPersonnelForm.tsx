import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form, useFetcher } from "@remix-run/react";
import { PersonnelModel } from "~/data/models/personnel/PersonnelModel";
import { Button } from "~/components/ui/button";

interface EditPersonnelFormProps {
    isOpen: boolean;
    onClose: () => void;
    item: PersonnelModel | null;
}

const EditPersonnelForm: React.FC<EditPersonnelFormProps> = ({ isOpen, onClose, item }) => {
    const fetcher = useFetcher();
    const [name, setName] = useState(item?.name || "");

    useEffect(() => {
        if (item) {
            setName(item.name);
        }
    }, [item]);

    const handleEditSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (item) {
            fetcher.submit({ id: item.id, name }, { method: "post", action: "/personnel/update" });
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
                        Edit Personnel
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
                            <Button
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

export default EditPersonnelForm;
