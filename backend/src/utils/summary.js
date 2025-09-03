

const generateLocalSummary = (transcript) => {
    if (!transcript) return '';
    if (transcript.length < 100) return transcript;
  
    const sentences = transcript
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);
  
    if (sentences.length <= 2) {
      return transcript;
    }
  
    // Word frequency map
    const words = transcript.toLowerCase().split(/\s+/);
    const wordFreq = {};
    for (const word of words) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  
    // Score sentences
    const scoredSentences = sentences.map((sentence, index) => {
      const sentenceWords = sentence.toLowerCase().split(/\s+/);
      let score = 0;
      for (const word of sentenceWords) {
        score += wordFreq[word] || 0;
      }
      // Boost early sentences
      if (index < 2) score *= 1.5;
  
      return { sentence, score: score / sentenceWords.length };
    });
  
    // Pick top 3
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(3, sentences.length))
      .map(item => item.sentence);
  
    return topSentences.join('. ') + '.';
  };

module.exports = {
    generateLocalSummary
}