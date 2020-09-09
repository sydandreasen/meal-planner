export const loadingMessage = () => {
  const options = [
    // "Good habits take time, and so does loading this page.",
    // "Don't rush life; live in the present. Always, but especially now because we aren't ready for you yet.",
    // `"Patience is a bitter plant that produces sweet fruit." - Charles R. Swindoll`,
    // "Preparing to support your meal planning dreams...",
    // "You're too fast for us! Give us a moment to catch up.",
    "Loading your Dashboard...",
  ];
  const random = Math.floor(Math.random() * options.length);
  return options[random];
};
