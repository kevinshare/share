import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import soundcloudSvg from '../assets/soundcloud.svg';
import spotifySvg from '../assets/spotify.svg';
import youtubeSvg from '../assets/youtube.svg';
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, RoundedBox, Environment, Html } from '@react-three/drei'
import getUuid from 'uuid-by-string'
import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom'
import { AspectRatio, Box, Button, Card, CardContent, CircularProgress, Typography, useTheme } from '@mui/joy'
import { Fade, useMediaQuery } from '@mui/material';

const GOLDENRATIO = 1.61803398875

export interface PropImage {
  image: string;
  title: string;
  artist: string;
  type: string;
  url: string;
}

export default function Gallery({ images }: { images: PropImage[] }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<PropImage | undefined>(undefined);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const tablet = useMediaQuery(theme.breakpoints.down('lg'));

  console.log(selectedItem)

  const handleSetSelectedItem = (image: PropImage) => {
    setSelectedItem(image);
  };

  const getSvgType = (itemType: string) => {
    if (itemType === 'soundcloud') {
      return soundcloudSvg;
    }
    if (itemType === 'spotify') {
      return spotifySvg;
    }
    if (itemType === 'youtube') {
      return youtubeSvg;
    }
  }

  const getBackgroundColor = (itemType: string) => {
    if (itemType === 'soundcloud') {
      return '#f70';;
    }
    if (itemType === 'spotify') {
      return '#00DA5A';
    }
    if (itemType === 'youtube') {
      return '#f00';
    }
  }

  useEffect(() => {
    if (selectedItem !== undefined) {
      setTimeout(() => {
        setShouldAnimate(true);
      }, 1000)
    }
    if (selectedItem === undefined) {
      setShouldAnimate(false);
    }
  }, [selectedItem])
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', position: 'absolute', bottom: 0, left: 0, width: '100vw', overflow: 'hidden', }}>
      <Fade in={shouldAnimate} timeout={1000}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 5, bottom: 60, minWidth: 250, width: '80vw', maxWidth: 320 }}>
          <Card
            color="primary"
            orientation="vertical"
            size="sm"
            style={{
              width: '100%',
              backgroundColor: 'rgba(12,12,12,0.9)',
              display: selectedItem !== undefined ? 'block' : 'none',
              backgroundFilter: 'blur(24px)'
            }}
          >
            <div>
              <Typography sx={{ color: '#ffffff' }} level="title-lg">{selectedItem?.title}</Typography>
              <Typography sx={{ color: '#ffffff' }} level="body-sm">{selectedItem?.artist}</Typography>
            </div>
            <AspectRatio minHeight="120px" maxHeight="250px" variant="basic" sx={{ mt: 2 }}>
              {
                selectedItem !== undefined && (
                  <img
                    style={{
                      objectFit: 'contain'
                    }}
                    src={getSvgType(selectedItem?.type)}
                    loading="lazy"
                    alt=""
                  />
                )
              }
             
            </AspectRatio>
            {
                selectedItem !== undefined && (
              <CardContent orientation="horizontal">
                <div>
                  <Typography sx={{ color: '#ffffff' }} level="body-xs">Play on:</Typography>
                  <Typography sx={{ color: '#ffffff', fontSize: 'lg', fontWeight: 'lg' }}>{selectedItem?.type === 'soundcloud' ? 'Soundcloud' : 'Spotify'}</Typography>
                </div>
                <Button
                  variant="solid"
                  size="lg"
                  aria-label="Explore Bahamas Islands"
                  onClick={() => {
                    window.open(selectedItem?.url, "_blank");
                  }}
                  sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600, background: getBackgroundColor(selectedItem?.type) }}
                >
                  Play
                </Button>
              </CardContent>
            )}
          </Card>
        </Box>
      </Fade>
      <Box sx={{ height: 'calc(100vh - 200px)', width: 'calc(100vw)', overflow: 'hidden' }}>
      <Suspense fallback={
        <Box sx={{ width: '100%', height: '100%', zIndex: 10 }}>
          <CircularProgress />
        </Box>
      }>
        <Canvas dpr={[2, 3.5]} camera={{ fov: 70, position: [0, 0, 100] }}>
          <Suspense fallback={null}>
            <color attach="background" args={['#191920']} />
            <fog attach="fog" args={['#191920', 0, 10]} />
            <Environment preset="city" />
            <group position={[0, -0.5, 0]}>
              <Frames handleSetSelectedItem={handleSetSelectedItem} images={images} navigate={navigate} location={location} mobile={mobile} tablet={tablet} />
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[60, 60]} />
                {/* @ts-ignore */}
                <MeshReflectorMaterial
                  blur={[300, 100]}
                  resolution={2048} // Lower value if too slow on mobile
                  mixBlur={1}
                  mixStrength={60}
                  roughness={0.84}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.5}
                  color='#191920'
                  metalness={0.5}
                />
              </mesh>
            </group>
          </Suspense>
        </Canvas>
      </Suspense>
      </Box>
    </Box>
  )
}

function Frames({ images, location, tablet, mobile, handleSetSelectedItem, navigate, q = new THREE.Quaternion(), p = new THREE.Vector3() } : { images: PropImage[]; [key: string]: any; location: Location; navigate: NavigateFunction}) {
  const ref = useRef(null);
  const [name, setName] = useState('');
  const clicked = useRef(null);

  useEffect(() => {
    {/* @ts-ignore */}
    clicked.current = ref?.current?.getObjectByName(location.pathname.split('/')[2]);
    if (clicked.current) {
      {/* @ts-ignore */}
      clicked.current?.parent?.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      {/* @ts-ignore */}
      clicked.current?.parent?.getWorldQuaternion(q)
    } else {
      let size = 5.5;
      if (tablet && !mobile) {
        size = 8.6
      }
      if (mobile) {
        size = 9.6
      }
      p.set(0, 0, size)
      q.identity()
    }
  })

  useEffect(() => {
    setName(location.pathname.split('/')[2]);
  }, [location])

  useEffect(() => {
    const selectedItem = images.filter(image => name === getUuid(image.image));
    handleSetSelectedItem(selectedItem[0]);
  }, [name]);


  useFrame((state, delta) => {
    state.camera.position.lerp(p, delta * 3)
    state.camera.quaternion.slerp(q, delta * 3)
  })

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        setName(e.object.name);
        if (clicked.current !== e.object && location.pathname.split('/')[2] !== e.object.name) {
          navigate('/');
        }
        if (location.pathname.split('/')[2] === e.object.name) {
          navigate('/');
          setName('');
        }
        navigate(clicked.current === e.object ? '/' : '/song/' + e.object.name)
      }}
      onPointerMissed={() => {}}>
      {/* @ts-ignore */}
      <Frame mobile={mobile} url={images[0].image} imageProps={images[0]} position={[0, 0, 1.25]} name={name} />
      {/* <Frame position={[-0.8, 0, -0.5]} url={images[1]} />
      <Frame position={[0.8, 0, -0.5]} url={images[2]} /> */}
      {/* @ts-ignore */}
      <Frame mobile={mobile} position={[-1.75, 0, 1]} rotation-y={Math.PI / 2.8} url={images[1].image} imageProps={images[1]} name={name} />
      {/* @ts-ignore */}
      <Frame mobile={mobile} position={[-2.2, 0, 2.5]} rotation-y={Math.PI / 2.8} url={images[2].image} imageProps={images[2]} name={name} />
      {/* @ts-ignore */}
      <Frame mobile={mobile} position={[1.75, 0, 1]} rotation-y={-Math.PI / 2.8} url={images[3].image} imageProps={images[3]} name={name} />
      {/* @ts-ignore */}
      <Frame mobile={mobile} position={[2.2, 0, 2.5]} rotation-y={-Math.PI / 2.8} url={images[4].image} imageProps={images[4]} name={name} />
    </group>
  )
}

function Frame({ url, name, mobile, imageProps, showContent, ...props }: { imageProps: PropImage; [key: string]: any}) {
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const image = useRef(null);
  const ref = useRef();
  useCursor(hovered);
  {/* @ts-ignore */}
  useFrame((state) => (image.current.material.zoom = 1 + Math.sin(rnd * 800 + state.clock.elapsedTime / 3) / 4))
  return (
    <group ref={ref} {...props}>
      <RoundedBox
        name={getUuid(url)}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        radius={0.01}
        smoothness={4}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}>
        <meshStandardMaterial color="#151515" metalness={0.4} roughness={0.5} envMapIntensity={3} />
        <mesh raycast={() => null} scale={[0.6, 0.73, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial color="white" toneMapped={false} />
        </mesh>

        {/* @ts-ignore */}
        <Image raycast={() => null} ref={image} scale={[0.99, 0.99, 0.99]} position={[0, 0, 1]} url={url} />
      </RoundedBox>
      
    </group>
  )
}
