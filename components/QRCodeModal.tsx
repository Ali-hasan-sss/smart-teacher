"use client";

import { useTranslation } from "@/hooks/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrId: string;
  loading?: boolean;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  qrId,
  loading = false,
}: QRCodeModalProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  console.log(
    "QRCodeModal - qrId:",
    qrId,
    "loading:",
    loading,
    "isOpen:",
    isOpen
  );
  console.log(
    "QRCodeModal - qrId type:",
    typeof qrId,
    "qrId length:",
    qrId?.length
  );

  // Monitor isOpen changes
  useEffect(() => {
    console.log("QRCodeModal isOpen changed to:", isOpen);
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrId);
      setCopied(true);
      toast.success(t("parentChild.qr_copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(t("parentChild.copy_failed"));
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5" />
              {t("parentChild.generating_qr")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t("parentChild.generating_qr_please_wait")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // console.log("QRCodeModal rendering - isOpen:", isOpen, "qrId:", qrId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5" />
            {t("parentChild.qr_code")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t("parentChild.scan_qr")}
            </p>
            {qrId ? (
              <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 shadow-sm">
                <p className="text-xl font-mono font-bold text-gray-900 break-all text-center">
                  {qrId}
                </p>
              </div>
            ) : (
              <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300 shadow-sm">
                <p className="text-gray-500 text-center">
                  {t("parentChild.no_qr_generated")}
                </p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-3">
              {t("parentChild.qr_expires_at")}: {new Date().toLocaleString()}
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex-1 flex items-center gap-2"
              disabled={!qrId}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? t("parentChild.copied") : t("parentChild.copy")}
            </Button>
            <Button onClick={onClose} className="flex-1">
              {t("parentChild.close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
