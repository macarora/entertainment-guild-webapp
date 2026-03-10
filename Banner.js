
import {Box} from '@mui/material';
import BannerData from '../Data/BannerData';
// This component displays a promotional banner.
const Banner = () => (
    <Box
        component="img"
        src={BannerData[0].image}
        sx={{
            borderRadius: '8px',
            width: '100%',
            height: '500px',
            objectFit: 'cover',
            maxWidth: '100%',
            mb: 5,
        }}
    />
);

export default Banner;
