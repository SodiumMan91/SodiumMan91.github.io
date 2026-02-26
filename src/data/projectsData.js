export const projects = [
  {
    id: 1,
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
    id: 2,
    title: "Multiomics UMAP",
    summary: "Combined, linked UMAP for RNA seq and ATAC embeddings"
  },
  {
    id: 3,
    title: "Mental Health Prediction",
    summary: "Predicting the prevalence of poor mental health in neighborhoods using demographic, socioeconomic, and environmental factors",
    link: "https://github.com/SodiumMan91/mental-health-prediction"
  }
];