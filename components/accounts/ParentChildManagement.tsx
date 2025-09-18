"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useTranslation } from "@/hooks/useTranslation";
import {
  generateRegisterQR,
  addParentChild,
  getParents,
  getChildren,
  removeParentChild,
} from "@/store/account/accountThunks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Users,
  UserPlus,
  UserMinus,
  RefreshCw,
  Smartphone,
  UserCheck,
  Copy,
  Scan,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import QRCodeModal from "./QRCodeModal";
import { toast } from "sonner";
import QRScanner from "../QRScanner";

interface ParentChildManagementProps {
  isOpen: boolean;
  onClose: () => void;
  accountType?: string;
  showInTab?: boolean;
}

export default function ParentChildManagement({
  isOpen,
  onClose,
  accountType = "Client",
  showInTab = false,
}: ParentChildManagementProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    qrCode,
    qrId,
    parents,
    children,
    loading,
    qrLoading,
    parentsLoading,
    childrenLoading,
    addParentChildLoading,
    removeParentChildLoading,
  } = useSelector((state: RootState) => state.account);

  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [qrInput, setQrInput] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [showQRScanner, setShowQRScanner] = useState(false);

  // تحديد نوع الحساب
  const isClient = accountType === "Client";
  const isParent = accountType === "Parent";
  const isTeacher = accountType === "Teacher";

  useEffect(() => {
    if (isOpen || showInTab) {
      // Load data based on account type
      console.log("Loading data for account type:", accountType);
      if (isClient) {
        console.log("Dispatching getParents...");
        dispatch(getParents());
      } else if (isParent) {
        console.log("Dispatching getChildren...");
        dispatch(getChildren());
      }
    }
  }, [isOpen, showInTab, dispatch, isClient, isParent, accountType]);

  // إغلاق QR Scanner عند إغلاق المودال الرئيسي
  useEffect(() => {
    if (!isOpen && !showInTab) {
      setShowQRScanner(false);
    }
  }, [isOpen, showInTab]);

  // Refresh data after successful operations
  // Remove global error and success message handling
  // Messages are now handled individually in each action

  // Close QR modal when qrId changes (new QR generated) - removed

  // Generate QR Code image when qrId is available
  useEffect(() => {
    if (qrId) {
      console.log("QR ID available:", qrId);
      QRCode.toDataURL(qrId, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((url) => {
          setQrCodeImage(url);
          setQrCodeVisible(true);
        })
        .catch((err) => {
          console.error("Error generating QR code:", err);
        });
    }
  }, [qrId]);

  const handleGenerateQR = () => {
    dispatch(generateRegisterQR()).then((result) => {
      if (result.payload?.isSuccess) {
        console.log(
          "QR generated successfully, qrId:",
          result.payload?.data?.uid
        );
        setQrCodeVisible(true);
      } else {
        console.log("QR generation failed");
      }
    });
  };

  const handleAddParent = () => {
    if (!qrInput.trim()) {
      toast.error(t("parentChild.enter_qr_code"));
      return;
    }
    dispatch(addParentChild({ qruId: qrInput.trim() })).then(() => {
      // Refresh data after adding parent
      if (isClient) {
        dispatch(getParents());
      } else if (isParent) {
        dispatch(getChildren());
      }
    });
    setQrInput("");
  };

  useEffect(() => {
    console.log("scan:", showQRScanner);
  }, [showQRScanner]);

  // إغلاق الكاميرا عند إغلاق المودال الرئيسي
  useEffect(() => {
    if (!isOpen && !showInTab) {
      setShowQRScanner(false);
    }
  }, [isOpen, showInTab]);

  const handleQRScan = (qrCode: string) => {
    console.log("QR Code scanned:", qrCode);
    setQrInput(qrCode);
    setShowQRScanner(false);

    // إرسال الطلب مباشرة مع الكود المسحوح
    if (qrCode.trim()) {
      dispatch(addParentChild({ qruId: qrCode.trim() })).then((result) => {
        if (result.payload?.isSuccess) {
          toast.success(t("parentChild.child_added_successfully"));
          // إعادة تحميل البيانات
          if (isClient) {
            dispatch(getParents());
          } else if (isParent) {
            dispatch(getChildren());
          }
        } else {
          toast.error(t("parentChild.child_addition_failed"));
        }
      });
    } else {
      toast.error(t("parentChild.invalid_qr_code"));
    }

    setQrInput("");
  };

  const handleRemoveParent = (parentId: number, parentName: string) => {
    if (!user?.id) return;

    console.log("Removing parent:", parentId);
    dispatch(removeParentChild({ childId: user.id, parentId: parentId }))
      .then(() => {
        if (isClient) {
          dispatch(getParents());
        }
        toast.success(t("parentChild.parent_removed_successfully"));
      })
      .catch(() => {
        toast.error(t("parentChild.parent_removal_failed"));
      });
  };

  const handleRemoveChild = (childId: number, childName: string) => {
    if (!user?.id) return;

    console.log("Removing child:", childId);
    dispatch(removeParentChild({ childId: childId, parentId: user.id }))
      .then(() => {
        if (isParent) {
          dispatch(getChildren());
        }
        toast.success(t("parentChild.child_removed_successfully"));
      })
      .catch(() => {
        toast.error(t("parentChild.child_removal_failed"));
      });
  };

  const content = (
    <div className="space-y-6">
      {!showInTab && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Users className="w-6 h-6" />
            {isClient
              ? t("parentChild.manage_parents")
              : t("parentChild.manage_children")}
          </h2>
        </div>
      )}

      {/* QR Code Generation Section - Only for Clients */}
      {isClient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              {t("parentChild.generate_qr")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t("parentChild.qr_description")}
            </p>
            <div className="space-y-4">
              <Button
                onClick={handleGenerateQR}
                disabled={qrLoading}
                className="w-full flex bg-blue-600 text-white items-center justify-center gap-2"
              >
                {qrLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <QrCode className="w-4 h-4" />
                )}
                {t("parentChild.generate_qr_button")}
              </Button>

              {/* QR Code Display */}
              {qrId && qrCodeVisible && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t("parentChild.qr_code")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {t("parentChild.scan_qr")}
                    </p>
                    {/* QR Code Image */}
                    {qrCodeImage && (
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 shadow-sm mb-4">
                        <img
                          src={qrCodeImage}
                          alt="QR Code"
                          className="mx-auto"
                          style={{ width: "200px", height: "200px" }}
                        />
                      </div>
                    )}

                    {/* QR Code Text */}
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 shadow-sm">
                      <p className="text-sm font-mono font-bold text-gray-900 break-all text-center">
                        {qrId}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      {t("parentChild.qr_expires_at")}:{" "}
                      {new Date().toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(qrId);
                            toast.success(t("parentChild.qr_copied"));
                          } catch (error) {
                            toast.error(t("parentChild.copy_failed"));
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {t("parentChild.copy")}
                      </Button>
                      <Button
                        onClick={() => {
                          setQrCodeVisible(false);
                          setQrCodeImage("");
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        {t("parentChild.close")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Child Section - Only for Parents */}
      {isParent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              {t("parentChild.add_child")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t("parentChild.add_child_description")}
            </p>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t("parentChild.enter_qr_code")}
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    console.log("QR Scanner button clicked");
                    setShowQRScanner(true);
                  }}
                  className="px-3 bg-blue-600 text-white"
                >
                  <Scan className="w-4 h-4" />
                </Button>
              </div>
              <QRScanner
                isOpen={showQRScanner}
                onClose={() => setShowQRScanner(false)}
                onScan={handleQRScan}
              />
              <Button
                onClick={handleAddParent}
                disabled={addParentChildLoading || !qrInput.trim()}
                className="w-full bg-blue-600 text-white flex items-center justify-center gap-2"
              >
                {addParentChildLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
                {t("parentChild.add_child_button")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parents List - Only for Clients */}
      {isClient && (
        <Card dir="rtl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t("parentChild.parents")} ({parents?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {parentsLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" />
                <p>{t("parentChild.loading_parents")}</p>
              </div>
            ) : parents && parents.length > 0 ? (
              <div className="space-y-3">
                {parents.map((parent: any) => (
                  <div
                    key={parent.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {parent.firstName?.[0]}
                        {parent.lastName?.[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                          {parent.firstName} {parent.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {parent.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleRemoveParent(
                          parent.id,
                          `${parent.firstName} ${parent.lastName}`
                        )
                      }
                      disabled={removeParentChildLoading}
                      className="flex items-center gap-1 flex-shrink-0"
                    >
                      <UserMinus className="w-4 h-4" />
                      {t("parentChild.remove")}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t("parentChild.no_parents")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Children List - Only for Parents */}
      {isParent && (
        <Card dir="rtl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              {t("parentChild.children")} ({children?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {childrenLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" />
                <p>{t("parentChild.loading_children")}</p>
              </div>
            ) : children && children.length > 0 ? (
              <div className="space-y-3">
                {children.map((child: any) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {child.firstName?.[0]}
                        {child.lastName?.[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                          {child.firstName} {child.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {child.email}
                        </p>
                        {child.grade && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {child.grade.title}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        handleRemoveChild(
                          child.id,
                          `${child.firstName} ${child.lastName}`
                        );
                      }}
                      disabled={removeParentChildLoading}
                      className="flex items-center gap-1 flex-shrink-0"
                    >
                      <UserMinus className="w-4 h-4" />
                      {t("parentChild.remove")}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t("parentChild.no_children")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (showInTab) {
    return content;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[98vw] max-w-6xl h-[90vh] overflow-y-auto">
          {content}
        </DialogContent>
      </Dialog>
    </>
  );
}
