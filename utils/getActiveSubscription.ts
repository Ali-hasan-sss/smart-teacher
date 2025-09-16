import { Subscription } from "@/store/subscription/subscriptionSlice";
import dayjs from "dayjs";

export function isSubscribedToGrade(
  subscriptions: Subscription[],
  gradeId: number
) {
  if (!subscriptions || subscriptions.length === 0) return null;

  const now = dayjs();

  const validSubs = subscriptions.filter(
    (sub) => sub.gradeId === gradeId && dayjs(sub.expireAt).isAfter(now)
  );

  if (validSubs.length === 0) return null;

  // نعيد أحدث اشتراك
  const latestSub = validSubs.sort(
    (a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()
  )[0];

  return latestSub;
}

export function hasAnyActiveSubscription(
  subscriptions: Subscription[]
): boolean {
  if (!subscriptions || subscriptions.length === 0) return false;

  const now = dayjs();
  const activeSub = subscriptions.find((sub) =>
    dayjs(sub.expireAt).isAfter(now)
  );

  return !!activeSub;
}
