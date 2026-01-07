import { useEffect, useRef } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../state/authStore";
import {
  getUnreadCount,
  loadNotifications,
  saveNotifications,
} from "../utils/notificationsStorage";
import { useNotificationsStore } from "../state/notificationsStore";

/**
 * Convert a Supabase row into the app's local notification shape.
 * This intentionally stays resilient to schema drift.
 * @param {any} row
 */
function mapRowToNotification(row) {
  const id =
    row?.id !== undefined && row?.id !== null ? String(row.id) : undefined;

  const title = String(row?.title ?? row?.subject ?? "Notification").trim();
  const message = String(row?.message ?? row?.body ?? row?.text ?? "").trim();

  // Prefer created_at style columns; fall back to whatever exists.
  const createdAt = String(
    row?.created_at ?? row?.createdAt ?? row?.inserted_at ?? new Date().toISOString()
  ).trim();

  const type =
    typeof row?.type === "string"
      ? row.type
      : typeof row?.notification_type === "string"
        ? row.notification_type
        : undefined;

  const read = Boolean(row?.read ?? row?.is_read ?? false);

  return {
    id: id || `ntf_rt_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    title,
    message,
    createdAt,
    type,
    read,
  };
}

function upsertById(list, nextItem) {
  const nextId = String(nextItem.id);
  const idx = (list ?? []).findIndex((n) => String(n?.id) === nextId);

  if (idx === -1) return [nextItem, ...(list ?? [])];

  const copy = [...(list ?? [])];
  // Merge server update over local; keep our normalized fields stable.
  copy[idx] = { ...copy[idx], ...nextItem, id: nextId };
  return copy;
}

function isSupabaseConfigured() {
  const url =
    process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key =
    process.env.REACT_APP_SUPABASE_KEY || process.env.SUPABASE_KEY || "";
  return Boolean(url && key && url.trim() && key.trim());
}

/**
 * PUBLIC_INTERFACE
 * useRealtimeNotifications
 *
 * Subscribes to Supabase Realtime "postgres_changes" on the `notifications` table
 * and keeps the frontend's localStorage-backed notification list + global unread badge
 * up to date without refresh.
 *
 * Behavior:
 * - Keeps existing localStorage seed + edits as the source of truth for the UI.
 * - On INSERT: prepends the new notification (upsert by id) and persists.
 * - On UPDATE: merges updates into existing notification (upsert by id) and persists.
 * - Updates unread count in the NotificationsStore after each change.
 * - Handles auth user changes by resubscribing (and cleans up old subscription).
 * - Feature-flags itself off when Supabase env vars are missing.
 *
 * Notes:
 * - This assumes your Supabase schema has a `notifications` table (as in docs/supabase_schema_seed.sql).
 * - If RLS scopes rows by `user_id = auth.uid()`, Realtime will only deliver the current user's rows.
 */
export function useRealtimeNotifications() {
  const { user } = useAuth();
  const { setUnreadCount } = useNotificationsStore();

  const channelRef = useRef(null);

  // Keep unread count reasonably initialized even before the first realtime payload arrives.
  useEffect(() => {
    setUnreadCount(getUnreadCount(loadNotifications()));
  }, [setUnreadCount]);

  useEffect(() => {
    // Always teardown any previous channel before (re)subscribing.
    async function teardown() {
      if (!channelRef.current) return;
      try {
        await supabase.removeChannel(channelRef.current);
      } catch {
        // ignore
      } finally {
        channelRef.current = null;
      }
    }

    // If Supabase isn't configured, keep the scaffold but do nothing.
    if (!isSupabaseConfigured()) {
      teardown();
      return;
    }

    // If user is not authenticated, don't subscribe.
    if (!user?.id) {
      teardown();
      return;
    }

    let isMounted = true;

    // Create a unique channel name per user to reduce collisions.
    const channel = supabase.channel(`notifications:user:${user.id}`);

    const applyPayload = (payload) => {
      if (!isMounted) return;

      // We support either INSERT/UPDATE with new row in `payload.new`.
      const row = payload?.new || payload?.record || null;
      if (!row) return;

      const nextNotification = mapRowToNotification(row);

      // Load -> upsert -> persist (localStorage remains the UX source of truth).
      const current = loadNotifications();
      const nextList = upsertById(current, nextNotification);
      saveNotifications(nextList);
      setUnreadCount(getUnreadCount(nextList));
    };

    // Subscribe to inserts/updates on the notifications table.
    // We rely primarily on RLS to scope the event stream to the user.
    // If your project doesn't enforce RLS, consider adding a server-side filter.
    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        applyPayload
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        applyPayload
      )
      .subscribe((status) => {
        // Avoid noisy logs in production.
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.debug("[Realtime] notifications channel status:", status);
        }
      });

    channelRef.current = channel;

    return () => {
      isMounted = false;
      teardown();
    };
  }, [user?.id, setUnreadCount]);
}

export default useRealtimeNotifications;
