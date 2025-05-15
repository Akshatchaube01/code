import React from 'react';

type ProjectsByType = {
    projects_by_type_tb1: {
        "Project Type": { [key: string]: string };
        "Count": { [key: string]: number };
    };
};

type ProjectTypeTableProps = {
    data: ProjectsByType;
};

const ProjectTypeTable: React.FC<ProjectTypeTableProps> = ({ data }) => {
    const projectData = data.projects_by_type_tb1;
    const keys = Object.keys(projectData["Project Type"]);
    
    return (
        <div className="overflow-x-auto rounded-xl shadow-sm border-2 border-red-600 w-full">
            <table className="min-w-full table-auto">
                <thead className="bg-red-600 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left font-semibold">Project Type</th>
                        <th className="px-6 py-3 text-left font-semibold">Count</th>
                    </tr>
                </thead>
                <tbody className="bg-white text-black">
                    {keys.map((key) => (
                        <tr key={key} className="border-b border-red-300">
                            <td className="px-6 py-4">{projectData["Project Type"][key].trim()}</td>
                            <td className="px-6 py-4">{projectData["Count"][key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectTypeTable;
