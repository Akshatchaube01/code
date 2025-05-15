import React from 'react';

type ProjectsByType = {
    "Project Type": { [key: string]: string };
    "Count": { [key: string]: number };
};

type ProjectTypeTableProps = {
    projects_by_type_tb1?: ProjectsByType;
};

const ProjectTypeTable: React.FC<ProjectTypeTableProps> = ({ projects_by_type_tb1 }) => {
    const hasData = projects_by_type_tb1 && Object.keys(projects_by_type_tb1["Project Type"] || {}).length > 0;
    const keys = hasData ? Object.keys(projects_by_type_tb1["Project Type"]) : [];
    
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
                    {hasData ? (
                        keys.map((key) => (
                            <tr key={key} className="border-b border-red-300">
                                <td className="px-6 py-4">{projects_by_type_tb1["Project Type"][key].trim()}</td>
                                <td className="px-6 py-4">{projects_by_type_tb1["Count"][key]}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="px-6 py-4 text-gray-500">No Project Types</td>
                            <td className="px-6 py-4 text-gray-500">No Counts</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectTypeTable;
