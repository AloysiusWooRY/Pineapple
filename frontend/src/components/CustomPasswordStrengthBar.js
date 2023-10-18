// React / Packages
import React from "react";
import PasswordStrengthBar from 'react-password-strength-bar';

// Components
// ~

// Assets
// ~

// API
// ~

export default function CustomPasswordStrengthBar(props) {
    const { password, passwordScore, setPasswordScore } = props;

    return (
        <>
            <PasswordStrengthBar
                password={password}
                className="-mt-4"
                onChangeScore={(passwordScore, feedback) => { setPasswordScore(passwordScore) }}
                barColors={['#ddd', '#FF0000', '#FFA500', '#00FF00', '#00FFFF']}
                scoreWords={['Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong']}
            />
        </>
    );
};