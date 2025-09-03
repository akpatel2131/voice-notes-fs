import clsx from "clsx";
import styles from "./button.module.css";
import React from "react"


export default function Button ({children, onClick, disabled, variant="primary"}) {
    return (
        <button className={clsx(styles.button, styles[variant])} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}