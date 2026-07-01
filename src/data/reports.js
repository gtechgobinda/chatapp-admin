export const REPORT_CATEGORIES = [
  {
    id: "friends",
    label: "Friends & Connections",
    color: "violet",
    reports: [
      {
        id: "friend-requests",
        name: "Friend Request Report",
        description: "Every friend request sent or received, with date and status.",
        summary: "You sent 12 friend requests this month — 8 accepted, 3 pending, 1 rejected.",
        rows: [
          { label: "Total Sent",     value: 12 },
          { label: "Accepted",       value: 8  },
          { label: "Pending",        value: 3  },
          { label: "Rejected",       value: 1  },
        ],
        table: {
          headers: ["User", "Direction", "Status", "Date"],
          rows: [
            ["Priya Sharma",   "Sent",     "accepted", "28 Jun 2025"],
            ["Rohit Das",      "Sent",     "pending",  "30 Jun 2025"],
            ["Karan Patel",    "Received", "accepted", "25 Jun 2025"],
            ["Vikram Nair",    "Sent",     "rejected", "20 Jun 2025"],
            ["Ananya Bose",    "Received", "pending",  "01 Jul 2025"],
          ],
        },
      },
      {
        id: "block-unblock",
        name: "Block / Unblock Report",
        description: "History of users blocked or unblocked — by you or against you.",
        summary: "Rahul blocked you on 12 Jun and unblocked you on 20 Jun (blocked 1 time).",
        rows: [
          { label: "Times Blocked by Others", value: 1 },
          { label: "Times You Blocked",       value: 3 },
          { label: "Times Unblocked",         value: 2 },
        ],
        table: {
          headers: ["User", "Action", "Date"],
          rows: [
            ["Karan Patel",  "Blocked by user",   "10 Jun 2025"],
            ["Meera Joshi",  "Blocked by user",   "15 Jun 2025"],
            ["Karan Patel",  "Unblocked by user", "22 Jun 2025"],
            ["Divya Reddy",  "Blocked by user",   "29 Jun 2025"],
          ],
        },
      },
      {
        id: "blocked-by-me",
        name: "Blocked By Me Report",
        description: "All users you currently have blocked, with the date they were blocked.",
        summary: "You have 3 users blocked right now.",
        rows: [
          { label: "Currently Blocked", value: 3 },
        ],
        table: {
          headers: ["User", "Email", "Blocked On"],
          rows: [
            ["Karan Patel", "karan.patel@gmail.com",   "22 Jun 2025"],
            ["Meera Joshi", "meera.joshi@gmail.com",   "15 Jun 2025"],
            ["Divya Reddy", "divya.reddy@gmail.com",   "29 Jun 2025"],
          ],
        },
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
        description: "Messages sent and received per chat, per day/week/month.",
        summary: "You exchanged 240 messages with Priya this week.",
        rows: [
          { label: "Total Sent",     value: 312 },
          { label: "Total Received", value: 289 },
          { label: "This Week",      value: 240 },
          { label: "Today",          value: 34  },
        ],
        table: {
          headers: ["Chat With", "Sent", "Received", "Total"],
          rows: [
            ["Priya Sharma",  "128", "112", "240"],
            ["Rohit Das",     "74",  "68",  "142"],
            ["Sneha Iyer",    "56",  "61",  "117"],
            ["Karan Patel",   "54",  "48",  "102"],
          ],
        },
      },
      {
        id: "read-receipts",
        name: "Read Receipt Report",
        description: "Which messages were only delivered vs. actually seen, and how long it took.",
        summary: "5 messages sent today are delivered but not yet read.",
        rows: [
          { label: "Delivered & Read",     value: 290 },
          { label: "Delivered, Unread",    value: 5   },
          { label: "Avg Read Time (mins)", value: "4m" },
        ],
        table: {
          headers: ["Message Preview", "Sent To", "Status", "Read After"],
          rows: [
            ["Hey! How are you?",    "Priya Sharma", "Read",      "2 min"],
            ["Meeting at 3pm?",      "Rohit Das",    "Read",      "8 min"],
            ["Check this out!",      "Sneha Iyer",   "Delivered", "—"],
            ["Sounds good!",         "Ananya Bose",  "Read",      "1 min"],
            ["Can we talk later?",   "Vikram Nair",  "Delivered", "—"],
          ],
        },
      },
      {
        id: "edited-messages",
        name: "Edited Messages Report",
        description: "Messages you edited, with original send time and edit time.",
        summary: "You edited 4 messages in the last 7 days.",
        rows: [
          { label: "Edited Last 7 Days", value: 4 },
          { label: "Edited This Month",  value: 9 },
        ],
        table: {
          headers: ["Message Preview", "Chat With", "Sent At", "Edited At"],
          rows: [
            ["Hey how are you doing",  "Priya Sharma", "30 Jun 09:00", "30 Jun 09:02"],
            ["Meeting tmrw at 3",      "Rohit Das",    "29 Jun 14:00", "29 Jun 14:05"],
            ["Sounds good bro",        "Karan Patel",  "28 Jun 18:10", "28 Jun 18:12"],
            ["Ok will call you later", "Sneha Iyer",   "27 Jun 21:00", "27 Jun 21:03"],
          ],
        },
      },
      {
        id: "deleted-messages",
        name: "Deleted Messages Report",
        description: "Messages you deleted — split into Deleted for Me and Deleted for Everyone.",
        summary: "You deleted 2 messages for everyone this month.",
        rows: [
          { label: "Deleted for Me",       value: 11 },
          { label: "Deleted for Everyone", value: 2  },
        ],
        table: {
          headers: ["Chat With", "Deleted At", "Type"],
          rows: [
            ["Priya Sharma", "30 Jun 10:00", "For Everyone"],
            ["Rohit Das",    "28 Jun 15:00", "For Me"],
            ["Sneha Iyer",   "26 Jun 09:30", "For Everyone"],
            ["Ananya Bose",  "25 Jun 22:00", "For Me"],
          ],
        },
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
        description: "Chats currently archived and when each one was archived.",
        summary: "You have 6 chats archived, oldest since March.",
        rows: [
          { label: "Total Archived", value: 6 },
          { label: "Oldest Archive", value: "Mar 2025" },
        ],
        table: {
          headers: ["Chat With", "Archived On"],
          rows: [
            ["Arjun Kapoor",  "05 Mar 2025"],
            ["Ananya Bose",   "12 Apr 2025"],
            ["Sneha Iyer",    "01 May 2025"],
            ["Rohit Das",     "20 May 2025"],
            ["Divya Reddy",   "10 Jun 2025"],
            ["Meera Joshi",   "28 Jun 2025"],
          ],
        },
      },
      {
        id: "muted",
        name: "Muted Conversations Report",
        description: "Chats that are muted, duration, and when the mute ends.",
        summary: "Work Group is muted for 5 more days.",
        rows: [
          { label: "Currently Muted", value: 2 },
        ],
        table: {
          headers: ["Chat With", "Muted Since", "Mute Ends"],
          rows: [
            ["Priya Sharma",   "28 Jun 2025", "Forever"],
            ["Ananya Bose",    "30 Jun 2025", "08 Jul 2025"],
          ],
        },
      },
      {
        id: "pinned",
        name: "Pinned Messages Report",
        description: "All messages currently pinned across all chats.",
        summary: "You have 3 pinned messages across 2 chats.",
        rows: [
          { label: "Total Pinned", value: 3 },
          { label: "Across Chats", value: 2 },
        ],
        table: {
          headers: ["Message Preview", "Chat With", "Pinned On"],
          rows: [
            ["Check this out!",       "Rohit Das",   "29 Jun 2025"],
            ["Meeting at 3pm?",       "Sneha Iyer",  "28 Jun 2025"],
            ["Can we talk later?",    "Sneha Iyer",  "27 Jun 2025"],
          ],
        },
      },
      {
        id: "starred",
        name: "Starred Messages Report",
        description: "Every message you have starred / bookmarked, across all chats.",
        summary: "You have 18 starred messages saved.",
        rows: [
          { label: "Total Starred", value: 18 },
        ],
        table: {
          headers: ["Message Preview", "Chat With", "Starred On"],
          rows: [
            ["Hey! How are you doing?", "Priya Sharma", "30 Jun 2025"],
            ["I'm great! You?",         "Priya Sharma", "30 Jun 2025"],
            ["Check this out!",         "Rohit Das",    "29 Jun 2025"],
            ["Sounds good!",            "Karan Patel",  "28 Jun 2025"],
            ["Can we talk later?",      "Divya Reddy",  "27 Jun 2025"],
          ],
        },
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
        description: "When you or a friend was last active.",
        summary: "You were last active 10 minutes ago.",
        rows: [
          { label: "Your Last Active",     value: "10 min ago" },
          { label: "Days Active This Week", value: 6 },
        ],
        table: {
          headers: ["Friend", "Last Seen"],
          rows: [
            ["Priya Sharma",  "30 Jun 2025, 14:15"],
            ["Sneha Iyer",    "29 Jun 2025, 20:00"],
            ["Ananya Bose",   "28 Jun 2025, 18:45"],
            ["Meera Joshi",   "30 Jun 2025, 22:10"],
            ["Divya Reddy",   "01 Jul 2025, 02:30"],
          ],
        },
      },
      {
        id: "status-history",
        name: "Status Message History Report",
        description: "Custom status messages the user has set over time.",
        summary: "You changed your status 5 times this week: 'Busy', 'At work', ...",
        rows: [
          { label: "Changes This Week",  value: 5 },
          { label: "Changes This Month", value: 14 },
        ],
        table: {
          headers: ["Status Text", "Set On", "Duration"],
          rows: [
            ["Busy",            "01 Jul 2025", "Active now"],
            ["At work",         "30 Jun 2025", "8 hrs"],
            ["In a meeting",    "29 Jun 2025", "2 hrs"],
            ["Available",       "28 Jun 2025", "6 hrs"],
            ["Do not disturb",  "27 Jun 2025", "4 hrs"],
          ],
        },
      },
      {
        id: "online-time",
        name: "Online Time Report",
        description: "Estimated time spent online per day or week.",
        summary: "You were active for about 3.5 hours today.",
        rows: [
          { label: "Today",      value: "3.5 hrs" },
          { label: "This Week",  value: "18 hrs"  },
          { label: "This Month", value: "64 hrs"  },
        ],
        table: {
          headers: ["Date", "Online Duration"],
          rows: [
            ["01 Jul 2025", "3.5 hrs"],
            ["30 Jun 2025", "4.2 hrs"],
            ["29 Jun 2025", "2.8 hrs"],
            ["28 Jun 2025", "3.1 hrs"],
            ["27 Jun 2025", "4.4 hrs"],
          ],
        },
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
        name: "AI Reply Suggestion Usage Report",
        description: "How often AI suggested quick replies and how often you used one.",
        summary: "AI suggested replies 40 times this week; you used one 15 times.",
        rows: [
          { label: "Suggestions Shown", value: 40 },
          { label: "Used",              value: 15 },
          { label: "Ignored",           value: 25 },
          { label: "Usage Rate",        value: "37%" },
        ],
        table: {
          headers: ["Date", "Suggestions", "Used"],
          rows: [
            ["01 Jul 2025", "8",  "3"],
            ["30 Jun 2025", "10", "4"],
            ["29 Jun 2025", "7",  "2"],
            ["28 Jun 2025", "9",  "4"],
            ["27 Jun 2025", "6",  "2"],
          ],
        },
      },
      {
        id: "ai-summary",
        name: "Conversation Summary Usage Report",
        description: "How many times you asked the app to summarize a long chat.",
        summary: "You generated 6 chat summaries this month.",
        rows: [
          { label: "Summaries This Month", value: 6 },
          { label: "Summaries Total",      value: 18 },
        ],
        table: {
          headers: ["Chat With", "Summary Generated On"],
          rows: [
            ["Priya Sharma", "28 Jun 2025"],
            ["Sneha Iyer",   "25 Jun 2025"],
            ["Rohit Das",    "20 Jun 2025"],
            ["Karan Patel",  "15 Jun 2025"],
            ["Meera Joshi",  "10 Jun 2025"],
            ["Vikram Nair",  "05 Jun 2025"],
          ],
        },
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
        name: "Theme & Wallpaper Change Report",
        description: "History of accent colors and wallpapers the user has chosen.",
        summary: "You changed your theme 4 times; current: Ocean Blue.",
        rows: [
          { label: "Theme Changes",     value: 4 },
          { label: "Current Theme",     value: "Ocean Blue" },
          { label: "Wallpaper Changes", value: 2 },
        ],
        table: {
          headers: ["Change", "New Value", "Changed On"],
          rows: [
            ["Theme",     "Ocean Blue",  "29 Jun 2025"],
            ["Wallpaper", "Mountains",   "20 Jun 2025"],
            ["Theme",     "Deep Purple", "10 Jun 2025"],
            ["Theme",     "Emerald",     "01 Jun 2025"],
            ["Theme",     "Rose Gold",   "15 May 2025"],
          ],
        },
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
        description: "Sign-ins with date, time, and method used (Google or email/password).",
        summary: "Last login: today, 9:14 AM, via Google.",
        rows: [
          { label: "Total Logins This Month", value: 22 },
          { label: "Unique Devices",          value: 2  },
        ],
        table: {
          headers: ["Date & Time", "Method", "Device"],
          rows: [
            ["01 Jul 2025, 09:14", "Google",         "MacBook Pro"],
            ["30 Jun 2025, 08:50", "Google",         "iPhone 15"],
            ["29 Jun 2025, 10:02", "Email/Password", "MacBook Pro"],
            ["28 Jun 2025, 09:30", "Google",         "MacBook Pro"],
            ["27 Jun 2025, 08:45", "Google",         "iPhone 15"],
          ],
        },
      },
      {
        id: "signup-method",
        name: "Sign-Up Method Report",
        description: "How the account was originally created — Google popup or email/password.",
        summary: "Account created via Google sign-up on 3 May.",
        rows: [
          { label: "Sign-Up Method", value: "Google" },
          { label: "Account Created", value: "03 May 2025" },
        ],
        table: {
          headers: ["Detail", "Value"],
          rows: [
            ["Method",       "Google OAuth"],
            ["Created On",   "03 May 2025"],
            ["Email",        "user@gmail.com"],
          ],
        },
      },
      {
        id: "device-session",
        name: "Device / Session Report",
        description: "Which devices or browsers you are currently signed in on.",
        summary: "You are signed in on 2 devices: Mac, iPhone.",
        rows: [
          { label: "Active Sessions", value: 2 },
        ],
        table: {
          headers: ["Device", "Browser / App", "Last Active"],
          rows: [
            ["MacBook Pro",  "Chrome 125",     "01 Jul 2025, 09:14"],
            ["iPhone 15",    "ChatKoro App",   "30 Jun 2025, 21:00"],
          ],
        },
      },
    ],
  },
];

export const COLOR_MAP = {
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-500" },
  blue:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-700",   dot: "bg-blue-500"   },
  green:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  badge: "bg-green-100 text-green-700", dot: "bg-green-500"  },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-100 text-orange-700",dot: "bg-orange-500" },
  pink:   { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",   badge: "bg-pink-100 text-pink-700",   dot: "bg-pink-500"   },
  red:    { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",     badge: "bg-red-100 text-red-700",    dot: "bg-red-500"    },
};
