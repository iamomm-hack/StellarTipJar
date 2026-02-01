// Thank You Message Templates by Tip Tier - No Emojis, Pure Text

const smallTipMessages = [
  "Every drop makes an ocean!",
  "Small gestures, big heart! Thanks!",
  "Appreciate your kindness!",
  "You made my day brighter!",
  "Thanks for the coffee!",
  "Your support means everything!",
];

const mediumTipMessages = [
  "Wow, you're amazing!",
  "This means so much to me!",
  "You're a true supporter!",
  "Thank you for believing in me!",
  "Your generosity is incredible!",
  "You just made my week!",
];

const largeTipMessages = [
  "I'm speechless! You're legendary!",
  "This is absolutely incredible!",
  "You're a superstar supporter!",
  "Massive thanks for this amazing tip!",
  "You just blew my mind!",
  "Forever grateful for your generosity!",
];

// Icon types for celebration - these map to SVG components
const celebrationIconTypes = [
  "sparkle",
  "star",
  "trophy",
  "heart",
  "gift",
  "rocket",
  "party",
];

export const getTipTier = (amount) => {
  const xlm = parseFloat(amount);
  if (xlm < 5) return "small";
  if (xlm <= 20) return "medium";
  return "large";
};

export const getTierLabel = (tier) => {
  switch (tier) {
    case "small":
      return "Supporter";
    case "medium":
      return "Super Supporter";
    case "large":
      return "Legend";
    default:
      return "Supporter";
  }
};

export const getTierColor = (tier) => {
  switch (tier) {
    case "small":
      return "#3b82f6";
    case "medium":
      return "#8b5cf6";
    case "large":
      return "#f59e0b";
    default:
      return "#3b82f6";
  }
};

export const getRandomMessage = (tier) => {
  let messages;
  switch (tier) {
    case "small":
      messages = smallTipMessages;
      break;
    case "medium":
      messages = mediumTipMessages;
      break;
    case "large":
      messages = largeTipMessages;
      break;
    default:
      messages = smallTipMessages;
  }
  return messages[Math.floor(Math.random() * messages.length)];
};

export const getRandomIconType = () => {
  return celebrationIconTypes[
    Math.floor(Math.random() * celebrationIconTypes.length)
  ];
};

export const generateThankYouData = (amount, senderName = null) => {
  const tier = getTipTier(amount);
  const message = getRandomMessage(tier);
  const tierLabel = getTierLabel(tier);
  const tierColor = getTierColor(tier);
  const iconType = getRandomIconType();

  return {
    tier,
    tierLabel,
    tierColor,
    message,
    iconType,
    amount: parseFloat(amount).toFixed(2),
    senderName: senderName || "Anonymous",
    personalizedMessage: senderName
      ? `Thank you, ${senderName}! ${message}`
      : `Thank you! ${message}`,
  };
};
