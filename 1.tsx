"use client";

import React, { useEffect, useState } from "react";
import "react-tabulator/lib/css/tabulator.min.css";
import "tabulator-tables/dist/css/tabulator_bootstrap4.min.css"; // Bootstrap theme
import { ReactTabulator, ReactTabulatorOptions, ColumnDefinition } from "react-tabulator";

interface TableComponentProps {
    data: any[];
    title: string;
}

const TableComponent: React.FC<TableComponentProps> = ({ data, title }) => {
    const columns: ColumnDefinition[] = [
        { title: "Quarter", field: "quarter", width: 150 },
        { title: "Model Cyclicality", field: "model", width: 250 },
        { title: "Final Cyclicality", field: "final", width: 250 }
    ];

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return <div>Loading table...</div>;

    const options: ReactTabulatorOptions = {
        height: 350,
        movableRows: true,
        movableColumns: true,
        layout: "fitColumns",
        resizableColumns: true,
    };

    return (
        <div className="rounded-lg shadow-md overflow-hidden p-2">
            <h2 className="text-lg font-semibold text-center mb-2">{title}</h2>
            <ReactTabulator
                data={data}
                columns={columns}
                options={options}
                layout="fitDataStretch"
                className="rounded-lg hover:shadow-lg transition-shadow"
            />
        </div>
    );
};

export default TableComponent;
