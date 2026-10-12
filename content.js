// =====================================================================
//  THIS IS THE ONLY FILE YOU EDIT.
//
//  The main page and every project page rebuild themselves from this
//  file each time they load. To add something: copy one { ... } block,
//  paste it at the TOP of its list (newest first), change the text,
//  save, then
//
//      git add -A
//      git commit -m "Update site"
//      git push
//
//  Plain text is fine everywhere. Simple HTML also works inside the
//  quotes, for example <a href='https://...'>a link</a> or <i>italics</i>.
//  Any field you do not need can be left as "" or deleted.
//  Keep the commas between blocks and the quotes around text.
//
//  PROJECT PAGES
//  An item with a "slug" and a "page" block gets its own page at
//  <slug>/index.html, in the style of a paper project page. To make
//  one: copy the folder _template, rename the copy to the slug, and
//  add the "page" block to the item. Images for pages go in images/.
// =====================================================================

window.SITE = {

  // ---------------------------------------------------------------
  //  IS THE PORTFOLIO UP?
  //  true  : the full site shows to everyone
  //  false : visitors see only your name, the holding line and your
  //          links. You can still see everything at preview.html
  //          (or index.html?preview=1). Set to true in March.
  // ---------------------------------------------------------------
  live: false,
  holdingLine: "Portfolio coming soon. In the meantime, find me at the links below.",

  name: "Pavan Sri Harsha Kalluri",

  // Put a photo named photo.jpg next to index.html. Square, around 400x400 px.
  // If the file is missing the page simply shows no photo.
  photo: "photo.jpg",      // also there: photo-bw.jpg (black and white)

  // One string per paragraph.
  bio: [
    "I am a software engineer at Accenture in Hyderabad, where I work on SAP security and automation for an energy client. Outside work I do machine learning research: translation for Telugu that runs on a budget phone, traffic forecasting with coverage guarantees, and competition entries on Kaggle. I studied computer science at GITAM University.",
    "Recent work: the NFL Big Data Bowl 2027, the Gemma 4 Developer Agent Competition (top 7% of 1,993 teams), the ARC Prize 2026, and soil grain-size prediction from photographs (top 3% of 405 teams)."
  ],

  // Links show as icons. The icon is picked from the address automatically
  // (GitHub, Kaggle, LinkedIn, email, Google Scholar, X, YouTube, ORCID, ...).
  // Add { label: "Scholar", url: "https://scholar.google.com/..." } and it just appears.
  links: [
    { label: "Email",    url: "mailto:harshakalluri14@gmail.com" },
    { label: "GitHub",   url: "https://github.com/harshakalluri1403" },
    { label: "Kaggle",   url: "https://www.kaggle.com/harshakalluri14" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/pavan-sri-harsha-kalluri-481123280/" }
  ],

  // ---------------------------------------------------------------
  //  TIMELINE   education and work, newest at the top
  //  logo  : small image on the left, e.g. "images/logos/accenture.png"
  //  when  : the years
  //  what  : bold text, the role or the degree
  //  where : the organisation (becomes a link if url is set)
  //  note  : one short line underneath
  // ---------------------------------------------------------------
  timeline: [
    {
      logo:  "images/logos/accenture.png",
      when:  "2025 –",
      what:  "Associate Software Engineer",
      where: "Accenture",
      url:   "https://www.accenture.com/",
      note:  "SAP security, integration and automation for a Fortune 500 energy client across SAP BTP, AWS and Azure. Employee of the Month."
    },
    {
      logo:  "images/logos/gitam.png",
      when:  "2021 – 2025",
      what:  "B.Tech, Computer Science and Engineering",
      where: "GITAM University, Hyderabad",
      url:   "https://www.gitam.edu/",
      note:  "Internships in 2024: AI research intern at IIITDM Kurnool (plant disease detection) and AI engineer intern at Suvega Technologies (a GPT-powered operations chatbot). Final-year project ranked in the top 3 at GITAM."
    }
  ],

  // ---------------------------------------------------------------
  //  SECTIONS   each one becomes a heading with a list underneath.
  //  Add a new section by adding another { title: "...", items: [...] }.
  //
  //  Each item can have:
  //    title, slug, url, kind, venue, year, authors, description,
  //    image (thumbnail), gif (animated thumbnail shown on hover),
  //    links [ { label, url } ], and page { ... } for its own page.
  //
  //  A page block can have:
  //    authors [ { name, url, affiliation } ], venue, year,
  //    buttons [ { label, url } ], hero { image, caption, width },
  //    abstract (text or a list of paragraphs), abstractTitle,
  //    sections [ { heading, text, image, caption, width } ],
  //    bibtex, status
  // ---------------------------------------------------------------
  sections: [

    // ============================ RESEARCH ============================
    {
      title: "Research & Publications",
      items: [
        {
          title: "Road-Graph Spatio-Temporal Graph Attention for Network-Wide Traffic Flow Forecasting",
          authors: "B. Bhargavi, Pavan Sri Harsha Kalluri, Siri Neeradi, Parusa Srinivas Prasad Rao, Govardhan Annabatula",
          url:   "",
          image: "images/rgstgat.png",
          gif:   "images/rgstgat.gif",
          kind:  "Paper",
          venue: "ICITIIT 2027, under submission",
          year:  "2026",
          description: "Multi-head graph attention restricted to the physical sensor graph, a shared LSTM per sensor and learned time embeddings. Mean absolute error 4–16% below single-branch models on PeMS03, PeMS04 and PeMS08 with about 130K parameters.",
          links: []
        },
        {
          title: "Post-Hoc Ensemble Combination of Spatio-Temporal Traffic Forecasting Models: A Reproducible Study of When and Why It Helps",
          url:   "",
          image: "images/ensemble.png",
          gif:   "images/ensemble.gif",
          authors: "Pavan Sri Harsha Kalluri",
          kind:  "Paper",
          venue: "CODS-COMAD 2026, under submission",
          year:  "2026",
          description: "A validation-only non-negative least squares combination of six independently trained forecasters (STGCN, GraphWaveNet, AGCRN, STID, PDFormer, D2STGNN) improves test MAE by 2.5% over the best single model, with weight stability, error correlation, leave-one-out and bootstrap analyses of why.",
          links: []
        }
      ]
    },

    // ============================ PROJECTS ============================
    {
      title: "Projects",
      items: [
        {
          title: "Transliterate Before You Translate: Code-Mixed Romanized Telugu–English Machine Translation with a Mixing-Aware Benchmark",
          url:   "https://github.com/harshakalluri1403/TeluguCM",
          image: "images/telugucm.png",
          gif:   "images/telugucm.gif",
          authors: "Pavan Sri Harsha Kalluri",
          kind:  "Research project",
          venue: "",
          year:  "2026",
          description: "NLLB-200 returns 74% of romanized code-mixed Telugu comments unchanged. TeluguCM is a mixing-aware benchmark plus transliterate-then-translate pipelines and LoRA fine-tunes that lift chrF++ from 38.2 to 53.2.",
          links: [ { label: "Code", url: "https://github.com/harshakalluri1403/TeluguCM" } ]
        },
        {
          title: "PocketMT: Distilling NLLB-200 into an Offline English–Telugu Translator for Budget Phones",
          url:   "https://github.com/harshakalluri1403/PocketMT",
          image: "images/pocketmt.png",
          gif:   "images/pocketmt.gif",
          authors: "Pavan Sri Harsha Kalluri",
          kind:  "Research project",
          venue: "",
          year:  "2026",
          description: "NLLB-200 distilled into students of 11–52M parameters, quantised to int8 and run on a phone CPU. The 48M student is within 1.4 chrF++ of the teacher while 12× smaller and 22× faster, and an Android app translates a sentence in about 100 ms.",
          links: [ { label: "Code", url: "https://github.com/harshakalluri1403/PocketMT" } ]
        },
        {
          hidden: true,
          title: "Network-wide traffic flow forecasting on the road graph",
          url:   "https://github.com/harshakalluri1403/RG-STGAT",
          image: "images/traffic.png",
          gif:   "images/traffic.gif",
          authors: "Pavan Sri Harsha Kalluri, Siri Neeradi, Parusa Srinivas Prasad Rao, Govardhan Annabatula, B. Bhargavi",
          kind:  "Research project",
          venue: "GITAM University",
          year:  "2025 – 2026",
          description: "The project behind the RG-STGAT and ensemble papers. Four forecasters trained under one strict protocol on PeMS03, PeMS04 and PeMS08 with three seeds each, a 130K-parameter graph attention model that attends only along real roads, and a conformal calibration step that gives every sensor and every hour its promised coverage.",
          links: [ { label: "Code", url: "https://github.com/harshakalluri1403/RG-STGAT" } ]
        },
        {
          title: "Measured in Indianapolis, used on Sunday",
          url:   "https://github.com/harshakalluri1403/BigDataBowl2027",
          image: "images/bdb27.png",
          gif:   "images/bdb27.gif",
          kind:  "Competition entry",
          venue: "NFL Big Data Bowl 2027",
          year:  "2026",
          description: "Which Combine movement signals survive to NFL games, and the one that does not. One extractor for Combine and game tracking: speed transfers, agility barely, first-step burst not at all.",
          links: [ { label: "Code", url: "https://github.com/harshakalluri1403/BigDataBowl2027" }, { label: "Kaggle notebook", url: "https://www.kaggle.com/code/harshakalluri14/bdb27-measured-in-indianapolis-used-on-sunday" } ]
        },
        {
          title: "Autonomous software-engineering agent with Gemma 4",
          url:   "https://www.kaggle.com/competitions/gemma-4-developer-agent",
          image: "images/gemma.png",
          gif:   "images/gemma.gif",
          kind:  "Competition entry",
          venue: "Gemma 4 Developer Agent Competition, Kaggle",
          year:  "2026",
          description: "A Google ADK agent on Gemma 4 31B that resolves real GitHub issues with hidden-test-verified patches, offline, in 4.5 minutes per task. A locate, reproduce, fix, sibling-sweep and verify workflow raised the dev-set resolve rate from 4% to 43%. 137th of 1,993 teams on the public leaderboard, top 7%.",
          links: [ { label: "Competition", url: "https://www.kaggle.com/competitions/gemma-4-developer-agent" } ]
        },
        {
          title: "Test-time-trained LLM reasoner for ARC-AGI-2",
          url:   "https://www.kaggle.com/competitions/arc-prize-2026",
          image: "images/arc.png",
          gif:   "images/arc.gif",
          kind:  "Competition entry",
          venue: "ARC Prize 2026, Kaggle",
          year:  "2026",
          description: "Qwen3-4B with per-task test-time training (rank-256 rsLoRA) over 16 geometric and colour augmentations, depth-first decoding and augmentation-consistency ranking, scoring 30.56 on the public leaderboard. Plus a speculative multi-token DFS decoder and a Tiny Recursive Model second solver.",
          links: [ { label: "Competition", url: "https://www.kaggle.com/competitions/arc-prize-2026" } ]
        },
        {
          title: "Soil grain-size distribution from photographs",
          url:   "https://www.kaggle.com/harshakalluri14",
          image: "images/soil.png",
          gif:   "images/soil.gif",
          kind:  "Competition entry",
          venue: "Kaggle, GRID / BOKU University",
          year:  "2026",
          description: "A physically calibrated vision pipeline: GLCM, LBP and Gabor texture descriptors, watershed grain segmentation and multi-scale DINOv2 embeddings on photos resampled to a common pixels-per-millimetre scale, regressing a 3-parameter Weibull grain-size curve. 10th of 405 teams on the public leaderboard, top 3%.",
          links: [ { label: "Kaggle", url: "https://www.kaggle.com/harshakalluri14" } ]
        },
        {
          hidden: true,
          title: "Coverage at Every Sensor and Every Hour: Seasonally Normalised Adaptive Conformal Prediction for Traffic Forecasting",
          url:   "",
          image: "images/snac.png",
          gif:   "images/snac.gif",
          authors: "Pavan Sri Harsha Kalluri",
          kind:  "Research project",
          venue: "Manuscript in preparation",
          year:  "2026",
          description: "Split conformal prediction covers 90% of traffic forecasts on average while 11–59% of sensors are under-covered. SNAC normalises residuals per sensor and time of day and recalibrates each sensor online with delayed feedback, with a proved coverage bound, and leaves no sensor under-covered.",
          links: []
        },
        {
          title: "Design and Development of Mobile Apps for Farmers to Understand the Diseases and Suitable Pesticides",
          url:   "https://github.com/harshakalluri1403/Plant-Disease-Detection",
          image: "images/plant.png",
          gif:   "images/plant.gif",
          authors: "Pavan Sri Harsha Kalluri",
          kind:  "Internship project",
          venue: "IIITDM Kurnool",
          year:  "2024",
          description: "MobileNetV2, ResNet50 and VGG16 benchmarked on 18,160 PlantVillage images of tomato leaves. MobileNetV2 reached 98.94% validation accuracy as the lightest model and was deployed as a Streamlit app with pesticide advice and nearby plant doctors.",
          links: [ { label: "Code", url: "https://github.com/harshakalluri1403/Plant-Disease-Detection" } ]
        },
        {
          hidden: true,
          title: "Kafka, Airflow and AWS lakehouse pipeline",
          url:   "https://github.com/harshakalluri1403/kafka-airflow-aws-lakehouse",
          kind:  "Project",
          year:  "2025",
          image: "images/lakehouse.png",
          description: "Streaming ingestion with Kafka into an S3 data lake, Glue ETL to Parquet, Athena for analytics and an Airflow DAG that picks the processing path.",
          links: [ { label: "Code", url: "https://github.com/harshakalluri1403/kafka-airflow-aws-lakehouse" } ]
        },
        {
          title: "Real-world violence detection for CCTV and video",
          url:   "https://github.com/harshakalluri1403/Violence-Detection",
          kind:  "Project",
          year:  "2024",
          image: "images/violence.png",
          gif:   "images/violence.gif",
          description: "A fine-tuned VideoMAE video transformer that finds violence in CCTV, phone and broadcast footage and says when and where: one alarm per incident, with Grad-CAM heatmaps on the people involved. 98.2% mean accuracy across four held-out test sets, 90.8% on CCTV it never saw in training, and about 20 live camera streams on one GPU.",
          links: [ { label: "Code", url: "https://github.com/harshakalluri1403/Violence-Detection" } ]
        },
        {
          hidden: true,
          title: "Attendance notification system on AWS",
          url:   "https://github.com/harshakalluri1403/Attendance-Notification-System-Using-AWS",
          kind:  "Project",
          year:  "",
          image: "images/attendance.png",
          description: "Reads the day's attendance from Excel files in S3 and emails every student whether they were present, absent or missing a record, through SES with pandas and boto3.",
          links: [ { label: "Code", url: "https://github.com/harshakalluri1403/Attendance-Notification-System-Using-AWS" } ]
        },
        {
          hidden: true,
          title: "Blockchain-based electronic health records",
          url:   "https://github.com/harshakalluri1403/Blockchain-based-Electronic-health-Record-System-in-Python",
          kind:  "Project",
          year:  "2024",
          image: "images/ehr.png",
          description: "Tamper-evident patient records on a blockchain written in Python, with a web front end.",
          links: [ { label: "Code", url: "https://github.com/harshakalluri1403/Blockchain-based-Electronic-health-Record-System-in-Python" } ]
        },
        {
          hidden: true,
          title: "Motor digital twin on AWS",
          url:   "https://github.com/harshakalluri1403/Motor-Digital-Twin-Using-AWS",
          kind:  "Project",
          year:  "2024",
          image: "images/motor.png",
          description: "A live 3D replica of a factory motor: speed readings stream into AWS IoT SiteWise, IoT TwinMaker binds them to a 3D model, and Grafana shows it in real time.",
          links: [ { label: "Code", url: "https://github.com/harshakalluri1403/Motor-Digital-Twin-Using-AWS" } ]
        }
      ]
    },

    // ====================== HIDDEN UNTIL YOU NEED THEM ======================
    // Sections researchers' pages usually have. "hidden: true" keeps them off
    // the site. Untick Hidden in console.html (or delete the line) to show one.
    // "lines" sections show one dated line per item: when, title, url, description.
    { title: "News",     type: "lines", hidden: true, items: [] },
    { title: "Talks",    type: "lines", hidden: true, items: [] },
    { title: "Teaching", type: "lines", hidden: true, items: [] },
    { title: "Awards",   type: "lines", hidden: true, items: [
      { when: "2026", title: "Top 3% of 405 teams, soil grain-size prediction", url: "https://www.kaggle.com/harshakalluri14" },
      { when: "2026", title: "Top 7% of 1,993 teams, Gemma 4 Developer Agent Competition", url: "https://www.kaggle.com/competitions/gemma-4-developer-agent" },
      { when: "2025", title: "Final-year project ranked top 3 at GITAM University" },
      { when: "2024", title: "Silver medal, AI/ML workshop by IIT Hyderabad and EduFabrica" }
    ] },
    { title: "Service",  type: "lines", hidden: true, items: [] },
    { title: "Writing",  type: "list",  hidden: true, items: [] }
  ],

  // Small grey line at the bottom. Leave "" for none.
  footer: ""

};
