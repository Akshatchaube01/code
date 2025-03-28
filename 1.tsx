"use client";

import React, { useEffect, useState } from "react";
import 'react-tabulator/lib/css/tabulator.min.css';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css'; // Use Bootstrap theme
import { ReactTabulator, ReactTabulatorOptions, ColumnDefinition } from "react-tabulator";

interface TableComponentProps {
    data: any[];
}

const TableComponent: React.FC<TableComponentProps> = ({ data }) => {
    const columns: ColumnDefinition[] = [
        { title: "Quarter", field: "quarter", width: 150 },
        { title: "Model Cyclicality Long Run", field: "Model Cyclicality Long Run", width: 250 },
        { title: "Final Cyclicality Long Run", field: "Final Cyclicality Long Run", width: 250 }
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
        <div className="rounded-lg shadow-md overflow-hidden">
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
