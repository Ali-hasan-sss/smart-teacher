"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  fetchNotifications,
  markNotificationAsSeen,
  postUnseenCount,
} from "@/store/notifications/notificationThunks";
import { Bell, CheckCheck, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/store/notifications/notificationSlice";

export default function NotificationsDropdown() {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unseenCount } = useSelector(
    (state: RootState) => state.notifications
  );

  const handleOpenChange = (open: boolean) => {
    if (open) {
      dispatch(fetchNotifications());
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(postUnseenCount());
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markNotificationAsSeen(id));
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <Bell className="w-6 h-6" />
          {unseenCount > 0 && (
            <Badge className="absolute -top-1 -right-1">{unseenCount}</Badge>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
        {/* الهيدر */}
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
          {unseenCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              title="تعيين الكل كمقروءة"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
        </div>
        <DropdownMenuSeparator />

        {/* القائمة */}
        {notifications.length === 0 ? (
          <DropdownMenuItem className="cursor-default text-gray-500 dark:text-gray-400">
            لا توجد إشعارات
          </DropdownMenuItem>
        ) : (
          notifications.map((notification: Notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex justify-between items-start gap-2"
            >
              <div
                className={`flex flex-col ${
                  !notification.isRead ? "font-bold" : ""
                }`}
              >
                <span>{notification.title}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  {notification.createdAt}
                </span>
              </div>
              {!notification.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notification.id);
                  }}
                  className="text-green-600 hover:text-green-800"
                  title="تعيين كمقروء"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
