export const journeyItems = [
  {
    id: 1,
    type: "education",
    title: "Columbia University",
    subtitle: "M.S. Data Science",
    start: { month: 9, year: 2024 },
    end: { month: 12, year: 2025 },
    details: [
      "GPA: 3.62 / 4.0",
      "President, Data Science Institute Student Council",
      "Teaching Assistant, Deep Learning for NLP (IEOR E4573)",
      "Coursework: Statistical Inference & Modeling, Probability & Statistics, Machine Learning for Functional Genomics"
    ],
    images: ["/images/dsi1.png", "/images/dsi2.jpg", "/images/dsi3.jpg"]
  },
  {
    id: 2,
    type: "experience",
    title: "EXL Services",
    subtitle: "Business Data Analyst",
    start: { month: 11, year: 2023 },
    end: { month: 8, year: 2024 },
    details: [
      "Improved Probability of Default model accuracy by 10% through feature diagnostics and statistical analysis on 500K+ records; validated and deployed enhancements with model owners and presented to senior leadership",
      "Re-engineered credit risk pipelines (CCAR, CECL) in SQL and automated SAS workflows, cutting processing time by 15% and reducing manual errors"
    ],
    images: []
  },
  {
    id: 3,
    type: "education",
    title: "Delhi Technological University",
    subtitle: "B.Tech. Mathematics & Computing",
    start: { month: 8, year: 2019 },
    end: { month: 5, year: 2023 },
    details: [
      "GPA: 8.92 / 10 (top 5% of cohort)"
    ],
    images: []
  },
  {
    id: 4,
    type: "experience",
    title: "Bendesky Lab, Zuckerman Institute, Columbia University",
    subtitle: "Research Assistant (MS Capstone)",
    start: { month: 9, year: 2025 },
    end: { month: 12, year: 2025 },
    details: [
      "Built a scalable YOLOv8 inference pipeline with trajectory smoothing (median filter, Gaussian, cubic spline) to stabilize frame-level detections across hundreds of hours of video",
      "Integrated detection, outlier removal, and classification into one end-to-end workflow for tracking and analyzing behavior of real and 3D printed fish"
    ],
    images: ["/images/Betta-fish.png"],
    link: { url: "https://drive.google.com/file/d/1kryghI-92uplHDxzF9cz1faNnTNqK5qo/view?usp=sharing", label: "Poster" }
  },
  {
    id: 5,
    type: "experience",
    title: "Mailman School of Public Health, Columbia University",
    subtitle: "Machine Learning Research Assistant",
    start: { month: 5, year: 2025 },
    end: { month: 12, year: 2025 },
    details: [
      "Built a hierarchical ensemble NLP pipeline combining VADER lexicon scoring with fine-tuned BERT-based transformers to classify substance-use phenotypes in large-scale text data",
      "Improved classification accuracy by 23% over baselines via sentence-level contextual aggregation; worked with epidemiologists on annotation schema and label validation"
    ],
    images: []
  },
  {
    id: 6,
    type: "experience",
    title: "Microsoft",
    subtitle: "CX Research Intern",
    start: { month: 3, year: 2025 },
    end: { month: 5, year: 2025 },
    details: [
      "Mapped AI applications in customer research and cybersecurity from internal documentation and industry benchmarks",
      "Proposed AI-driven evaluation metrics and investment recommendations to senior cross-functional stakeholders in biweekly reports"
    ],
    images: []
  },
  {
    id: 7,
    type: "experience",
    title: "IFFCO Tokio General Insurance Co. Ltd.",
    subtitle: "Machine Learning Engineer Intern",
    start: { month: 5, year: 2022 },
    end: { month: 7, year: 2022 },
    details: [
      "Built a Mask R-CNN + InceptionV3 computer vision pipeline for automated damage detection and repair cost estimation, cutting adjudication time for low-value claims from 3 weeks to 3 days",
      "Developed an XGBoost + regression customer retention model that improved retention by 7%"
    ],
    images: []
  },
  {
    id: 8,
    type: "experience",
    title: "Centre for AI and Robotics, DRDO",
    subtitle: "Student Research Trainee",
    start: { month: 5, year: 2021 },
    end: { month: 9, year: 2021 },
    details: [
      "Extended a semi-supervised Snowball model for relation extraction from 10K+ sentences (NLTK, Gensim)",
      "Boosted F1 by 15% over unsupervised baselines via ensembling and successive-halving tuning across 60+ experiments; presented at NCETET 2023"
    ],
    images: []
  },
  {
    id: 9,
    type: "experience",
    title: "Cheng Lab, Columbia Stem Cell Initiative",
    subtitle: "Data Analyst & Research Assistant",
    start: { month: 2, year: 2026 },
    details: [
      "Analyze in vivo vs. in vitro transcriptomic and single-cell RNA-seq datasets to identify metabolic drivers of early-onset colorectal cancer; found reduced Hmgcs2 in Crohn's disease patients and used results to guide experimental design",
      "Contribute to an exfoliome-based biomarker panel; presented findings in 4 oral presentations at Columbia research symposia"
    ],
    images: []
  }
];
