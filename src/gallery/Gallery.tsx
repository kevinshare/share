import * as THREE from 'three'
import { Suspense, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import soundcloudSvg from '../assets/soundcloud.svg'
import spotifySvg from '../assets/spotify.svg'
import youtubeSvg from '../assets/youtube.svg'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, RoundedBox, Environment, AdaptiveDpr, PerformanceMonitor, useTexture } from '@react-three/drei'
import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom'
import { Box, Button, Card, CardContent, CircularProgress, Fade, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { keyframes } from '@emotion/react'
import { Home } from '@mui/icons-material'
import { PlatformType, Song, getSongPath, isMultiPlatform } from '../data/songs'

const GOLDENRATIO = 1.61803398875

const PLANE_ARGS: [number, number] = [60, 60]
const FLOOR_ROTATION: [number, number, number] = [-Math.PI / 2, 0, 0]
const FLOOR_POSITION: [number, number, number] = [0, 0, 0]
const FRAME_IMAGE_PADDING = 0.92
const FRAME_DEPTH_OFFSET = 0.031
const BACKGROUND_KEY_THRESHOLD = 16
const BACKGROUND_KEY_SOFTNESS = 40

const getSelectedSlug = (pathname: string) => {
  const segments = pathname.replace(/\/+$/, '').split('/').filter(Boolean)

  if (segments[0] !== 'song') {
    return undefined
  }

  return segments[1]
}

const goldGlow = keyframes`
  0% {
    box-shadow:
      0 0 8px rgba(255, 215, 0, 0.6),
      0 0 16px rgba(255, 215, 0, 0.4),
      0 0 24px rgba(255, 165, 0, 0.3),
      0 0 32px rgba(255, 215, 0, 0.2);
    border-color: rgba(255, 215, 0, 0.8);
  }
  50% {
    box-shadow:
      0 0 12px rgba(255, 215, 0, 0.8),
      0 0 24px rgba(255, 215, 0, 0.5),
      0 0 36px rgba(255, 165, 0, 0.4),
      0 0 48px rgba(255, 215, 0, 0.25);
    border-color: rgba(255, 200, 50, 0.9);
  }
  100% {
    box-shadow:
      0 0 8px rgba(255, 215, 0, 0.6),
      0 0 16px rgba(255, 215, 0, 0.4),
      0 0 24px rgba(255, 165, 0, 0.3),
      0 0 32px rgba(255, 215, 0, 0.2);
    border-color: rgba(255, 215, 0, 0.8);
  }
`

interface FramesProps {
  images: Song[]
  location: Location
  navigate: NavigateFunction
  mobile: boolean
  tablet: boolean
  handleSetSelectedItem: (image: Song | undefined) => void
}

interface FrameProps {
  song: Song
  selectedSlug?: string
  position?: [number, number, number]
  'rotation-y'?: number
}

type TextureImage = CanvasImageSource & { width?: number; height?: number }

function createTransparentTexture(texture: THREE.Texture) {
  const image = texture.image as TextureImage | undefined
  const imageWidth = image?.width ?? 0
  const imageHeight = image?.height ?? 0

  if (typeof document === 'undefined' || !image || !imageWidth || !imageHeight) {
    return texture
  }

  const canvas = document.createElement('canvas')
  canvas.width = imageWidth
  canvas.height = imageHeight

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) {
    return texture
  }

  context.drawImage(image, 0, 0, imageWidth, imageHeight)
  const imageData = context.getImageData(0, 0, imageWidth, imageHeight)

  for (let index = 0; index < imageData.data.length; index += 4) {
    const red = imageData.data[index]
    const green = imageData.data[index + 1]
    const blue = imageData.data[index + 2]
    const brightness = Math.max(red, green, blue)
    const alpha = THREE.MathUtils.clamp((brightness - BACKGROUND_KEY_THRESHOLD) / BACKGROUND_KEY_SOFTNESS, 0, 1)

    imageData.data[index + 3] = Math.round(imageData.data[index + 3] * alpha)
  }

  context.putImageData(imageData, 0, 0)

  const transparentTexture = new THREE.CanvasTexture(canvas)
  transparentTexture.colorSpace = texture.colorSpace
  transparentTexture.wrapS = texture.wrapS
  transparentTexture.wrapT = texture.wrapT
  transparentTexture.minFilter = texture.minFilter
  transparentTexture.magFilter = texture.magFilter
  transparentTexture.generateMipmaps = texture.generateMipmaps
  transparentTexture.anisotropy = texture.anisotropy
  transparentTexture.needsUpdate = true

  return transparentTexture
}

export default function Gallery({ images }: { images: Song[] }) {
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState<Song | undefined>(undefined)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const tablet = useMediaQuery(theme.breakpoints.down('lg'))
  const reflectorResolution = mobile ? 512 : 1024

  const handleSetSelectedItem = useCallback((image: Song | undefined) => {
    setSelectedItem(image)
  }, [])

  const getSvgType = (itemType: PlatformType) => {
    if (itemType === 'Soundcloud') {
      return soundcloudSvg
    }
    if (itemType === 'Spotify') {
      return spotifySvg
    }
    if (itemType === 'Youtube') {
      return youtubeSvg
    }
    if (isMultiPlatform(itemType)) {
      return [spotifySvg, soundcloudSvg, youtubeSvg]
    }
  }

  const getAllPlatformSvgs = () => {
    return [spotifySvg, soundcloudSvg, youtubeSvg]
  }

  const getBackgroundColor = (itemType: PlatformType) => {
    if (itemType === 'Soundcloud') {
      return '#f70'
    }
    if (itemType === 'Spotify') {
      return '#00DA5A'
    }
    if (itemType === 'Youtube') {
      return '#f00'
    }
    if (isMultiPlatform(itemType)) {
      return '#eaaf00'
    }
    return '#eaaf00'
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    if (selectedItem !== undefined) {
      timer = setTimeout(() => {
        setShouldAnimate(true)
      }, 1000)
    } else {
      setShouldAnimate(false)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [selectedItem])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', position: 'absolute', bottom: 0, left: 0, width: '100vw', alignItems: 'center' }}>

      <Fade in={shouldAnimate} timeout={1000} style={{ height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            zIndex: 5,
            minWidth: 250,
            width: '80vw',
            maxWidth: mobile ? 320 : 340,
            height: '100%',
            top: 0,
          }}
        >
          <Card
            sx={{
              height: 'calc(100% - 48px)',
              width: '100%',
              maxHeight: mobile ? 'calc(100dvh - 260px)' : 480,
              backgroundColor: 'rgba(12,12,12,0.8)',
              display: selectedItem !== undefined ? 'flex' : 'none',
              flexDirection: 'column',
              alignItems: 'center',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              p: 2,
              ...(selectedItem && isMultiPlatform(selectedItem.type) && {
                border: '2px solid rgba(255, 215, 0, 0.8)',
                animation: `${goldGlow} 2.5s ease-in-out infinite`,
              }),
              ...(selectedItem && !isMultiPlatform(selectedItem.type) && {
                border: 'none',
              }),
            }}
          >
            <div>
              <Typography sx={{ color: '#ffffff', fontSize: '24px', fontWeight: 600, whiteSpace: 'pre-line' }} variant="h6">{selectedItem?.title}</Typography>
              <Typography sx={{ color: '#ffffff' }} variant="body2">{selectedItem?.artist}</Typography>
            </div>
            <div style={{ flex: 1 }} />
            <Box sx={{ mt: mobile ? 2 : 6, aspectRatio: '16/9', minHeight: mobile ? '80px' : '120px', maxHeight: mobile ? '100px' : '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {
                selectedItem !== undefined && isMultiPlatform(selectedItem.type) ? (
                  <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {getAllPlatformSvgs().map((svg, index) => (
                      <img
                        key={index}
                        style={{
                          position: 'absolute',
                          objectFit: 'contain',
                          width: '55%',
                          height: '55%',
                          transform: `translate(${index * 50 - 50}px, ${index * 25 - 25}px)`,
                          zIndex: 3 - index,
                          opacity: index === 0 ? 1 : 0.7,
                          filter: index > 0 ? 'brightness(0.6)' : 'none'
                        }}
                        src={svg}
                        loading="lazy"
                        alt=""
                      />
                    ))}
                  </Box>
                ) : selectedItem !== undefined && (
                  <img
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%'
                    }}
                    src={getSvgType(selectedItem.type) as string}
                    loading="lazy"
                    alt=""
                  />
                )
              }
            </Box>
            <div style={{ flex: 1 }} />
            {selectedItem !== undefined && (
              isMultiPlatform(selectedItem.type) ? (
                <>
                  <div style={{ textAlign: 'center', marginBottom: mobile ? 8 : 16 }}>
                    <Typography sx={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 700 }}>
                      {selectedItem.type === 'Pre-save' ? 'Pre-save on all platforms' : 'Listen on all platforms'}
                    </Typography>
                  </div>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      size="small"
                      aria-label="Go Back"
                      onClick={() => {
                        navigate('/')
                      }}
                      sx={{ zIndex: 5, bgcolor: 'rgba(255,255,255,0.07)', color: '#ffffff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)'}, boxShadow: 'none' }}
                    >
                      <Home />
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      aria-label="Play Song"
                      onClick={() => {
                        window.open(selectedItem.url, "_blank")
                      }}
                      sx={{
                        fontWeight: 600,
                        background: getBackgroundColor(selectedItem.type),
                        '&:hover': { background: getBackgroundColor(selectedItem.type) },
                        minWidth: 'fit-content',
                        color: isMultiPlatform(selectedItem.type) ? '#000000' : '#ffffff',
                        boxShadow: 'none',
                        textTransform: 'none',
                      }}
                    >
                      {selectedItem.type === 'Pre-save' ? 'Pre-save' : 'Play'}
                    </Button>
                  </Box>
                </>
              ) : (
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, p: 0, '&:last-child': { pb: 0 }, width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Typography sx={{ color: '#ffffff' }} variant="caption">{'Play on:'}</Typography>
                    <Typography sx={{ color: '#ffffff', fontSize: '1.125rem', fontWeight: 700 }}>{selectedItem.type}</Typography>
                  </div>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      size="small"
                      aria-label="Go Back"
                      onClick={() => {
                        navigate('/')
                      }}
                      sx={{ zIndex: 5, bgcolor: 'rgba(255,255,255,0.07)', color: '#ffffff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)'}, boxShadow: 'none' }}
                    >
                      <Home />
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      aria-label="Play Song"
                      onClick={() => {
                        window.open(selectedItem.url, "_blank")
                      }}
                      sx={{ fontWeight: 600, background: getBackgroundColor(selectedItem.type), '&:hover': { background: getBackgroundColor(selectedItem.type) }, boxShadow: 'none', textTransform: 'none' }}
                    >
                      Play
                    </Button>
                  </Box>
                </CardContent>
              )
            )}
          </Card>
        </Box>
      </Fade>
      <Box sx={{ height: 'calc(100dvh - 200px)', width: 'calc(100vw)', overflow: 'hidden' }}>
        <Suspense fallback={
          <Box sx={{ width: '100%', height: '100%', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        }>
          <Canvas dpr={[1, 2]} gl={{ alpha: true }} camera={{ fov: mobile ? 78 : 65, position: [0, 0, 100] }}>
            <Suspense fallback={null}>
              <fog attach="fog" args={['#050510', 0, 10]} />
              <Environment preset="city" />
              <group position={[0, -0.5, 0]}>
                <Frames handleSetSelectedItem={handleSetSelectedItem} images={images} navigate={navigate} location={location} mobile={mobile} tablet={tablet} />
                <mesh rotation={FLOOR_ROTATION} position={FLOOR_POSITION}>
                  <planeGeometry args={PLANE_ARGS} />
                  <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={reflectorResolution}
                    mixBlur={1}
                    mixStrength={60}
                    roughness={0.84}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.5}
                    color='#050510'
                    metalness={0.5}
                  />
                </mesh>
              </group>
              <AdaptiveDpr pixelated />
              <PerformanceMonitor />
            </Suspense>
          </Canvas>
        </Suspense>
      </Box>
    </Box>
  )
}

function Frames({ images, location, tablet, mobile, handleSetSelectedItem, navigate }: FramesProps) {
  const ref = useRef<THREE.Group>(null)
  const [name, setName] = useState<string | undefined>(undefined)
  const clicked = useRef<THREE.Object3D | null>(null)
  const q = useMemo(() => new THREE.Quaternion(), [])
  const p = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const selectedSlug = getSelectedSlug(location.pathname)

    if (ref.current) {
      clicked.current = selectedSlug ? ref.current.getObjectByName(selectedSlug) ?? null : null
    }
    if (clicked.current?.parent) {
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      let size = 5.5
      if (tablet && !mobile) {
        size = 8.6
      }
      if (mobile) {
        size = 7.8
      }
      p.set(0, 0, size)
      q.identity()
    }
  })

  useEffect(() => {
    setName(getSelectedSlug(location.pathname))
  }, [location.pathname])

  useEffect(() => {
    const selectedItem = images.find((image) => name === image.slug)
    handleSetSelectedItem(selectedItem)
  }, [name, images, handleSetSelectedItem])


  useFrame((state, delta) => {
    const factor = 1 - Math.pow(0.001, delta)
    state.camera.position.lerp(p, factor)
    state.camera.quaternion.slerp(q, factor)
  })

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        const clickedName = e.object.name
        const clickedSong = images.find((image) => image.slug === clickedName)
        const currentName = getSelectedSlug(location.pathname)
        if (currentName === clickedName) {
          navigate('/')
          setName(undefined)
        } else if (clickedSong) {
          navigate(getSongPath(clickedSong))
          setName(clickedName)
        }
      }}
      onPointerMissed={() => {}}>
      <Frame song={images[0]} position={[0, 0, 1.25]} selectedSlug={name} />
      <Frame song={images[1]} position={[-1.75, 0, 1]} rotation-y={Math.PI / 2.8} selectedSlug={name} />
      <Frame song={images[2]} position={[-2.2, 0, 2.5]} rotation-y={Math.PI / 2.8} selectedSlug={name} />
      <Frame song={images[3]} position={[1.75, 0, 1]} rotation-y={-Math.PI / 2.8} selectedSlug={name} />
      <Frame song={images[4]} position={[2.2, 0, 2.5]} rotation-y={-Math.PI / 2.8} selectedSlug={name} />
    </group>
  )
}

function Frame({ song, selectedSlug, ...props }: FrameProps) {
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const image = useRef<THREE.Mesh>(null)
  const ref = useRef<THREE.Group>(null)
  const isSelected = selectedSlug === song.slug
  useCursor(hovered)

  useFrame((state, delta) => {
    if (image.current) {
      const mat = image.current.material as THREE.ShaderMaterial & { zoom: number }
      mat.zoom = 1 + Math.sin(rnd * 800 + state.clock.elapsedTime / 3) / 4
    }
    // Smoothly transition opacity when selected
    if (ref.current) {
      const targetOpacity = isSelected ? 0.3 : 1
      const factor = 1 - Math.pow(0.001, delta)
      ref.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, factor)
          mat.transparent = true
        }
        mesh.children?.forEach((subChild) => {
          const subMesh = subChild as THREE.Mesh
          if (subMesh.material) {
            const subMat = subMesh.material as THREE.MeshStandardMaterial
            subMat.opacity = THREE.MathUtils.lerp(subMat.opacity, targetOpacity, factor)
            subMat.transparent = true
          }
        })
      })
    }
  })
  return (
    <group ref={ref} {...props}>
      <RoundedBox
        name={song.slug}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        radius={0.05}
        smoothness={4}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}>
        <meshStandardMaterial color="#151515" metalness={0.8} roughness={0.2} envMapIntensity={20} transparent opacity={0} />

      </RoundedBox>
      <FrameImage ref={image} url={song.image} />

    </group>
  )
}

const FrameImage = forwardRef<THREE.Mesh, { url: string }>(function FrameImage({ url }, ref) {
  const texture = useTexture(url)
  const transparentTexture = useMemo(() => createTransparentTexture(texture), [texture])

  useEffect(() => {
    if (transparentTexture === texture) {
      return
    }

    return () => {
      transparentTexture.dispose()
    }
  }, [texture, transparentTexture])

  const scale = useMemo<[number, number]>(() => {
    const image = texture.image as { width?: number; height?: number } | undefined
    const imageWidth = image?.width ?? 1
    const imageHeight = image?.height ?? 1
    const imageAspectRatio = imageWidth / imageHeight || 1
    const maxWidth = FRAME_IMAGE_PADDING
    const maxHeight = GOLDENRATIO * FRAME_IMAGE_PADDING
    const frameAspectRatio = maxWidth / maxHeight

    if (imageAspectRatio >= frameAspectRatio) {
      return [maxWidth, maxWidth / imageAspectRatio]
    }

    return [maxHeight * imageAspectRatio, maxHeight]
  }, [texture])

  return (
    <Image
      raycast={() => null}
      ref={ref}
      texture={transparentTexture}
      scale={scale}
      radius={0.04}
      transparent
      position={[0, GOLDENRATIO / 2, FRAME_DEPTH_OFFSET]}
    />
  )
})
