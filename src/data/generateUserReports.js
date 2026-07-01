import { USERS, MESSAGES, FRIEND_REQUESTS } from "./sampleData";

// Deterministic pseudo-random seeded by user id
function seeded(seed) {
  let h = 5381;
  for (let i = 0; i < seed.length; i++)
    h = (Math.imul(33, h) ^ seed.charCodeAt(i)) >>> 0;
  return () => {
    h ^= h << 13; h ^= h >> 17; h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function nameOf(id) {
  return USERS.find((u) => u._id === id)?.fullName ?? id;
}

export function generateUserReports(user) {
  const rand = seeded(user._id);
  const r = () => Math.floor(rand() * 100);

  // Derive real values from sample data
  const sentRequests  = FRIEND_REQUESTS.filter((f) => f.senderId === user._id);
  const recvRequests  = FRIEND_REQUESTS.filter((f) => f.receiverId === user._id);
  const allRequests   = [...sentRequests, ...recvRequests];
  const blockedBy     = USERS.filter((u) => u.blockedUsers.includes(user._id));
  const userMessages  = MESSAGES.filter((m) => m.senderId === user._id || m.receiverId === user._id);
  const sentMessages  = userMessages.filter((m) => m.senderId === user._id);
  const pinnedMsgs    = MESSAGES.filter((m) => m.isPinned && (m.senderId === user._id || m.receiverId === user._id));
  const deletedMsgs   = sentMessages.filter((m) => m.deletedForEveryone);

  const friendNames = user.friends.map(nameOf);
  const blockedNames = user.blockedUsers.map(nameOf);

  // --- A. Friends & Connections ---
  const friendRequestRows = allRequests.map((f) => [
    f.senderId === user._id ? nameOf(f.receiverId) : nameOf(f.senderId),
    f.senderId === user._id ? "Sent" : "Received",
    f.status.charAt(0).toUpperCase() + f.status.slice(1),
    fmtDate(f.createdAt),
  ]);

  const blockUnblockRows = [
    ...blockedNames.map((n) => [n, "Blocked by you", fmtDate(new Date(Date.now() - r() * 86400000 * 10).toISOString())]),
    ...blockedBy.map((u) => [u.fullName, "Blocked you", fmtDate(u.createdAt)]),
  ];

  const blockedByMeRows = blockedNames.length
    ? blockedNames.map((n) => [n, `${n.toLowerCase().replace(" ", ".")}@gmail.com`, fmtDate(new Date(Date.now() - r() * 86400000 * 5).toISOString())])
    : [["—", "—", "—"]];

  // --- B. Messaging ---
  const chatActivity = {};
  userMessages.forEach((m) => {
    const other = m.senderId === user._id ? m.receiverId : m.senderId;
    if (!chatActivity[other]) chatActivity[other] = { sent: 0, recv: 0 };
    if (m.senderId === user._id) chatActivity[other].sent++;
    else chatActivity[other].recv++;
  });
  const msgActivityRows = Object.entries(chatActivity).map(([id, v]) => [
    nameOf(id), String(v.sent), String(v.recv), String(v.sent + v.recv),
  ]);
  if (!msgActivityRows.length) msgActivityRows.push(["No conversations yet", "0", "0", "0"]);

  const readReceiptRows = sentMessages.slice(0, 5).map((m) => [
    m.text ? m.text.slice(0, 30) + (m.text.length > 30 ? "…" : "") : "[image]",
    nameOf(m.receiverId),
    rand() > 0.3 ? "Read" : "Delivered",
    `${Math.ceil(rand() * 10)}m`,
  ]);
  if (!readReceiptRows.length) readReceiptRows.push(["No sent messages", "—", "—", "—"]);

  const editedRows = sentMessages.slice(0, 3).map((m) => [
    m.text ? m.text.slice(0, 28) + "…" : "[image]",
    nameOf(m.receiverId),
    fmtDate(m.createdAt),
    fmtDate(new Date(new Date(m.createdAt).getTime() + 120000).toISOString()),
  ]);
  if (!editedRows.length) editedRows.push(["No messages", "—", "—", "—"]);

  const deletedRows = deletedMsgs.length
    ? deletedMsgs.map((m) => [nameOf(m.receiverId), fmtDate(m.createdAt), "For Everyone"])
    : [["No deleted messages", "—", "—"]];

  // --- C. Conversation Management ---
  const archivedRows = user.archivedConversations.length
    ? user.archivedConversations.map((id) => [
        nameOf(id),
        fmtDate(new Date(Date.now() - r() * 86400000 * 30).toISOString()),
      ])
    : [["No archived chats", "—"]];

  const mutedRows = user.mutedConversations.length
    ? user.mutedConversations.map((m) => [
        nameOf(m.userId),
        fmtDate(new Date(Date.now() - r() * 86400000 * 5).toISOString()),
        m.mutedUntil ? fmtDate(m.mutedUntil) : "Forever",
      ])
    : [["No muted chats", "—", "—"]];

  const pinnedRows = pinnedMsgs.length
    ? pinnedMsgs.map((m) => [
        m.text ? m.text.slice(0, 30) + "…" : "[image]",
        nameOf(m.senderId === user._id ? m.receiverId : m.senderId),
        fmtDate(m.createdAt),
      ])
    : [["No pinned messages", "—", "—"]];

  const starredRows = user.starredMessages.slice(0, 5).map((id, i) => [
    `Message #${id}`,
    friendNames[i % Math.max(friendNames.length, 1)] ?? "—",
    fmtDate(new Date(Date.now() - r() * 86400000 * 15).toISOString()),
  ]);
  if (!starredRows.length) starredRows.push(["No starred messages", "—", "—"]);

  // --- D. Presence ---
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const onlineTimeRows = days.map((d) => [d, `${(rand() * 5 + 0.5).toFixed(1)} hrs`]);

  const friendActivityRows = user.friends.slice(0, 5).map((id) => {
    const f = USERS.find((u) => u._id === id);
    return [
      f?.fullName ?? id,
      f?.lastSeen ? fmtDate(f.lastSeen) : "Online now",
    ];
  });
  if (!friendActivityRows.length) friendActivityRows.push(["No friends yet", "—"]);

  // --- E. AI ---
  const aiRows = days.map((d) => [d, String(Math.ceil(rand() * 12)), String(Math.ceil(rand() * 5))]);
  const summaryRows = friendNames.slice(0, 4).map((n) => [
    n,
    fmtDate(new Date(Date.now() - r() * 86400000 * 20).toISOString()),
  ]);
  if (!summaryRows.length) summaryRows.push(["No summaries yet", "—"]);

  // --- F. Personalization ---
  const themes = ["Ocean Blue", "Deep Purple", "Rose Gold", "Emerald", "Slate Gray"];
  const themeRows = [
    ["Theme", themes[Math.floor(rand() * themes.length)], fmtDate(new Date(Date.now() - 864000000).toISOString())],
    ["Wallpaper", "Mountains", fmtDate(new Date(Date.now() - 1728000000).toISOString())],
    ["Theme", themes[Math.floor(rand() * themes.length)], fmtDate(new Date(Date.now() - 5184000000).toISOString())],
  ];

  // --- G. Security ---
  const loginMethods = ["Google", "Email/Password"];
  const devices = ["MacBook Pro", "iPhone 15", "Windows PC", "iPad"];
  const loginRows = Array.from({ length: 5 }, (_, i) => [
    fmtDate(new Date(Date.now() - i * 86400000).toISOString()),
    loginMethods[Math.floor(rand() * 2)],
    devices[Math.floor(rand() * 2)],
  ]);
  const sessionRows = [
    [devices[Math.floor(rand() * 2)], "Chrome 125", fmtDate(new Date().toISOString())],
    [devices[Math.floor(rand() * 2)], "ChatKoro App", fmtDate(new Date(Date.now() - 86400000).toISOString())],
  ];

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
          summary: `${user.fullName} sent ${sentRequests.length} and received ${recvRequests.length} friend requests.`,
          rows: [
            { label: "Total Sent",     value: sentRequests.length  },
            { label: "Total Received", value: recvRequests.length  },
            { label: "Accepted",       value: allRequests.filter((f) => f.status === "accepted").length },
            { label: "Pending",        value: allRequests.filter((f) => f.status === "pending").length  },
          ],
          table: { headers: ["User", "Direction", "Status", "Date"], rows: friendRequestRows.length ? friendRequestRows : [["No requests", "—", "—", "—"]] },
        },
        {
          id: "block-unblock",
          name: "Block / Unblock Report",
          description: "History of blocks — by this user or against them.",
          summary: `${user.fullName} has blocked ${user.blockedUsers.length} user(s); blocked by ${blockedBy.length} user(s).`,
          rows: [
            { label: "Blocked by User",    value: user.blockedUsers.length },
            { label: "Blocked by Others",  value: blockedBy.length         },
          ],
          table: { headers: ["User", "Action", "Date"], rows: blockUnblockRows.length ? blockUnblockRows : [["No block history", "—", "—"]] },
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
          summary: `${user.fullName} sent ${sentMessages.length} and received ${userMessages.length - sentMessages.length} messages total.`,
          rows: [
            { label: "Total Sent",     value: sentMessages.length                        },
            { label: "Total Received", value: userMessages.length - sentMessages.length  },
            { label: "Total",          value: userMessages.length                        },
          ],
          table: { headers: ["Chat With", "Sent", "Received", "Total"], rows: msgActivityRows },
        },
        {
          id: "read-receipts",
          name: "Read Receipt Report",
          description: "Which messages were delivered vs. actually read.",
          summary: `${sentMessages.length} messages sent — some may still be unread.`,
          rows: [
            { label: "Messages Sent",   value: sentMessages.length },
            { label: "Avg Read Time",   value: "4m"                },
          ],
          table: { headers: ["Message Preview", "Sent To", "Status", "Read After"], rows: readReceiptRows },
        },
        {
          id: "edited-messages",
          name: "Edited Messages Report",
          description: "Messages this user has edited.",
          summary: `Showing recent edits for ${user.fullName}.`,
          rows: [{ label: "Recent Edits", value: editedRows.length === 1 && editedRows[0][0] === "No messages" ? 0 : editedRows.length }],
          table: { headers: ["Message Preview", "Chat With", "Sent At", "Edited At"], rows: editedRows },
        },
        {
          id: "deleted-messages",
          name: "Deleted Messages Report",
          description: "Messages deleted for everyone by this user.",
          summary: `${user.fullName} deleted ${deletedMsgs.length} message(s) for everyone.`,
          rows: [{ label: "Deleted for Everyone", value: deletedMsgs.length }],
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
          summary: `${user.fullName} has ${user.starredMessages.length} starred message(s).`,
          rows: [{ label: "Total Starred", value: user.starredMessages.length }],
          table: { headers: ["Message ID", "Chat With", "Starred On"], rows: starredRows },
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
          summary: user.lastSeen
            ? `${user.fullName} was last seen on ${fmtDate(user.lastSeen)}.`
            : `${user.fullName} is currently online.`,
          rows: [
            { label: "Current Status", value: user.status          },
            { label: "Last Seen",      value: user.lastSeen ? fmtDate(user.lastSeen) : "Online now" },
            { label: "Friends",        value: user.friends.length  },
          ],
          table: { headers: ["Friend", "Last Seen"], rows: friendActivityRows },
        },
        {
          id: "online-time",
          name: "Online Time Report",
          description: "Estimated time this user spent online per day.",
          summary: `${user.fullName} was active for an estimated ${(rand() * 3 + 1).toFixed(1)} hrs today.`,
          rows: [
            { label: "Today",     value: `${(rand() * 4 + 1).toFixed(1)} hrs` },
            { label: "This Week", value: `${(rand() * 20 + 10).toFixed(1)} hrs` },
          ],
          table: { headers: ["Day", "Online Duration"], rows: onlineTimeRows },
        },
      ],
    },
    {
      id: "ai",
      label: "AI Feature Usage",
      color: "pink",
      reports: [
        {
          id: "ai-reply",
          name: "AI Reply Suggestion Usage",
          description: "How often AI suggested quick replies and if they were used.",
          summary: `${user.fullName} used AI suggestions actively this week.`,
          rows: [
            { label: "Suggestions Shown", value: aiRows.reduce((s, r) => s + Number(r[1]), 0) },
            { label: "Used",              value: aiRows.reduce((s, r) => s + Number(r[2]), 0) },
          ],
          table: { headers: ["Day", "Suggestions", "Used"], rows: aiRows },
        },
        {
          id: "ai-summary",
          name: "Conversation Summary Usage",
          description: "How many times this user summarized a chat with AI.",
          summary: `${user.fullName} generated ${summaryRows.length} summary request(s).`,
          rows: [{ label: "Summaries Generated", value: summaryRows[0][0] === "No summaries yet" ? 0 : summaryRows.length }],
          table: { headers: ["Chat With", "Generated On"], rows: summaryRows },
        },
      ],
    },
    {
      id: "personalization",
      label: "Personalization",
      color: "green",
      reports: [
        {
          id: "theme-wallpaper",
          name: "Theme & Wallpaper Changes",
          description: "History of theme and wallpaper changes by this user.",
          summary: `${user.fullName} changed their theme ${themeRows.length} time(s).`,
          rows: [{ label: "Total Changes", value: themeRows.length }],
          table: { headers: ["Change", "New Value", "Changed On"], rows: themeRows },
        },
      ],
    },
    {
      id: "security",
      label: "Account & Security",
      color: "red",
      reports: [
        {
          id: "login-history",
          name: "Login History Report",
          description: "Sign-ins with date, time, and method used.",
          summary: `Last login: ${loginRows[0][0]} via ${loginRows[0][1]}.`,
          rows: [
            { label: "Logins This Week", value: 5 },
            { label: "Sign-Up Method",   value: "Google" },
          ],
          table: { headers: ["Date", "Method", "Device"], rows: loginRows },
        },
        {
          id: "device-session",
          name: "Device / Session Report",
          description: "Devices this user is currently signed in on.",
          summary: `${user.fullName} is signed in on ${sessionRows.length} device(s).`,
          rows: [{ label: "Active Sessions", value: sessionRows.length }],
          table: { headers: ["Device", "Browser / App", "Last Active"], rows: sessionRows },
        },
      ],
    },
  ];
}
