import { Box } from '@mui/material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractiveVest from '../components/InteractiveVest';

gsap.registerPlugin(ScrollTrigger);

const Novedades = () => {

    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <InteractiveVest />
        </Box>
    );
};

export default Novedades;
