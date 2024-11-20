import React from "react";
import { StyleSheet, Text } from "react-native";
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import WarehouseList from "~/components/home/WarehouseList";
import { ToolModel } from "@/data/models/tool/ToolModel";

interface WarehouseModalProps {
    tools: ToolModel[];
    totalTools: number;
}

const WarehouseModal: React.FC<WarehouseModalProps> = ({ tools, totalTools }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Text>Warehouse</Text>
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Warehouse</DialogTitle>
                    <DialogDescription>
                        View the tools available in the warehouse.
                    </DialogDescription>
                </DialogHeader>
                <WarehouseList tools={tools} totalTools={totalTools} />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>
                            <Text>Close</Text>
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#FFC107",
    },
});

export default WarehouseModal;
