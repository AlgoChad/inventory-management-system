import React from "react";
import { StyleSheet, Text } from "react-native";
import { Button } from '~/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog';
import ProjectList from "@/components/home/ProjectList";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";

interface ProjectsModalProps {
    groupedTools: { [key: string]: CheckinModel[] };
}

const ProjectsModal: React.FC<ProjectsModalProps> = ({ groupedTools }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Text>Projects</Text>
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Projects</DialogTitle>
                    <DialogDescription>
                        View the tools assigned to projects.
                    </DialogDescription>
                </DialogHeader>
                <ProjectList groupedTools={groupedTools} />
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

export default ProjectsModal;
