import { FC, useEffect } from "react";
import { snackError } from "./snackbar.ts";
import WarningOutlinedIcon from "@mui/icons-material/WarningOutlined";
import { Typography } from "@mui/material";

export const ErrorBoundary: FC = () => {

    useEffect(() => {
        snackError('An error occurred.');
    }, [])

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '10vh' }}>
            <WarningOutlinedIcon fontSize={'large'} />
            <Typography variant="h6" style={{ marginTop: '1rem' }}>Something Broke.</Typography>
        </div>
    );

}
