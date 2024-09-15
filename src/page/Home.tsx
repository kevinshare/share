import { AspectRatio, Box, Button, Typography } from "@mui/joy";
import Gallery from "../gallery/Gallery";
import shareLogo from '../assets/share-logo.png';
import instaSvg from '../assets/instagram.svg';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Fade, Grow } from "@mui/material";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"


// const list = {
//   visible: { opacity: 1, transitionDelay: '4s', },
//   hidden: { opacity: 0, transitionDuration: '1s', transition: {
//     delay: 1,
//     type: "spring",
//     stiffness: 400,
//     damping: 400
//   }},
// }

// const item = {
//   visible: { opacity: 1, scale: 1, },
//   hidden: { opacity: 0, scale: 0, transitionDuration: 0.8, transition: {
//     delay: 1,
//     type: "spring",
//     stiffness: 400,
//     damping: 400
//   }},
// }


const images = [
  {
    image: '/never-lose-cover.png',
    title: 'Never Lose Me (Share Remix)',
    artist: 'Flo Milli',
    type: 'soundcloud',
    url: 'https://soundcloud.com/kevinshare/flo-milli-never-lose-me-share-remix?si=ceffc9c05bd44e6f8532ac00f0b3b88f&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing'
  },
  {
    image: '/fashion-killa-cover.jpg',
    title: 'Fashion Killa (Share Remix)',
    artist: 'A$AP Rocky',
    type: 'soundcloud',
    url: 'https://soundcloud.com/kevinshare/aap-rocky-fashion-killa-share-remix?si=a99963ffd7954150acb82f3b25c731b9&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing'
  },
  {
    image: '/thousand-miles-cover.jpg',
    title: 'A Thousand Miles (Share Remix)',
    artist: 'Vanessa Carlton',
    type: 'soundcloud',
    url: 'https://soundcloud.com/kevinshare/thousand-miles-share-remix-2?si=d1c49080a79a4c928b7c297464192041&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing'
  },
  {
    image: '/lonely-cover.png',
    title: 'Lonely (Share Remix)',
    artist: 'Justin Bieber',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=6uDHEs2jUAU'
  },
  {
    image: '/freaky-cover.png',
    title: 'Freaky',
    artist: 'Share, AK Renny, Devowr.',
    type: 'spotify',
    url: 'https://open.spotify.com/track/4tAJxr3zZNk0FScBlFJGFU?si=eecc69362d804288'
  }
  
  
  // 'https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  // 'https://images.pexels.com/photos/358574/pexels-photo-358574.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
];

export default () => {
  const location = useLocation();
  // const theme = useTheme();
  // const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Fade in style={{ transitionDuration: '3s'}}>
        <AspectRatio ratio="12/3" sx={{ zIndex: 4, backgroundColor: 'transparent', minWidth: 300, maxWidth:  300, height: 200, mt: 4, transition: 'all smooth 2s' }} variant="plain">
          <img src={shareLogo} style={{ transition: 'all smooth 2.0s' }}/>
        </AspectRatio>
      </Fade>
      <Box sx={{ position: 'absolute', bottom: 80 }}>
        <AnimatePresence>
          {location.pathname === '/' && (
            <motion.div
              initial={{ opacity: 0}}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex'
              }}
            >
              <Grow in={location.pathname === '/'} timeout={1000}>
                <Button
                  onClick={() => window.location.href = 'mailto:contactsharemusic@gmail.com'}
                  size="large"
                  variant="soft"
                  sx={{ zIndex: 5, bgcolor: 'rgba(255,255,255,0.07)', color: '#ffffff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)'}, mx: 1, mt: 1 }}
                >
                  <EmailOutlinedIcon style={{ width: 40, height: 30 }} />
                </Button>
              </Grow>
              <Grow in={location.pathname === '/'} timeout={1000}>
                <Button
                  onClick={() => window.open('https://www.instagram.com/kevin_share/', '_blank')}
                  size="large"
                  variant="soft"
                  sx={{ zIndex: 5, bgcolor: 'rgba(255,255,255,0.07)', color: '#ffffff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)'}, mx: 1, mt: 1 }}
                >
                  <img src={instaSvg} style={{ width: 26, height: 26  }} />
                </Button>
              </Grow>
            </motion.div>)}
          </AnimatePresence>
      </Box>
      <Gallery images={images}/>
      <AnimatePresence>
        {location.pathname === '/' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', bottom: 140, zIndex: 1
            }}
          >
            <Typography sx={{ color: '#EDE7F6', fontFamily: 'Tiny5, sans-serif', fontSize: 24 }}>
              Its cool to be weird
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
      
    </Box>
    
  )
}