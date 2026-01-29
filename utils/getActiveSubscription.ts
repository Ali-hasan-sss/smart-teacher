import { Subscription } from "@/store/subscription/subscriptionSlice";
import dayjs from "dayjs";

const isActive = (sub: Subscription) => dayjs(sub.expireAt).isAfter(dayjs());

/**
 * التحقق من اشتراك بالصف فقط (بدون مادة).
 * يُستخدم لفتح كل دروس مواد الصف.
 * الاشتراكات التي تحتوي على subject (اشتراك بمادة) لا تُحسب هنا.
 */
export function isSubscribedToGrade(
  subscriptions: Subscription[],
  gradeId: number,
) {
  if (!subscriptions || subscriptions.length === 0) return null;

  const validSubs = subscriptions.filter(
    (sub) =>
      sub.gradeId === gradeId &&
      isActive(sub) &&
      (sub.subject == null || sub.subject === undefined),
  );

  if (validSubs.length === 0) return null;

  const latestSub = validSubs.sort(
    (a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix(),
  )[0];

  return latestSub;
}

/** التحقق من اشتراك المستخدم في المادة (اشتراك حسب المادة SubjectBased) */
export function isSubscribedToSubject(
  subscriptions: Subscription[],
  subjectId: number,
) {
  if (!subscriptions || subscriptions.length === 0) return null;
  const sid = Number(subjectId);
  if (Number.isNaN(sid)) return null;

  const validSubs = subscriptions.filter(
    (sub) => Number(sub.subject?.id) === sid && isActive(sub),
  );

  if (validSubs.length === 0) return null;

  const latestSub = validSubs.sort(
    (a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix(),
  )[0];

  return latestSub;
}

/**
 * السماح بالدخول للدرس فقط إذا:
 * - اشتراك بالصف (بدون مادة، subject فارغ): يُفتح كل دروس مواد ذلك الصف.
 * - اشتراك بالمادة (موجود subject): يُفتح فقط دروس تلك المادة.
 * غير ذلك لا يُسمح بالدخول.
 */
export function canAccessCourse(
  subscriptions: Subscription[],
  gradeId: number,
  subjectId?: number,
): boolean {
  if (isSubscribedToGrade(subscriptions, gradeId)) return true;
  if (subjectId != null && isSubscribedToSubject(subscriptions, subjectId))
    return true;
  return false;
}

export function hasAnyActiveSubscription(
  subscriptions: Subscription[],
): boolean {
  if (!subscriptions || subscriptions.length === 0) return false;

  const now = dayjs();
  const activeSub = subscriptions.find((sub) =>
    dayjs(sub.expireAt).isAfter(now),
  );

  return !!activeSub;
}
