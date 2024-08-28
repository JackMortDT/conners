import React from "react";

const Header = ({ fields }) => {
    return (
        <thead>
            <tr>
                <th>#</th>
                {fields.map((field) => (
                    <th key={field}>{field}</th>
                ))}
                <th>Respuestas</th>
            </tr>
        </thead>
    );
};

export default Header;