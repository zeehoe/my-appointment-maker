import React from 'react';

const MyButton = ({text,onClick,backgroundColor}) => {
    const styles={
        fontSize:"1em",
        textAlign:"center",
        padding:'0.25em 1em',
        background:backgroundColor,
        borderColor:'white',
        color:'white',
        fontWeight:'bold'
    }

    return (
        <button style={styles} onClick={onClick}>
            {text}
        </button>
    );
};

export default MyButton;
