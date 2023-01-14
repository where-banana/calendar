import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function NoPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography variant={'h5'} color={'red'}>
                Oops!.. No page found
            </Typography>
            <Typography variant={'h5'}>
                <Link to={'/'}>Go to main page</Link>
            </Typography>
        </Box>
    );
}

export default NoPage;
