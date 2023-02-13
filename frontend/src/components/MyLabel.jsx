import React from 'react';

const MyLabel = ({text}) => {
    const styles={
        fontSize:"1em",
        textAlign:"center",
    }

    return (
        <label style={styles}>
            {text}
        </label>
    );
};

export default MyLabel;
