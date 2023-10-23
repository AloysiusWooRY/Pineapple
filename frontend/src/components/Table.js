// React / Packages
import React from "react";

// Components
// ~

// Assets
// ~

// API
// ~

export default function Table(props) {
    const { title, rows, onClick = null } = props;

    return (
        <div>
            <table id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="w-full h-fit text-left text-text-primary">
                <thead className="text-text-primary uppercase">
                    <tr>
                        {rows && Object.keys(rows[0]).map((key) => (
                            <th scope="col" className="px-6 py-2 font-semibold bg-background-blue">
                                {key}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows && rows.map((row, i) => (
                        <tr
                            id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + "-" + i}
                            data-index={i}
                            className={`bg-background-minor ${onClick ? "cursor-pointer" : ""}`}
                            onClick={onClick}>
                            {Object.values(row).map((value) => (
                                <td className="w-1/3 px-6 py-2 font-medium text-text-primary">
                                    {value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
