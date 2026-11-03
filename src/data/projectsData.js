export const projects = [
  {
    id: 1,
    title: "Multiome UMAP Integration via Coupling Regularizer",
    summary: "Extended UMAP for single-cell multiome data (RNA + ATAC) with a graph-level coupling regularizer",
    details: [
      "Improved cluster separation by 43–86% over concatenation and WNN baselines on a 34,774-cell dataset",
      "Sparse-matrix pipeline cut memory use by 98.8%"
    ],
    images: ["/images/umap.png"]
  },
  {
    id: 2,
    title: "Neighborhood Mental Health Prevalence Prediction",
    summary: "Predicting poor mental health prevalence across 5,289 New York census tracts using CDC, EPA, and hospital data",
    details: [
      "Led a team of 5 integrating CDC, EPA, and hospital datasets (GeoPandas)",
      "XGBoost and Random Forest models reached 78% F1, with SHAP identifying 10+ key predictors"
    ],
    link: "https://github.com/SodiumMan91/mental-health-prediction"
  },
  {
    id: 3,
    title: "ggplot Neon Theme",
    summary: "Cyberpunk / Neon inspired ggplot theme",
    link: "https://github.com/SodiumMan91/cyberpunk",
    images: ["/images/cpunk.jpg"],
    content: `
Sample use case:

library(ggplot2)
library(cyberpunk)

ggplot(airquality, aes(x = Day,
                       y = Temp,
                       group = as.factor(Month),
                       color = as.factor(Month))) +
    geom_point(size = 2.5) +
    theme_cpunk()
`
  },
  {
    id: 4,
    title: "Exploratory Data Analysis of Golub Gene Expression",
    summary: "Exploring the Golub Gene Expression Dataset. We will explore various EDA techniques to identify significant genes, reduce dimensionality, and derive insights.",
    link: "https://pranavbidve.github.io/golub-gene/"
  }
];
