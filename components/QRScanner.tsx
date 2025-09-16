"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Camera, X, RefreshCw } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import jsQR from "jsqr";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export default function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
        scanQR();
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("تعذر فتح الكاميرا");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const scanQR = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          console.log("QR Code detected:", code.data);
          onScan(code.data);
          stopCamera(); // مهم: نوقف الكاميرا
          onClose();
          return;
        }
      } else if (isScanning) {
        requestAnimationFrame(scan);
      }
    };

    scan();
  };

  const handleStopScan = () => {
    console.log("Manual stop scan requested");
    setIsScanning(false);
    stopCamera();
    onClose();
  };

  console.log("QRScanner render, isOpen:", isOpen);

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          stopCamera();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {t("qrScanner.title") || "مسح رمز QR"}
          </DialogTitle>
          <DialogDescription>
            {t("qrScanner.scanDescription") || "وجه الكاميرا نحو رمز QR للمسح"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="mb-2">{error}</p>
              <Button
                onClick={startCamera}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                إعادة المحاولة
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="text-center space-y-4">
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400">
                  <Camera className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm">
                    {t("qrScanner.loading") || "جاري تحميل الكاميرا..."}
                  </p>
                  <p className="text-xs mt-2 text-gray-500 dark:text-gray-500">
                    قد يستغرق هذا بضع ثوانٍ...
                  </p>
                  <div className="mt-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                  <p className="text-xs mt-2 text-gray-400 dark:text-gray-600">
                    تأكد من السماح للكاميرا في إعدادات المتصفح
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 bg-black rounded-lg object-cover"
                  playsInline
                  muted
                  autoPlay
                  webkit-playsinline="true"
                  style={{ transform: "scaleX(-1)" }} // عكس الصورة لتبدو طبيعية
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-500 rounded-lg">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  {t("qrScanner.scanning") || "وجه الكاميرا نحو رمز QR"}
                </p>
                <Button
                  onClick={handleStopScan}
                  variant="outline"
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t("qrScanner.stopScan") || "إيقاف المسح"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
