// src/utils/export.js
export const exportToCSV = (data) => {
  const csvContent = [
    "Title,Sentiment,Positive,Neutral,Negative",
    ...data.posts.map(
      (post) =>
        `"${post.title.replace(/"/g, '""')}",${post.avg_sentiment},` +
        `${post.sentiment_distribution.positive},` +
        `${post.sentiment_distribution.neutral},` +
        `${post.sentiment_distribution.negative}`
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sentiment-analysis-${data.subreddit}.csv`;
  link.click();
};

export const exportToPDF = (data) => {
  // Implement using pdfmake or similar library
  console.log("PDF export functionality");
};
