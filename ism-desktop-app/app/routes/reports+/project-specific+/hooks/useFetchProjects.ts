import { useSubmit } from "@remix-run/react";
import { useState, useEffect } from "react";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { PaginationModel } from "~/data/models/generic/PaginationModel";

interface LoaderData {
    projects: {
        status: string;
        message: string;
        data: {
            list: ProjectModel[];
            pagination: PaginationModel;
        };
    };
}

const useFetchProjects = (loaderData: LoaderData) => {
    const [totalPages, setTotalPages] = useState<number>(Math.ceil(loaderData.projects.data.pagination.totalItems / loaderData.projects.data.pagination.pageSize));
    const [projects, setProjects] = useState<ProjectModel[]>(Array.isArray(loaderData.projects.data.list) ? loaderData.projects.data.list : []);
    const [pagination, setPagination] = useState<PaginationModel>(loaderData.projects.data.pagination);
    const submit = useSubmit();

    const setProjectData = (data: ProjectModel[], pagination: PaginationModel) => {
        setProjects(Array.isArray(data) ? data : []);
        setPagination(pagination);
        setTotalPages(Math.ceil(pagination.totalItems / pagination.pageSize));
    };

    const fetchProjects = async (page: number, limit: number): Promise<void> => {
        const params = new URLSearchParams({ 
            page: page.toString(), 
            limit: "6", 
        });

        submit(params, { method: "get" });
    };

    const setData = (data: { list: ProjectModel[], pagination: PaginationModel }) => {
        setProjectData(data.list, data.pagination);
    };

    useEffect(() => {
        if (loaderData.projects.data) {
            setData({
                list: loaderData.projects.data.list,
                pagination: loaderData.projects.data.pagination
            });
        }
    }, [loaderData.projects.data]);

    return { projects, pagination, totalPages, fetchProjects, setPagination };
};

export default useFetchProjects;
