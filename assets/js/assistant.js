/* =============================================================
   Nikkat Afrin — portfolio assistant
   Grounded retrieval. Every answer below is written from the
   portfolio / resume content. The model cannot invent anything
   because there is no generative model: it scores the question
   against this knowledge base and returns the best entry.

   PRIVACY RULES BAKED IN:
     - phone number is NOT present anywhere in this file
     - contact answers return email + LinkedIn only
     - anything not covered returns an explicit "not in the
       portfolio" answer instead of a guess
   ============================================================= */
(function () {
  "use strict";

  var EMAIL = "fnunikkatafrin@gmail.com";
  var LINKEDIN = "https://www.linkedin.com/in/nikkat-afrin/";
  var GITHUB = "https://github.com/Nikkat-Afrin";

  /* ---------- knowledge base ---------- */
  // k = keywords (matched loosely), q = suggested phrasing, a = answer (HTML allowed)
  var KB = [
    {
      id: "who",
      k: ["who", "about", "yourself", "intro", "introduce", "summary", "bio", "tell me about nikkat", "background"],
      q: "Who is Nikkat?",
      a: "Nikkat Afrin is an <b>AI &amp; Data Platform Engineer</b> with <b>2+ years</b> of experience building LLM, RAG, speech-AI and cloud-based AI workflows.<br><br>She currently works at <b>Peblink / World Literacy Research Center</b> in New York, where she built a speech-AI reading assessment pipeline that cut review time from <b>60+ minutes to under 5</b>. She's also the <b>first author of SigmaCam</b>, published at <b>IEEE IJCNN 2025</b>.<br><br>She holds an M.S. in Data Analytics &amp; Visualization from Yeshiva University (GPA 3.95) and was a <b>Gold Medalist</b> in her undergraduate degree."
    },
    {
      id: "current",
      k: ["current", "currently", "now", "present", "working", "works", "where does she work", "what does she do now", "employer", "company", "peblink", "wlrc", "current role", "current job"],
      q: "What is she working on now?",
      a: "She's a <b>Data &amp; AI Platform Engineer at Peblink — World Literacy Research Center</b> in New York (since Jan 2026).<br><br>There she:<br>• Reached <b>93% pronunciation-detection accuracy</b> with a speech-AI reading assessment workflow using Whisper / faster-Whisper, FastAPI and Levenshtein similarity<br>• Cut assessment review from <b>60+ minutes to under 5</b> via a serverless AWS pipeline (S3 presigned uploads, SQS, Dockerized Lambda, DynamoDB)<br>• Lets teachers flag <b>dyslexia-risk reading patterns in seconds</b> using transcript alignment and age-normed WPM<br>• Made results analytics-ready in DynamoDB + S3 Parquet, queried via Athena and visualised in QuickSight"
    },
    {
      id: "experience",
      k: ["experience", "work history", "roles", "jobs", "career", "worked", "past", "previous", "employment", "internship", "kayaan", "graduate assistant"],
      q: "Walk me through her experience",
      a: "Five roles across education, logistics and admissions:<br><br><b>1. Data &amp; AI Platform Engineer</b> — Peblink / WLRC · Jan 2026–present<br>Speech-AI reading assessment, serverless AWS pipelines.<br><br><b>2. AI / Data Analyst (Intern)</b> — Peblink / WLRC · May 2025–Jan 2026<br>Architected the WLRC global literacy data hub blueprint in 8 weeks; benchmarked 30+ public sources; secured a <b>Washington D.C. meeting with Congressman Brad Schneider</b>.<br><br><b>3. AI Workflow / Data Engineer (Intern)</b> — KAYAAN Inc. · Aug–Dec 2025<br>n8n AI-agent outreach workflow driving a <b>24% investor connection rate</b>; React dashboard with 15+ KPIs.<br><br><b>4. Graduate Assistant — Data &amp; AI</b> — Yeshiva University, Shevet Glaubach Career Center · Jan–Dec 2025<br>Co-built <b>FELIX</b>, a RAG chatbot; eliminated <b>40+ staff hours/week</b> of manual reporting.<br><br><b>5. Graduate Assistant — AI &amp; Admissions</b> — Yeshiva University, Katz School · Jun 2024–Aug 2025<br>Admissions ChatGPT assistant and Power BI funnel reporting."
    },
    {
      id: "research",
      k: ["research", "paper", "publication", "sigmacam", "ieee", "ijcnn", "tnnls", "published", "academic", "decision boundary", "interpretability"],
      q: "Tell me about her research",
      a: "<b>SigmaCam — Exact Decision Boundary Extraction for DNNs with Smooth Nonlinearities</b><br>First author · Published at <b>IEEE IJCNN 2025</b>.<br><br>Existing tools like SplineCam recover exact decision boundaries only for piecewise-linear (ReLU) networks. SigmaCam closes that gap with a theoretically exact recursive algorithm for <b>smooth activations</b> (Sigmoid, SiLU), reducing runtime <b>~93%</b> while holding <b>~99.8% accuracy</b>.<br><br>It ships as a pip-installable, GPU-accelerated PyTorch package with 8 Colab demos, and won <b>Best Research Project</b> at Yeshiva's Spring 2025 CSE Research Forum.<br><br><a href='https://ieeexplore.ieee.org/abstract/document/11227622' target='_blank' rel='noopener'>Read it on IEEE Xplore →</a>"
    },
    {
      id: "projects",
      k: ["projects", "portfolio", "built", "what has she built", "work samples", "repos", "repositories", "showcase"],
      q: "What projects has she built?",
      a: "Highlights from the projects section:<br><br>• <b>Real-Time Voice Conversational AI</b> — Azure Speech + GPT-4o + RAG over Azure AI Search, streaming over FastAPI/WebSockets<br>• <b>SigmaCam</b> — exact decision boundaries for smooth-activation networks (IEEE IJCNN 2025)<br>• <b>Swap-Hedging Model Explorer</b> — XGBoost at <b>ROC-AUC 0.953</b> with a live threshold slider<br>• <b>Healthcare Provider Network</b> — interactive Tableau dashboards on Tableau Public<br>• <b>E-Commerce Segmentation</b> — K-Means + purchase intent, <b>AUC 0.929</b> over 12,330 sessions<br>• <b>Global HDI Dashboard</b> — 191 countries, R² ≈ 0.98<br>• <b>Climate Indicators ETL</b> — three climate sources merged into one 66-year series<br>• <b>Healthcare Data Platform</b> — PostgreSQL OLTP + SCD2 warehouse + Neo4j graph<br><br>Five of them are <b>live and interactive</b> — look for <b>▶ Try it live</b> on the card, or browse <a href='" + GITHUB + "' target='_blank' rel='noopener'>all 22 repos on GitHub →</a>"
    },
    {
      id: "dashboards",
      k: ["dashboard", "dashboards", "live", "demo", "interactive", "tableau", "try", "see it working"],
      q: "Can I see something live?",
      a: "Yes — five deployments you can use right now. Each one lives on its project card in <b>Selected Work</b> — hit <b>▶ Try it live</b> and it opens right here on the page:<br><br>• <b>Swap-Hedging Explorer</b> — drag the threshold slider, watch precision/recall move<br>• <b>Global HDI Dashboard</b> — hover, zoom and pan 191 countries<br>• <b>E-Commerce Segments</b> — 12,330 sessions, 4 K-Means segments<br>• <b>Climate Indicators</b> — CO₂, temperature anomaly and sea level<br>• <b>Tableau — NYC Provider Network</b> — published to Tableau Public<br><br>They open in an overlay on the page, so there's nothing to install and no tab to lose."
    },
    {
      id: "skills",
      k: ["skills", "tech", "stack", "technologies", "tools", "languages", "programming", "what can she do", "expertise", "proficient"],
      q: "What are her technical skills?",
      a: "<b>AI, GenAI &amp; LLMs</b> — LLMs, RAG, LangChain, ChromaDB, OpenAI APIs, GPT-4/3.5, prompt engineering, Hugging Face, PyTorch, n8n AI agents<br><br><b>Speech &amp; Vision AI</b> — Whisper, faster-Whisper, Amazon Transcribe, transcript alignment, pronunciation scoring, Amazon Rekognition<br><br><b>Cloud &amp; Serverless</b> — AWS (S3, Lambda, SQS, API Gateway, DynamoDB, Cognito, Athena, QuickSight), Azure Functions, Terraform, Docker<br><br><b>Data Engineering</b> — Python, SQL, ETL pipelines, Apache Spark, PySpark, Databricks, Azure Data Factory, Delta Lake, Airflow, data modeling, SCD2<br><br><b>Databases &amp; Backend</b> — PostgreSQL, MS SQL Server, MySQL, DynamoDB, MongoDB, Neo4j, FastAPI, Flask, REST APIs<br><br><b>Analytics &amp; BI</b> — Tableau, Power BI, DAX, Plotly, pandas, NumPy, scikit-learn, hypothesis testing, A/B testing"
    },
    {
      id: "ai_ml",
      k: ["ai", "ml", "machine learning", "llm", "rag", "genai", "deep learning", "nlp", "model", "models"],
      q: "What's her AI/ML background?",
      a: "AI/ML is her core focus, in production rather than just notebooks:<br><br>• <b>Speech AI</b> — Whisper / faster-Whisper pipelines for oral reading assessment at 93% pronunciation-detection accuracy<br>• <b>RAG</b> — co-built <b>FELIX</b> (LangChain + ChromaDB + GPT-4/3.5 on Flask/Azure) answering student Canvas and career questions; RAG over Azure AI Search in her voice-AI system<br>• <b>AI agents</b> — an n8n agent workflow that researched investors and generated personalised outreach, driving a 24% connection rate<br>• <b>Deep learning research</b> — SigmaCam, a PyTorch algorithm for exact decision boundaries (IEEE IJCNN 2025)<br>• <b>Classical ML</b> — XGBoost, Random Forest, SVM, K-Means across a dozen documented projects with reported ROC-AUC"
    },
    {
      id: "education",
      k: ["education", "degree", "study", "studied", "university", "college", "school", "gpa", "yeshiva", "andhra", "masters", "bachelor", "graduate"],
      q: "What's her education?",
      a: "<b>M.S. Data Analytics &amp; Visualization</b><br>Yeshiva University, Katz School of Science &amp; Health · New York<br>GPA <b>3.95</b> · Jan 2024 – Jan 2026<br><br><b>Bachelor of Computer Applications</b><br>Andhra University · India<br>GPA <b>4.0/4.0</b> — graduated as <b>Gold Medalist</b> · Jun 2019 – Jul 2022"
    },
    {
      id: "awards",
      k: ["award", "awards", "recognition", "achievement", "achievements", "honor", "honours", "prize", "won", "finalist", "gold medal", "closeiq"],
      q: "Has she won anything?",
      a: "<b>Best Research Project Award</b> — Yeshiva University, Spring 2025 CSE Research Forum, for the first-author SigmaCam research on AI model transparency.<br><br><b>Innovation Lab Challenge Finalist</b> — Yeshiva University 2025. Selected as <b>1 of 7 finalist teams from 30 teams / 84 registrants</b> to pitch <b>CloseIQ</b>, an AI-powered sales prospecting tool.<br><br><b>Gold Medalist</b> — top of her Bachelor of Computer Applications programme at Andhra University (4.0/4.0)."
    },
    {
      id: "cloud",
      k: ["cloud", "aws", "azure", "gcp", "serverless", "lambda", "infrastructure", "devops", "docker", "terraform"],
      q: "How much cloud experience?",
      a: "Cloud is central to her production work.<br><br><b>AWS</b> — S3 presigned uploads, SQS queues, Dockerized Lambda jobs, DynamoDB, API Gateway, Cognito, Athena, QuickSight. She built the serverless pipeline that took reading assessment from 60+ minutes to under 5.<br><br><b>Azure</b> — Azure Functions, Blob Storage, Databricks and Azure Web Apps for the Symplicity reporting automation; Azure Speech, Azure OpenAI and Azure AI Search in her voice-AI system, deployed to Container Apps with Bicep IaC.<br><br>Also Terraform, Docker, GitHub Actions and serverless architecture generally."
    },
    {
      id: "impact",
      k: ["impact", "results", "metrics", "numbers", "achieved", "outcomes", "quantif", "measurable", "why hire"],
      q: "What measurable impact has she had?",
      a: "The numbers from her roles:<br><br>• <b>60+ min → under 5 min</b> — reading assessment review time<br>• <b>93%</b> pronunciation-detection accuracy<br>• <b>40+ staff hours per week</b> eliminated by automating Symplicity reporting<br>• <b>+12%</b> advising productivity via Power BI dashboards<br>• <b>24%</b> investor connection rate from the n8n AI-agent workflow<br>• <b>~93% runtime reduction</b> with ~99.8% accuracy retained (SigmaCam)<br>• <b>8 weeks</b> to architect the WLRC global literacy data hub blueprint<br>• <b>15+ KPIs</b> surfaced in a React analytics dashboard"
    },
    {
      id: "contact",
      k: ["contact", "reach", "email", "get in touch", "hire", "hiring", "connect", "linkedin", "message", "talk", "recruit", "available", "availability", "opportunity", "opportunities", "opening", "openings", "vacancy", "vacancies", "looking for a job", "looking for work", "open to", "job", "role", "roles", "position"],
      q: "How can I get in touch?",
      a: "She's open to roles and collaboration in <b>AI/ML engineering, data platforms and applied AI research</b>.<br><br>📧 <b>Email</b> — <a href='mailto:" + EMAIL + "'>" + EMAIL + "</a><br>💼 <b>LinkedIn</b> — <a href='" + LINKEDIN + "' target='_blank' rel='noopener'>linkedin.com/in/nikkat-afrin</a><br><br>There's also a contact form at the bottom of this page that goes straight to her inbox."
    },
    {
      id: "resume",
      k: ["resume", "cv", "download", "pdf"],
      q: "Where's her résumé?",
      a: "You can download it from the <b>Résumé</b> button in the hero at the top of this page, or <a href='assets/Nikkat-Afrin-Resume.pdf' target='_blank' rel='noopener'>open the PDF directly →</a>"
    },
    {
      id: "location",
      k: ["location", "where", "based", "city", "live", "new york", "relocate", "remote"],
      q: "Where is she based?",
      a: "<b>New York, USA.</b> She completed her M.S. at Yeshiva University in New York and works there now at Peblink / World Literacy Research Center."
    },
    {
      id: "github",
      k: ["github", "source code", "her code", "open source", "repos", "repositories", "commits", "contributions", "git"],
      q: "What's on her GitHub?",
      a: "<b>22 public repositories</b> at <a href='" + GITHUB + "' target='_blank' rel='noopener'>github.com/Nikkat-Afrin</a> — including SigmaCam (the IEEE paper code), the Azure voice-AI system, and a dozen documented ML and data-engineering projects, several with live dashboards.<br><br>The repo count in the Toolkit section refreshes live from the GitHub API."
    },
    {
      id: "creative",
      k: ["creative", "hobby", "hobbies", "art", "painting", "paintings", "sand", "cooking", "cook", "food", "fun", "outside work", "personal"],
      q: "What does she do outside work?",
      a: "Two things, both on this site:<br><br>🎨 <b>Sand paintings</b> — 12 pieces built up in layers of coloured sand and acrylic. <a href='paintings/'>See the gallery →</a><br><br>🍳 <b>Cooking</b> — 96 dishes, mostly South Indian home cooking. <a href='cooking/'>See the gallery →</a><br><br>As she puts it: same instinct as engineering — take raw, messy pieces and turn them into something meaningful."
    },
    {
      id: "voice_ai",
      k: ["voice", "speech", "whisper", "stt", "tts", "audio", "conversational", "voice ai"],
      q: "Tell me about the voice AI work",
      a: "Two strands.<br><br><b>At work (Peblink)</b> — a speech-AI reading assessment pipeline: children's oral reading is transcribed and aligned with faster-Whisper, then scored with Python text matching, Levenshtein similarity and age-normed WPM. It reaches <b>93% pronunciation-detection accuracy</b> and flags dyslexia-risk patterns in seconds.<br><br><b>As an open-source project</b> — a real-time voice conversational AI on Azure: full-duplex streaming audio over FastAPI/WebSockets, Azure Speech for STT/TTS, GPT-4o for reasoning, and RAG over Azure AI Search, deployed to Container Apps with Bicep IaC. <a href='https://github.com/Nikkat-Afrin/voice-ai-system' target='_blank' rel='noopener'>See the code →</a>"
    },
    {
      id: "data_eng",
      k: ["data engineering", "pipeline", "pipelines", "etl", "warehouse", "spark", "databricks", "airflow", "modeling", "snowflake"],
      q: "What data engineering has she done?",
      a: "• <b>Serverless ingestion at Peblink</b> — S3 presigned uploads → SQS → Dockerized Lambda → DynamoDB, with outputs as S3 Parquet queried through Athena<br>• <b>Symplicity automation</b> — Azure Functions, Blob Storage, PostgreSQL and Databricks pipelines that removed 40+ staff hours of manual reporting a week<br>• <b>WLRC data hub blueprint</b> — AWS data flows, role-based journeys and ingestion pipelines, architected in 8 weeks<br>• <b>Healthcare Data Platform</b> — the same clinical domain modelled three ways: PostgreSQL OLTP, a dimensional warehouse with SCD Type 2 history, and a Neo4j graph<br>• <b>Climate ETL</b> — three independent sources with different cadences and units merged into one analysis-ready 66-year series with explicit data-quality gates"
    }
  ];


  /* which on-page section each answer relates to (for the jump button) */
  var JUMP = {
    who:        { id: "about",      label: "About" },
    current:    { id: "experience", label: "Experience" },
    experience: { id: "experience", label: "Experience" },
    research:   { id: "research",   label: "Research" },
    projects:   { id: "work",       label: "Projects" },
    dashboards: { id: "work",       label: "Projects" },
    skills:     { id: "skills",     label: "Skills" },
    ai_ml:      { id: "skills",     label: "Skills" },
    cloud:      { id: "skills",     label: "Skills" },
    data_eng:   { id: "work",       label: "Projects" },
    voice_ai:   { id: "work",       label: "Projects" },
    impact:     { id: "experience", label: "Experience" },
    education:  { id: "awards",     label: "Education" },
    awards:     { id: "awards",     label: "Awards" },
    github:     { id: "skills",     label: "Toolkit" },
    creative:   { id: "creative",   label: "Creative" },
    contact:    { id: "contact",    label: "Contact" },
    resume:     { id: "top",        label: "Top" },
    location:   { id: "about",      label: "About" }
  };
  // on the gallery / thanks pages there are no sections to scroll to
  function sectionExists(id) { return !!document.getElementById(id); }

  /* answers for things deliberately NOT disclosed */
  var PRIVATE_PATTERNS = /(phone|mobile|cell|number|whatsapp|call her|address|home address|where does she live exactly|salary|compensation|pay|earn|earning|earns|wage|income|ctc|visa|sponsor|age|how old|\\bold\\b|birth|married|marital|relationship|religion|nationality|citizenship)/i;
  var PRIVATE_ANSWER =
    "I only cover what's published on this portfolio, so I can't help with that one.<br><br>For anything personal or role-specific, the best route is to reach out directly:<br>📧 <a href='mailto:" + EMAIL + "'>" + EMAIL + "</a><br>💼 <a href='" + LINKEDIN + "' target='_blank' rel='noopener'>LinkedIn</a>";

  var FALLBACK =
    "I couldn't find that in the portfolio, and I'd rather not guess.<br><br>Try asking about her <b>experience</b>, <b>research</b>, <b>projects</b>, <b>skills</b>, <b>education</b>, <b>awards</b> or <b>how to get in touch</b> — or email her at <a href='mailto:" + EMAIL + "'>" + EMAIL + "</a>.";

  var GREETING = /^(hi|hey|hello|yo|hiya|good (morning|afternoon|evening)|sup|namaste)\b/i;
  var THANKS = /(thank|thanks|thx|cheers|appreciate)/i;

  /* ---------- retrieval ---------- */
  var STOP = {the:1,a:1,an:1,is:1,are:1,was:1,were:1,of:1,to:1,in:1,on:1,for:1,and:1,or:1,
    what:1,whats:1,how:1,does:1,do:1,did:1,her:1,she:1,his:1,he:1,you:1,your:1,me:1,i:1,
    tell:1,about:1,can:1,could:1,would:1,any:1,some:1,with:1,at:1,it:1,this:1,that:1,
    nikkat:1,afrin:1,please:1,know:1,much:1,many:1,has:1,have:1,had:1,be:1,been:1};

  function norm(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }
  function tokens(s) {
    return norm(s).split(" ").filter(function (t) { return t && !STOP[t] && t.length > 1; });
  }
  function score(query, entry) {
    var qn = norm(query), qt = tokens(query), sc = 0;
    var qwords = norm(query).split(" ");
    entry.k.forEach(function (kw) {
      var kn = norm(kw);
      if (!kn) return;
      if (qn === kn) { sc += 14; return; }                    // exact question
      if (kn.indexOf(" ") !== -1) {                           // multi-word: phrase match
        if (qn.indexOf(kn) !== -1) sc += 8;
        return;
      }
      // single word: whole-token match only (never a raw substring of the query,
      // otherwise "know" would match the keyword "now")
      if (qwords.indexOf(kn) !== -1) sc += 6;
      else qt.forEach(function (t) {
        if (t === kn) sc += 6;
        else if (t.length > 4 && kn.length > 4 &&
                 (t.indexOf(kn) === 0 || kn.indexOf(t) === 0)) sc += 2.5;  // stem-ish
      });
    });
    // small boost if the suggested question overlaps
    tokens(entry.q).forEach(function (t) { if (qt.indexOf(t) !== -1) sc += 1; });
    return sc;
  }
  function answer(query) {
    if (PRIVATE_PATTERNS.test(query)) return { a: PRIVATE_ANSWER, id: "private" };
    if (GREETING.test(query.trim()) && tokens(query).length === 0)
      return { a: "Hi! I can tell you about Nikkat's experience, research, projects, skills, education or awards — all from what's published here. What would you like to know?", id: "greet" };
    if (THANKS.test(query) && tokens(query).length <= 2)
      return { a: "Any time. Anything else you'd like to know about her work?", id: "thanks" };

    var best = null, bestScore = 0;
    KB.forEach(function (e) {
      var s = score(query, e);
      if (s > bestScore) { bestScore = s; best = e; }
    });
    if (best && bestScore >= 4) return { a: best.a, id: best.id };
    return { a: FALLBACK, id: "fallback" };
  }

  /* ---------- UI ---------- */
  var CHIPS = ["Who is Nikkat?", "Walk me through her experience", "Tell me about her research",
               "What are her technical skills?", "What projects has she built?", "How can I get in touch?"];

  var css = document.createElement("style");
  css.textContent = [
    "#ab{position:fixed;bottom:22px;right:22px;z-index:150;width:58px;height:58px;border-radius:50%;",
      "border:1px solid var(--line-hi,rgba(34,211,238,.45));cursor:pointer;color:#04050d;font-size:1.45rem;",
      "background:linear-gradient(100deg,#22d3ee,#818cf8 45%,#e879f9);display:grid;place-items:center;",
      "box-shadow:0 10px 34px rgba(34,211,238,.34);transition:transform .25s}",
    "#ab:hover{transform:scale(1.08)}",
    "#ab.hide{display:none}",
    "#ap{position:fixed;bottom:22px;right:22px;z-index:151;width:min(400px,calc(100vw - 32px));",
      "height:min(566px,calc(100vh - 44px));background:rgba(8,12,26,.97);backdrop-filter:blur(18px);",
      "border:1px solid var(--line,rgba(120,160,255,.16));border-radius:18px;display:none;flex-direction:column;",
      "overflow:hidden;box-shadow:0 26px 70px rgba(0,0,0,.62);font-family:'Space Grotesk',-apple-system,Segoe UI,sans-serif}",
    "#ap.on{display:flex}",
    ".ah{padding:15px 17px;border-bottom:1px solid var(--line,rgba(120,160,255,.16));display:flex;align-items:center;gap:11px;flex-shrink:0}",
    ".ah-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(100deg,#22d3ee,#818cf8);",
      "display:grid;place-items:center;color:#04050d;font-weight:700;font-size:.9rem;flex-shrink:0}",
    ".ah-t{font-weight:700;font-size:.94rem;color:#eaf4ff;line-height:1.25}",
    ".ah-s{font-family:'JetBrains Mono',monospace;font-size:.65rem;color:#5e719a;letter-spacing:.06em}",
    ".ah-x{margin-left:auto;background:none;border:0;color:#8fa3c4;font-size:1.25rem;cursor:pointer;padding:4px 6px;line-height:1}",
    ".ah-x:hover{color:#22d3ee}",
    ".am{flex:1;overflow-y:auto;padding:17px;display:flex;flex-direction:column;gap:13px;scrollbar-width:thin}",
    ".am::-webkit-scrollbar{width:6px}.am::-webkit-scrollbar-thumb{background:rgba(120,160,255,.22);border-radius:4px}",
    ".msg{max-width:88%;padding:11px 14px;border-radius:14px;font-size:.885rem;line-height:1.58;word-wrap:break-word}",
    ".msg.b{align-self:flex-start;background:rgba(18,26,52,.85);border:1px solid var(--line,rgba(120,160,255,.16));color:#dbe6f5;border-bottom-left-radius:5px}",
    ".msg.u{align-self:flex-end;background:linear-gradient(100deg,rgba(34,211,238,.17),rgba(129,140,248,.17));",
      "border:1px solid rgba(34,211,238,.3);color:#eaf4ff;border-bottom-right-radius:5px}",
    ".msg a{color:#22d3ee;text-decoration:none;border-bottom:1px solid rgba(34,211,238,.35)}",
    ".msg a:hover{color:#a5f3fc}",
    ".msg b{color:#eaf4ff}",
    ".chips{display:flex;flex-wrap:wrap;gap:7px;padding:0 17px 13px;flex-shrink:0}",
    ".chip{background:rgba(18,26,52,.8);border:1px solid var(--line,rgba(120,160,255,.16));color:#8fa3c4;",
      "padding:6px 12px;border-radius:100px;font-size:.755rem;cursor:pointer;transition:.22s;",
      "font-family:'Space Grotesk',sans-serif}",
    ".chip:hover{border-color:rgba(34,211,238,.45);color:#22d3ee}",
    ".af{padding:13px 15px;border-top:1px solid var(--line,rgba(120,160,255,.16));display:flex;gap:9px;flex-shrink:0}",
    ".af input{flex:1;background:rgba(10,15,32,.85);border:1px solid var(--line,rgba(120,160,255,.16));",
      "border-radius:100px;padding:10px 15px;color:#dbe6f5;font-size:.865rem;font-family:'Space Grotesk',sans-serif}",
    ".af input:focus{outline:none;border-color:#22d3ee}",
    ".af button{width:39px;height:39px;border-radius:50%;border:0;cursor:pointer;color:#04050d;flex-shrink:0;",
      "background:linear-gradient(100deg,#22d3ee,#818cf8);font-size:1rem;display:grid;place-items:center}",
    ".af button:disabled{opacity:.45;cursor:default}",
    ".typing{display:flex;gap:4px;align-items:center;padding:12px 15px}",
    ".typing i{width:6px;height:6px;border-radius:50%;background:#22d3ee;display:block;animation:tp 1.3s infinite}",
    ".typing i:nth-child(2){animation-delay:.18s}.typing i:nth-child(3){animation-delay:.36s}",
    "@keyframes tp{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}",
    ".jump{margin-top:11px;display:inline-flex;align-items:center;gap:7px;background:rgba(34,211,238,.1);",
      "border:1px solid rgba(34,211,238,.34);color:#22d3ee;padding:6px 13px;border-radius:100px;",
      "font-size:.76rem;font-weight:600;cursor:pointer;font-family:'Space Grotesk',sans-serif;transition:.22s}",
    ".jump:hover{background:rgba(34,211,238,.2);transform:translateX(2px)}",
    ".hl{animation:hl 2.4s ease-out 1}",
    "@keyframes hl{0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,0)}18%{box-shadow:0 0 0 3px rgba(34,211,238,.5)}}",
    ".note{font-family:'JetBrains Mono',monospace;font-size:.63rem;color:#46587c;text-align:center;padding:0 17px 9px;flex-shrink:0}",
    "@media(max-width:520px){#ap{height:calc(100vh - 26px);bottom:13px;right:13px}}",
    "@media(prefers-reduced-motion:reduce){#ab,.typing i{animation:none;transition:none}}"
  ].join("");
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.id = "ab"; btn.setAttribute("aria-label", "Ask about Nikkat"); btn.innerHTML = "✦";

  var panel = document.createElement("div");
  panel.id = "ap"; panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Portfolio assistant");
  panel.innerHTML =
    '<div class="ah"><div class="ah-av">NA</div>' +
      '<div><div class="ah-t">Ask about Nikkat</div></div>' +
      '<button class="ah-x" aria-label="Close">✕</button></div>' +
    '<div class="am" id="am"></div>' +
    '<div class="chips" id="chips"></div>' +
    '<form class="af" id="af"><input id="ai" placeholder="Ask a question…" autocomplete="off" ' +
      'aria-label="Your question"><button type="submit" aria-label="Send">→</button></form>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var box = panel.querySelector("#am"),
      chips = panel.querySelector("#chips"),
      form = panel.querySelector("#af"),
      input = panel.querySelector("#ai");

  function add(html, who) {
    var d = document.createElement("div");
    d.className = "msg " + (who === "u" ? "u" : "b");
    d.innerHTML = html;
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
    return d;
  }
  function typing() {
    var d = document.createElement("div");
    d.className = "msg b typing";
    d.innerHTML = "<i></i><i></i><i></i>";
    box.appendChild(d); box.scrollTop = box.scrollHeight;
    return d;
  }
  function renderChips(list) {
    chips.innerHTML = "";
    list.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.textContent = c;
      b.onclick = function () { ask(c); };
      chips.appendChild(b);
    });
  }

  /* scroll the page to a section while leaving the answer on screen */
  function goTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var narrow = window.matchMedia("(max-width: 620px)").matches;
    if (narrow) close();               // on phones the panel covers the page
    setTimeout(function () {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("hl");
      setTimeout(function () { el.classList.remove("hl"); }, 2500);
    }, narrow ? 210 : 0);
  }

  function ask(q) {
    q = String(q || "").trim();
    if (!q) return;
    add(q.replace(/</g, "&lt;"), "u");
    input.value = "";
    var t = typing();
    setTimeout(function () {
      t.remove();
      var res = answer(q);
      var bubble = add(res.a, "b");

      // add a "jump to section" button when the answer maps to a section on this page
      var j = JUMP[res.id];
      if (j && sectionExists(j.id)) {
        var btnJ = document.createElement("button");
        btnJ.className = "jump";
        btnJ.type = "button";
        btnJ.innerHTML = "Jump to " + j.label + " \u2192";
        btnJ.onclick = function () { goTo(j.id); };
        bubble.appendChild(document.createElement("br"));
        bubble.appendChild(btnJ);
        box.scrollTop = box.scrollHeight;
      }
      renderChips(CHIPS.filter(function (c) { return c.toLowerCase() !== q.toLowerCase(); }).slice(0, 4));
    }, 420 + Math.random() * 280);
  }

  var opened = false;
  function open() {
    panel.classList.add("on"); btn.classList.add("hide");
    if (!opened) {
      opened = true;
      add("Hi! I'm Nikkat's portfolio assistant. I answer <b>only</b> from what's published here — her résumé, projects, research and GitHub.<br><br>What would you like to know?", "b");
      renderChips(CHIPS.slice(0, 4));
    }
    setTimeout(function () { input.focus(); }, 90);
  }
  function close() { panel.classList.remove("on"); btn.classList.remove("hide"); }

  btn.onclick = open;
  panel.querySelector(".ah-x").onclick = close;
  form.onsubmit = function (e) { e.preventDefault(); ask(input.value); };
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("on")) close();
  });
})();
