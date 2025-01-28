'use client';

import { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAttendance } from '@/lib/attendance-context';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
  department: string;
}

export function AttendanceModal({ isOpen, onClose, userEmail, userName, department }: AttendanceModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: string; lng: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addRecord } = useAttendance();

  useEffect(() => {
    if (isOpen) {
      initializeCamera();
      getLocation();
    } else {
      cleanupCamera();
    }
  }, [isOpen]);

  const initializeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError('Failed to access camera. Please ensure camera permissions are granted.');
      console.error('Camera error:', err);
    }
  };

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: `${position.coords.latitude}° N`,
            lng: `${position.coords.longitude}° E`
          });
          setError(null);
        },
        (err) => {
          setError('Failed to get location. Please enable location services.');
          console.error('Location error:', err);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        setPhoto(photoData);
      }
    }
  };

  const handleSubmit = () => {
    if (!photo || !location) {
      setError('Please capture your photo and allow location access.');
      return;
    }

    addRecord({
      name: userName,
      email: userEmail,
      department,
      location,
      photo
    });

    cleanupCamera();
    onClose();
  };

  const cleanupCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setPhoto(null);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      cleanupCamera();
      onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {!photo ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={photo}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex justify-between">
            {!photo ? (
              <Button onClick={capturePhoto} disabled={!stream}>
                Capture Photo
              </Button>
            ) : (
              <Button onClick={() => setPhoto(null)}>
                Retake Photo
              </Button>
            )}
            <Button onClick={handleSubmit} disabled={!photo || !location}>
              Mark Attendance
            </Button>
          </div>

          {location && (
            <div className="text-sm text-gray-500">
              Location: {location.lat}, {location.lng}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 