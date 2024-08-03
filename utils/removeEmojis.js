// Function to remove emojis from the title
export const removeEmojis = (text) => {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const textWithoutEmojis = text.replace(emojiRegex, '');
    return textWithoutEmojis;
  };