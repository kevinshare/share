import { useCallback, useEffect, useState } from "react";
import { Box, Button, Fade, Grow, Typography, useMediaQuery, useTheme } from "@mui/material";
import Gallery from "../gallery/Gallery";
import shareLogo from '../assets/share-logo.png';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { snackSuccess } from "../snackbar";
import { SnackbarProvider } from "notistack";
import StarBackground from "../components/StarBackground";
import { getRootPageMetadata, getSongPageMetadata, songs } from "../data/songs";
import { syncPageMetadata } from "../lib/syncPageMetadata";

export default function Home() {
  const location = useLocation();
  const { slug } = useParams();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loadPage, setLoadPage] = useState(sessionStorage.getItem('share:visitor') === 'true');
  // @ts-ignore
  const [hideTheMessage, setHideTheMessage] = useState(false);
  const [hidePointer, setHidePointer] = useState(false);

  const handleClick = useCallback(() => {
    setHideTheMessage(true);
  }, []);

  // Hide pointer when navigating away from home (i.e., when a gallery item is clicked)
  useEffect(() => {
    if (location.pathname !== '/') {
      setHidePointer(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const selectedSong = slug ? songs.find((song) => song.slug === slug) : undefined;
    const metadata = selectedSong ? getSongPageMetadata(selectedSong) : getRootPageMetadata();

    syncPageMetadata(metadata);
  }, [slug]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadPage(true);
      sessionStorage.setItem('share:visitor', 'true');
      window.addEventListener("click", handleClick);
    }, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
        {loadPage && <StarBackground />}
        <Fade in={loadPage} style={{ transitionDuration: '3s', zIndex: 10, position: 'relative' }}>
          <Box sx={{ backgroundColor: 'transparent', minWidth: 260, maxWidth: 260, height: 160, mt: 0, transition: 'all smooth 2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={shareLogo} style={{ transition: 'all smooth 2.0s', width: '100%', height: '100%', objectFit: 'cover' }}/>
          </Box>
        </Fade>
        {!loadPage && (
          mobile ? (
            <Typography
              className="anim-typewriter-mobile"
              sx={{
                width: '100%',
                zIndex: 8,
                color: 'white',
                fontFamily: 'Tiny5, sans-serif',
                margin: '0 auto',
                borderRight: '2px solid rgba(255,255,255,.75)',
                fontSize: '1.2em',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                transform: 'translateY(-50%)',
                maxWidth: '280px',
              }}
            >
              {'Hi thank you for stopping by ily :)'}
            </Typography>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 1.3 } }}
                style={{
                  position: 'relative',
                  top: '30%',
                }}
              >
                <Typography
                  className="anim-typewriter-desktop"
                  sx={{
                    width: '100%',
                    zIndex: 8,
                    color: 'white',
                    fontFamily: 'Tiny5, sans-serif',
                    margin: '0 auto',
                    borderRight: '2px solid rgba(255,255,255,.75)',
                    fontSize: '1.6em',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    transform: 'translateY(-50%)',
                    maxWidth: '380px',
                  }}
                >
                  {'Hi thank you for stopping by ily :)'}
                </Typography>
              </motion.div>
            </AnimatePresence>
          )
        )}
        {loadPage && (
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
                      onClick={async () => {
                        await navigator.clipboard.writeText('contactsharemusic@gmail.com');
                        window.location.href = 'mailto:contactsharemusic@gmail.com';
                        snackSuccess('Email copied :)')
                      }}
                      size="large"
                      variant="contained"
                      sx={{ zIndex: 5, bgcolor: 'rgba(255,255,255,0.07)', color: '#ffffff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)'}, mx: 1, mt: 1, boxShadow: 'none' }}
                    >
                      <EmailOutlinedIcon style={{ width: 40, height: 30 }} />
                    </Button>
                  </Grow>
                </motion.div>)}
              </AnimatePresence>
          </Box>
        )}

          <Fade in={loadPage} timeout={5000}>
            <div onClick={() => setHidePointer(true)}>
              <Gallery images={songs}/>
            </div>
          </Fade>

        {loadPage && (
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
        )}
        {/* <Fade in={loadPage && !hideTheMessage && location.pathname === '/'} timeout={{ enter: theme.transitions.duration.enteringScreen + 1200, exit: theme.transitions.duration.leavingScreen + 800 }} style={{ zIndex: 10, position: 'absolute', top: 180 }}>
          <Box sx={{ p: 1, px: 2, borderRadius: 6 }}>
            <Typography variant="caption" sx={{ fontFamily: 'Tiny5', }}>
              Click the gallery to explore 👀
            </Typography>
          </Box>
        </Fade> */}

        {/* Animated pointer for presave */}
        {loadPage && !hidePointer && location.pathname === '/' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{
              position: 'absolute',
              top: mobile ? '36%' : '32%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography sx={{
              color: '#EDE7F6',
              fontFamily: 'Tiny5, sans-serif',
                fontSize: mobile ? 16 : 18,
                textAlign: 'center',
                mb: 0.5,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)'
              }}>
                New Release ✨
              </Typography>
              <motion.div
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <KeyboardArrowDownIcon sx={{
                  color: '#EDE7F6',
                  fontSize: mobile ? 36 : 42,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
                }} />
              </motion.div>
            </motion.div>
          )}
      </Box>
    </SnackbarProvider>
  )
}
