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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Camera,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export default function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const qrCodeElementId = "qr-scanner-element";

  const handleScanSuccess = async (qrCodeMessage: string) => {
    if (hasScanned) return;
    setHasScanned(true);

    console.log("QR Code detected:", qrCodeMessage);

    // Stop scanner
    if (scanner) {
      try {
        scanner.clear();
      } catch (error) {
        console.error("Error clearing scanner:", error);
      }
    }

    setScanResult(qrCodeMessage);
    onScan(qrCodeMessage.trim());
    onClose();
  };

  const startScanner = async () => {
    if (scanner || isInitializing) return;

    setIsInitializing(true);
    console.log("Starting QR scanner...");

    try {
      const newScanner = new Html5Qrcode(qrCodeElementId);

      // Start camera
      await newScanner.start(
        { facingMode: "user" }, // الكاميرا الأمامية
        {
          fps: 10,
          qrbox: { width: 200, height: 200 },
          aspectRatio: 1.0,
          disableFlip: true,
        },
        handleScanSuccess,
        (errorMessage: string) => {
          // تجاهل أخطاء المسح العادية
          if (
            !errorMessage.includes("QR code parse error") &&
            !errorMessage.includes("No QR code found") &&
            !errorMessage.includes("NotFoundException")
          ) {
            console.warn("QR Scan error:", errorMessage);
          }
        }
      );

      setScanner(newScanner);
      setIsInitializing(false);
      console.log("Camera started successfully");
    } catch (error) {
      console.error("Camera initialization failed:", error);
      setError(t("qrScanner.camera_error") || "تعذر فتح الكاميرا");
      setIsInitializing(false);
    }
  };

  const stopScanner = () => {
    console.log("Stopping scanner...");
    if (scanner) {
      try {
        scanner.stop().catch((error: any) => {
          console.warn("Error stopping scanner:", error);
        });
        scanner.clear();
      } catch (error) {
        console.warn("Error in stopScanner:", error);
      }
      setScanner(null);
    }
    setScanResult(null);
    setHasScanned(false);
    setIsInitializing(false);
    setShowScanner(false);
  };

  useEffect(() => {
    if (isOpen) {
      console.log("QR Scanner modal opened");
      // Reset state
      setHasScanned(false);
      setScanResult(null);
      setError(null);

      // Show scanner container first
      setShowScanner(true);
    } else {
      console.log("QR Scanner modal closed");
      setShowScanner(false);
      stopScanner();
    }

    return () => {
      console.log("QR Scanner component unmounting, cleaning up...");
      if (scanner) {
        scanner.stop().catch(() => {});
        try {
          scanner.clear();
        } catch (error) {
          console.warn("Error clearing scanner on unmount:", error);
        }
      }
    };
  }, [isOpen]);

  // بدء المسح عند ظهور الحاوي
  useEffect(() => {
    if (showScanner && isOpen && !scanner && !isInitializing) {
      console.log("Scanner container ready, starting scanner...");
      setTimeout(startScanner, 500);
    }
  }, [showScanner, isOpen, scanner, isInitializing]);

  const handleClose = () => {
    console.log("Handling modal close...");
    stopScanner();
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleTryAgain = () => {
    stopScanner();
    setTimeout(() => {
      setHasScanned(false);
      setScanResult(null);
      setShowScanner(true);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm w-full mx-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {t("qrScanner.title") || "مسح رمز QR"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            {t("qrScanner.scanDescription") || "وجه الكاميرا نحو رمز QR للمسح"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>{error}</p>
                  <Button onClick={handleTryAgain} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    إعادة المحاولة
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {scanResult && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium">تم المسح بنجاح!</p>
              </AlertDescription>
            </Alert>
          )}

          {isInitializing && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>{t("qrScanner.loading") || "جاري تحميل الكاميرا..."}</span>
            </div>
          )}

          {showScanner && !scanResult && (
            <div className="space-y-4">
              <div className="relative w-full max-w-sm mx-auto">
                <div
                  id={qrCodeElementId}
                  className="w-full h-[300px] bg-black rounded-xl overflow-hidden border-2 border-gray-200"
                />
                {/* QR Frame Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white rounded-lg shadow-lg">
                      <div className="w-full h-full border-2 border-dashed border-white/50 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  📱 ضع رمز QR داخل الإطار
                </p>
                <p className="text-xs text-gray-500">
                  تأكد من وضوح الرمز وإضاءة جيدة
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {scanResult ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleTryAgain}
                  className="flex-1"
                >
                  مسح آخر
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  تم
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                إلغاء
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
