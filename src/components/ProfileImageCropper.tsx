import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Slider,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import CropIcon from '@mui/icons-material/Crop';
import CloseIcon from '@mui/icons-material/Close';

interface ProfileImageCropperProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

/**
 * Crea un canvas con la imagen recortada y la devuelve como un File
 */
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number = 0
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  const radians = (rotation * Math.PI) / 180;

  // Calcular las dimensiones del bounding box después de la rotación
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const bBoxWidth = image.width * cos + image.height * sin;
  const bBoxHeight = image.width * sin + image.height * cos;

  // Setear el canvas temporal para la rotación
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(radians);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // Extraer el área recortada
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) throw new Error('No 2d context');

  // Tamaño final del crop
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convertir a blob y luego a File
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const file = new File([blob], 'profile-photo.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        resolve(file);
      },
      'image/jpeg',
      0.92
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

export default function ProfileImageCropper({
  open,
  imageSrc,
  onClose,
  onCropComplete,
}: ProfileImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropChange = useCallback((location: Point) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropCompleteHandler = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropComplete(croppedFile);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: '#1a1a2e',
          color: 'white',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <CropIcon sx={{ color: '#e94560' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Ajustar Foto de Perfil
          </Typography>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: 'grey.400' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          background: '#0f0f23',
        }}
      >
        {/* Crop Area */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 300, sm: 380 },
            background: '#0f0f23',
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={onZoomChange}
            style={{
              containerStyle: {
                background: '#0f0f23',
              },
              cropAreaStyle: {
                border: '3px solid #e94560',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
              },
            }}
          />
        </Box>

        {/* Controls */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: 'linear-gradient(180deg, #16213e 0%, #1a1a2e 100%)',
          }}
        >
          {/* Zoom Control */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <IconButton
              onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
              sx={{ color: 'grey.400', '&:hover': { color: '#e94560' } }}
              size="small"
            >
              <ZoomOutIcon />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: 'grey.400', mb: 0.5, display: 'block' }}
              >
                Zoom
              </Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                onChange={(_, value) => setZoom(value as number)}
                sx={{
                  color: '#e94560',
                  '& .MuiSlider-thumb': {
                    width: 16,
                    height: 16,
                    '&:hover, &.Mui-active': {
                      boxShadow: '0 0 0 8px rgba(233, 69, 96, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    height: 4,
                  },
                  '& .MuiSlider-rail': {
                    height: 4,
                    opacity: 0.3,
                  },
                }}
              />
            </Box>
            <IconButton
              onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              sx={{ color: 'grey.400', '&:hover': { color: '#e94560' } }}
              size="small"
            >
              <ZoomInIcon />
            </IconButton>
          </Stack>

          {/* Rotation Controls */}
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RotateLeftIcon />}
              onClick={handleRotateLeft}
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'grey.300',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#e94560',
                  color: '#e94560',
                },
              }}
            >
              Rotar
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RotateRightIcon />}
              onClick={handleRotateRight}
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'grey.300',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#e94560',
                  color: '#e94560',
                },
              }}
            >
              Rotar
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={handleReset}
              sx={{
                color: 'grey.500',
                textTransform: 'none',
                '&:hover': { color: 'grey.300' },
              }}
            >
              Resetear
            </Button>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          background: '#1a1a2e',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: 'grey.400',
            textTransform: 'none',
            '&:hover': { color: 'white' },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{
            bgcolor: '#e94560',
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            '&:hover': {
              bgcolor: '#c73552',
            },
            '&:disabled': {
              bgcolor: 'rgba(233, 69, 96, 0.5)',
              color: 'rgba(255,255,255,0.5)',
            },
          }}
        >
          {saving ? 'Guardando...' : 'Usar esta foto'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
