import React from 'react';

export default function Table(props) {
    const { title, rows, onClick = null } = props;

    return (
        <div>
            <table id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="w-full h-fit text-left text-white bg-theme-primary">
                <thead className="text-white uppercase">
                    <tr>
                        {rows && Object.keys(rows[0]).map((key) => (
                            <th scope="col" className="px-6 py-2 font-semibold bg-[#0f172A]">
                                {key}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows && rows.map((row, i) => (
                        <tr id={title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + "-" + i}
                            className={onClick ? "cursor-pointer" : ""} onClick={onClick}>
                            {Object.values(row).map((value) => (
                                <td className="w-1/3 px-6 py-2 font-medium text-neutral-100">
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