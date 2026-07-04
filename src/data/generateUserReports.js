function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function fmtDuration(fromIso, toIso) {
  if (!fromIso || !toIso) return "—";
  const ms = new Date(toIso) - new Date(fromIso);
  if (ms < 0) return "—";
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function otherParty(message, userId) {
  const sender = message.senderId;
  const receiver = message.receiverId;
  return String(sender?._id) === String(userId) ? receiver : sender;
}

function preview(message) {
  if (message.text) return message.text.slice(0, 30) + (message.text.length > 30 ? "…" : "");
  if (message.image) return "[image]";
  if (message.video) return "[video]";
  return "[message]";
}

function previewText(text) {
  if (!text) return "[empty]";
  return text.slice(0, 30) + (text.length > 30 ? "…" : "");
}

// Expands a message's editHistory into one row per edit event, each showing
// the exact text before and after that specific edit.
function editHistoryRows(message, chatWithName) {
  const history = message.editHistory ?? [];
  if (!history.length) return [];
  return history.map((h, i) => {
    const newText = history[i + 1] ? history[i + 1].text : message.text;
    return [chatWithName, previewText(h.text), previewText(newText), fmtDate(h.editedAt)];
  });
}

// Builds the report categories for a user from real, API-sourced data.
// Report types with no backend tracking (login history, sessions, AI usage,
// theme/wallpaper changes) are intentionally omitted rather than faked.
export function generateUserReports(data) {
  const { user, sentRequests = [], receivedRequests = [], blockedByUsers = [], messages = [] } = data;
  const userId = user._id;

  const allRequests = [...sentRequests, ...receivedRequests];

  const friendRequestRows = [
    ...sentRequests.map((f) => [f.receiverId?.fullName ?? "Unknown", "Sent", cap(f.status), fmtDate(f.createdAt)]),
    ...receivedRequests.map((f) => [f.senderId?.fullName ?? "Unknown", "Received", cap(f.status), fmtDate(f.createdAt)]),
  ];

  const blockUnblockRows = [
    ...user.blockedUsers.map((u) => [u.fullName, u.email, "Blocked by you", "—"]),
    ...blockedByUsers.map((u) => [u.fullName, u.email, "Blocked you", "—"]),
  ];

  const blockedByMeRows = user.blockedUsers.length
    ? user.blockedUsers.map((u) => [u.fullName, u.email, "—"])
    : [["—", "—", "—"]];

  const sentMessages = messages.filter((m) => String(m.senderId?._id) === String(userId));
  const receivedMessages = messages.filter((m) => String(m.receiverId?._id) === String(userId));

  const chatActivity = {};
  messages.forEach((m) => {
    const other = otherParty(m, userId);
    if (!other) return;
    const key = String(other._id);
    if (!chatActivity[key]) chatActivity[key] = { name: other.fullName, sent: 0, recv: 0 };
    if (String(m.senderId?._id) === String(userId)) chatActivity[key].sent++;
    else chatActivity[key].recv++;
  });
  const msgActivityRows = Object.values(chatActivity).map((v) => [
    v.name, String(v.sent), String(v.recv), String(v.sent + v.recv),
  ]);
  if (!msgActivityRows.length) msgActivityRows.push(["No conversations yet", "0", "0", "0"]);

  const readReceiptRows = sentMessages.slice(0, 10).map((m) => [
    preview(m),
    m.receiverId?.fullName ?? "Unknown",
    m.readAt ? "Read" : m.deliveredAt ? "Delivered" : "Sent",
    m.readAt ? fmtDuration(m.createdAt, m.readAt) : "—",
  ]);
  if (!readReceiptRows.length) readReceiptRows.push(["No sent messages", "—", "—", "—"]);

  const editedMessages = sentMessages.filter((m) => m.editedAt);
  const editedRows = editedMessages.flatMap((m) => editHistoryRows(m, m.receiverId?.fullName ?? "Unknown"));
  const totalEdits = editedRows.length;
  if (!editedRows.length) editedRows.push(["No edited messages", "—", "—", "—"]);

  const deletedMessages = sentMessages.filter((m) => m.deletedForEveryone);
  const deletedRows = deletedMessages.length
    ? deletedMessages.map((m) => [m.receiverId?.fullName ?? "Unknown", fmtDate(m.updatedAt), "For Everyone"])
    : [["No deleted messages", "—", "—"]];

  const archivedRows = user.archivedConversations.length
    ? user.archivedConversations.map((u) => [u.fullName, "—"])
    : [["No archived chats", "—"]];

  const mutedRows = user.mutedConversations.length
    ? user.mutedConversations.map((m) => [m.userId?.fullName ?? "Unknown", "—", m.mutedUntil ? fmtDate(m.mutedUntil) : "Forever"])
    : [["No muted chats", "—", "—"]];

  const pinnedMsgs = messages.filter((m) => m.isPinned);
  const pinnedRows = pinnedMsgs.length
    ? pinnedMsgs.map((m) => [preview(m), otherParty(m, userId)?.fullName ?? "Unknown", fmtDate(m.updatedAt)])
    : [["No pinned messages", "—", "—"]];

  const starredMsgs = user.starredMessages ?? [];
  const starredRows = starredMsgs.length
    ? starredMsgs.map((m) => [preview(m), otherParty(m, userId)?.fullName ?? "Unknown", fmtDate(m.createdAt)])
    : [["No starred messages", "—", "—"]];

  const friendActivityRows = user.friends.length
    ? user.friends.slice(0, 10).map((f) => [
        f.fullName,
        f.status === "online" ? "Online now" : fmtDate(f.lastSeen),
      ])
    : [["No friends yet", "—"]];

  return [
    {
      id: "friends",
      label: "Friends & Connections",
      color: "violet",
      reports: [
        {
          id: "friend-requests",
          name: "Friend Request Report",
          description: "Every friend request sent or received with date and status.",
          summary: `${user.fullName} sent ${sentRequests.length} and received ${receivedRequests.length} friend requests.`,
          rows: [
            { label: "Total Sent",     value: sentRequests.length },
            { label: "Total Received", value: receivedRequests.length },
            { label: "Accepted",       value: allRequests.filter((f) => f.status === "accepted").length },
            { label: "Pending",        value: allRequests.filter((f) => f.status === "pending").length },
          ],
          table: { headers: ["User", "Direction", "Status", "Date"], rows: friendRequestRows.length ? friendRequestRows : [["No requests", "—", "—", "—"]] },
        },
        {
          id: "block-unblock",
          name: "Block / Unblock Report",
          description: "Users this user has blocked, or has been blocked by.",
          summary: `${user.fullName} has blocked ${user.blockedUsers.length} user(s); blocked by ${blockedByUsers.length} user(s).`,
          rows: [
            { label: "Blocked by User",   value: user.blockedUsers.length },
            { label: "Blocked by Others", value: blockedByUsers.length },
          ],
          table: { headers: ["User", "Email", "Action", "Date"], rows: blockUnblockRows.length ? blockUnblockRows : [["No block history", "—", "—", "—"]] },
        },
        {
          id: "blocked-by-me",
          name: "Blocked By Me Report",
          description: "All users this user has currently blocked.",
          summary: `${user.fullName} currently has ${user.blockedUsers.length} user(s) blocked.`,
          rows: [{ label: "Currently Blocked", value: user.blockedUsers.length }],
          table: { headers: ["User", "Email", "Blocked On"], rows: blockedByMeRows },
        },
      ],
    },
    {
      id: "messaging",
      label: "Messaging",
      color: "blue",
      reports: [
        {
          id: "message-activity",
          name: "Message Activity Report",
          description: "Messages sent and received per chat.",
          summary: `${user.fullName} sent ${sentMessages.length} and received ${receivedMessages.length} messages total.`,
          rows: [
            { label: "Total Sent",     value: sentMessages.length },
            { label: "Total Received", value: receivedMessages.length },
            { label: "Total",          value: messages.length },
          ],
          table: { headers: ["Chat With", "Sent", "Received", "Total"], rows: msgActivityRows },
        },
        {
          id: "read-receipts",
          name: "Read Receipt Report",
          description: "Which messages were delivered vs. actually read.",
          summary: `${sentMessages.length} messages sent — ${sentMessages.filter((m) => m.readAt).length} have been read.`,
          rows: [
            { label: "Messages Sent", value: sentMessages.length },
            { label: "Read",          value: sentMessages.filter((m) => m.readAt).length },
          ],
          table: { headers: ["Message Preview", "Sent To", "Status", "Read After"], rows: readReceiptRows },
        },
        {
          id: "edited-messages",
          name: "Edited Messages Report",
          description: "Messages this user has edited, showing previous and new content for each edit.",
          summary: `${user.fullName} has made ${totalEdits} edit(s) across ${editedMessages.length} message(s).`,
          rows: [
            { label: "Messages Edited", value: editedMessages.length },
            { label: "Total Edits",     value: totalEdits },
          ],
          table: { headers: ["Chat With", "Previous Text", "New Text", "Edited At"], rows: editedRows },
        },
        {
          id: "deleted-messages",
          name: "Deleted Messages Report",
          description: "Messages deleted for everyone by this user.",
          summary: `${user.fullName} deleted ${deletedMessages.length} message(s) for everyone.`,
          rows: [{ label: "Deleted for Everyone", value: deletedMessages.length }],
          table: { headers: ["Chat With", "Deleted At", "Type"], rows: deletedRows },
        },
      ],
    },
    {
      id: "conversations",
      label: "Conversation Management",
      color: "green",
      reports: [
        {
          id: "archived",
          name: "Archived Conversations Report",
          description: "Chats this user has archived.",
          summary: `${user.fullName} has ${user.archivedConversations.length} archived chat(s).`,
          rows: [{ label: "Total Archived", value: user.archivedConversations.length }],
          table: { headers: ["Chat With", "Archived On"], rows: archivedRows },
        },
        {
          id: "muted",
          name: "Muted Conversations Report",
          description: "Chats this user has muted.",
          summary: `${user.fullName} has ${user.mutedConversations.length} muted chat(s).`,
          rows: [{ label: "Currently Muted", value: user.mutedConversations.length }],
          table: { headers: ["Chat With", "Muted Since", "Mute Ends"], rows: mutedRows },
        },
        {
          id: "pinned",
          name: "Pinned Messages Report",
          description: "Messages pinned in this user's chats.",
          summary: `${user.fullName} has ${pinnedMsgs.length} pinned message(s).`,
          rows: [{ label: "Total Pinned", value: pinnedMsgs.length }],
          table: { headers: ["Message Preview", "Chat With", "Pinned On"], rows: pinnedRows },
        },
        {
          id: "starred",
          name: "Starred Messages Report",
          description: "All messages this user has starred.",
          summary: `${user.fullName} has ${starredMsgs.length} starred message(s).`,
          rows: [{ label: "Total Starred", value: starredMsgs.length }],
          table: { headers: ["Message Preview", "Chat With", "Sent On"], rows: starredRows },
        },
      ],
    },
    {
      id: "presence",
      label: "Presence & Status",
      color: "orange",
      reports: [
        {
          id: "last-seen",
          name: "Last Seen / Activity Report",
          description: "When this user and their friends were last active.",
          summary: user.status === "online"
            ? `${user.fullName} is currently online.`
            : `${user.fullName} was last seen on ${fmtDate(user.lastSeen)}.`,
          rows: [
            { label: "Current Status", value: user.status },
            { label: "Last Seen",      value: user.status === "online" ? "Online now" : fmtDate(user.lastSeen) },
            { label: "Friends",        value: user.friends.length },
          ],
          table: { headers: ["Friend", "Last Seen"], rows: friendActivityRows },
        },
      ],
    },
  ];
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
