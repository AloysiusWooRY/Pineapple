// React / Packages
import React from "react";
import PasswordStrengthBar from 'react-password-strength-bar';

// Components
import { textNerfer } from "./componentUtils";

// Assets
// ~

// API
// ~

export default function CustomPasswordStrengthBar(props) {
    const { title, password, passwordScore, setPasswordScore } = props;

    return (
        <div id={"password-strength-" + textNerfer(title)}>
            <PasswordStrengthBar
                password={password}
                className="-mt-4"
                onChangeScore={(passwordScore, feedback) => { setPasswordScore(passwordScore) }}
                barColors={['#ddd', '#FF0000', '#FFA500', '#00FF00', '#00FFFF']}
                scoreWords={['Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong']}
            />
        </div>
    );
};