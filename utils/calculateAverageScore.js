// Function to calculate the average score
export const calculateAverageScore = (scores) => {
    const validScores = scores.filter(score => score !== null);
    if (validScores.length === 0) return 0;
    const total = validScores.reduce((acc, score) => acc + score, 0);
    return Math.round(total / validScores.length);
  };