export const TAG_DEFINITIONS = {
  nocode:        { label: "No Code",         emoji: "🖱️", color: "#059669" },
  cli:           { label: "CLI",             emoji: "💻", color: "#6366f1" },
  code:          { label: "Code Required",   emoji: "📝", color: "#d97706" },
  ml:            { label: "ML",              emoji: "🤖", color: "#dc2626" },
  ai:            { label: "AI / LLM",        emoji: "✨", color: "#7c3aed" },
  deterministic: { label: "Deterministic",   emoji: "⚙️", color: "#475569" },
  gpu:           { label: "GPU Recommended", emoji: "⚡", color: "#ea580c" },
};

export const NODES = {
  root: {
    question: "What are you trying to do?",
    subtitle: "Start with your cognitive goal — not the tool or method.",
    options: [
      { label: "FIND", desc: "Retrieve existing information, knowledge, or data", next: "find", icon: "🔍", color: "#2563eb" },
      { label: "PREDICT", desc: "Estimate an unknown quantity from known inputs", next: "predict", icon: "🎯", color: "#dc2626" },
      { label: "GENERATE", desc: "Create something new that doesn't yet exist", next: "generate", icon: "✨", color: "#7c3aed" },
      { label: "OPTIMIZE", desc: "Find the best option through iterative search or experimentation", next: "optimize", icon: "📈", color: "#059669" },
      { label: "UNDERSTAND", desc: "Discover structure, patterns, or relationships in data", next: "understand", icon: "🧩", color: "#d97706" },
      { label: "AUTOMATE", desc: "Replace repetitive human effort with an AI-driven pipeline", next: "automate", icon: "🤖", color: "#0891b2" },
      { label: "COMMUNICATE", desc: "Write, illustrate, present, or explain your work", next: "communicate", icon: "✍️", color: "#be185d" },
    ],
  },

  // ═══════════════════════════════════════
  // FIND
  // ═══════════════════════════════════════
  find: {
    question: "What are you looking for?",
    paradigmBanner: { label: "Information Retrieval / RAG", color: "#2563eb", explanation: "These tools combine search over large databases with AI synthesis. The AI finds and summarizes relevant sources rather than generating answers from training data alone. (Clinic 1, Section 2.7)" },
    options: [
      { label: "Answers from the scientific literature", next: "find_lit" },
      { label: "Biological sequences, structures, or database records", next: "find_seq" },
      { label: "Similar molecules, proteins, or data points", next: "find_similar" },
      { label: "Information within my own documents / notes", next: "find_internal" },
      { label: "Something else", next: "find_general" },
    ],
  },
  find_general: {
    terminal: true, title: "General Information Retrieval",
    paradigmBanner: { label: "Information Retrieval / RAG", color: "#2563eb", explanation: "If you need to find specific information from a large corpus — whether databases, file systems, or unstructured text — the general pattern is: index your data, embed queries, retrieve relevant chunks, and optionally synthesize with an LLM." },
    hosted: [
      { name: "Claude / ChatGPT (with web search)", desc: "For publicly available information. Describe what you're looking for.", url: "https://claude.com", pricing: "Free tier", top: true, tags: ["nocode", "ai"] },
      { name: "Perplexity", desc: "AI search engine that cites sources. Good for factual lookups.", url: "https://www.perplexity.ai", pricing: "Free tier", tags: ["nocode", "ai"] },
    ],
    diy: [
      { name: "Custom RAG pipeline", libs: "langchain or llama-index, sentence-transformers, chromadb or FAISS", desc: "Embed your data (any modality: text, tables, code), store in a vector database, retrieve relevant chunks for each query, pass to an LLM. Works for internal databases, documentation, experimental logs, etc.", link: "https://python.langchain.com/docs/tutorials/rag/", top: true,
        howto: "from langchain.document_loaders import DirectoryLoader\nfrom langchain.text_splitter import RecursiveCharacterTextSplitter\nfrom langchain.embeddings import HuggingFaceEmbeddings\nfrom langchain.vectorstores import Chroma\n\n# 1. Load and chunk your data\ndocs = DirectoryLoader('./my_data/').load()\nchunks = RecursiveCharacterTextSplitter(chunk_size=1000).split_documents(docs)\n\n# 2. Embed and store\ndb = Chroma.from_documents(chunks, HuggingFaceEmbeddings())\n\n# 3. Retrieve\nresults = db.similarity_search('my question', k=5)",
        prompt: "I have a folder of {{DOCUMENT_TYPE, e.g. PDFs, text files, CSVs}} at {{YOUR_DATA_FOLDER_PATH}}. I want to be able to ask natural language questions about this data and get answers with source references. Please build a RAG pipeline that loads and chunks the documents, embeds them into a Chroma vector store, and provides a query function that retrieves relevant chunks and synthesizes answers. Use langchain, sentence-transformers, and chromadb.", tags: ["code", "ml"] },
      { name: "SQL / structured database querying with LLM", libs: "langchain, sqlalchemy", desc: "If your data is in a database, LLMs can translate natural language to SQL queries.", link: "https://python.langchain.com/docs/tutorials/sql_qa/",
        howto: "from langchain_community.utilities import SQLDatabase\nfrom langchain_community.agent_toolkits import create_sql_agent\nfrom langchain_anthropic import ChatAnthropic\n\n# 1. Connect to your database\ndb = SQLDatabase.from_uri('sqlite:///my_data.db')\nprint(db.get_usable_table_names())  # verify tables\n\n# 2. Create an LLM-powered SQL agent\nllm = ChatAnthropic(model='claude-sonnet-4-20250514')\nagent = create_sql_agent(llm, db=db, verbose=True)\n\n# 3. Ask questions in natural language\nresult = agent.invoke('What are the top 10 samples by yield?')\nprint(result['output'])",
        prompt: "I have a SQLite database at {{YOUR_DATABASE_PATH}} (or a CSV at {{YOUR_CSV_PATH}} that I'd like to query). The database contains tables about {{BRIEF_DESCRIPTION_OF_DATA}}. Please set up a LangChain SQL agent that lets me ask questions about this data in natural language and get answers. If I gave you a CSV, first load it into a SQLite database. Use langchain, sqlalchemy, and langchain-anthropic.", tags: ["code", "ai"] },
    ],
    dataNeeded: "The corpus or database you want to search. For RAG: any text-based data. For structured queries: a database with a schema.",
  },
  find_lit: {
    question: "What kind of literature search?",
    options: [
      { label: "Comprehensive / systematic review", next: "find_lit_deep" },
      { label: "Quick factual answer", next: "find_lit_quick" },
      { label: "Map the landscape of a field", next: "find_lit_map" },
      { label: "Help understanding a specific paper", next: "find_lit_read" },
      { label: "Check if a finding has been supported or contradicted", next: "find_lit_verify" },
    ],
  },
  find_lit_deep: {
    terminal: true, title: "Systematic Literature Review",
    hosted: [
      { name: "Elicit", desc: "Searches 138M+ papers, extracts structured data, generates citation-backed reports.", url: "https://elicit.com", pricing: "Free (2 reports/mo); Pro $29/mo", top: true, tags: ["nocode", "ai"] },
      { name: "Undermind", desc: "Reads hundreds of papers, follows citation chains, adapts search strategy.", url: "https://www.undermind.ai", pricing: "Freemium", tags: ["nocode", "ai"] },
      { name: "Rayyan", desc: "Gold standard for screening with AI-assisted prioritization.", url: "https://www.rayyan.ai", pricing: "Freemium", tags: ["nocode", "ai"] },
    ],
    dataNeeded: "A well-defined research question. No data required.",
  },
  find_lit_quick: {
    terminal: true, title: "Quick Literature Answer",
    hosted: [
      { name: "Consensus", desc: "Shows degree of scientific agreement via a 'Consensus Meter.'", url: "https://consensus.app", pricing: "Free tier", top: true, tags: ["nocode", "ai"] },
      { name: "Semantic Scholar", desc: "Free, 200M+ papers, TLDR summaries, 'Ask This Paper' querying.", url: "https://www.semanticscholar.org", pricing: "Free", top: true, tags: ["nocode", "deterministic"] },
    ],
    dataNeeded: "Just your question.",
  },
  find_lit_map: {
    terminal: true, title: "Map the Research Landscape",
    hosted: [
      { name: "Connected Papers", desc: "Visual graphs of related papers by citation overlap.", url: "https://www.connectedpapers.com", pricing: "Free (2 graphs/mo)", top: true, tags: ["nocode", "deterministic"] },
      { name: "Litmaps", desc: "Citation networks with 'shortest path' between papers.", url: "https://www.litmaps.com", pricing: "Free tier", tags: ["nocode", "deterministic"] },
    ],
    dataNeeded: "A seed paper (DOI or title).",
  },
  find_lit_read: {
    terminal: true, title: "Help Understanding a Paper",
    hosted: [
      { name: "Google NotebookLM", desc: "Upload PDFs, get AI analysis grounded in your sources. Audio Overviews.", url: "https://notebooklm.google", pricing: "Free", top: true, tags: ["nocode", "ai"] },
      { name: "SciSpace", desc: "Translates jargon and formulas in real time.", url: "https://scispace.com", pricing: "Free tier", tags: ["nocode", "ai"] },
    ],
    dataNeeded: "The PDF(s) you want to understand.",
  },
  find_lit_verify: {
    terminal: true, title: "Verify Claims & Citation Context",
    hosted: [
      { name: "Scite", desc: "1.2B+ citation statements — shows support, contradict, or mention.", url: "https://scite.ai", pricing: "Free tier; ~$12/mo", top: true, tags: ["nocode", "deterministic"] },
    ],
    dataNeeded: "A paper DOI or specific claim.",
  },
  find_seq: {
    terminal: true, title: "Find Sequences, Structures, or Database Records",
    paradigmBanner: { label: "Sequence Alignment / HMMs / Structure Search", color: "#2563eb" },
    hosted: [
      { name: "FoldSeek", desc: "Structure-based search. Finds remote homologs sequence methods miss.", url: "https://search.foldseek.com", pricing: "Free", top: true, tags: ["nocode", "ml"] },
      { name: "InterProScan", desc: "Domain/family classification from 12+ databases.", url: "https://www.ebi.ac.uk/interpro/search/sequence/", pricing: "Free", tags: ["nocode", "deterministic"] },
      { name: "NCBI Entrez (Batch)", desc: "Batch retrieval of DNA, protein, and other NCBI records by accession or query.", url: "https://www.ncbi.nlm.nih.gov/sites/batchentrez", pricing: "Free", tags: ["nocode", "deterministic", "new"] },
    ],
    diy: [
      { name: "BLAST / MMseqs2 — sequence similarity search", libs: "NCBI BLAST+, MMseqs2", desc: "MMseqs2 is 100× faster than BLAST with comparable sensitivity. Use for large-scale homolog detection.", link: "https://github.com/soedinglab/MMseqs2", howto: "mmseqs easy-search query.fasta targetDB result.m8 tmp", tags: ["cli", "deterministic"] },
      { name: "HMMER — profile HMM search", libs: "HMMER3", desc: "Build a profile HMM from a multiple sequence alignment of known family members, then search databases for distant homologs. More sensitive than BLAST for divergent sequences.", link: "http://hmmer.org/", howto: "hmmbuild profile.hmm alignment.sto && hmmsearch profile.hmm database.fasta", tags: ["cli", "deterministic"] },
      { name: "DIAMOND + DeepClust — fast clustering", libs: "DIAMOND", desc: "Fast alignment-based clustering at specified identity/coverage thresholds. Useful for deduplicating large sequence datasets before downstream ML.", link: "https://github.com/bbuchfink/diamond", howto: "diamond deepclust -d seqs.fasta -o clusters.tsv --member-cover 80 --approx-id 30", tags: ["cli", "deterministic"] },
      { name: "Ensembl REST API", desc: "Programmatic access to gene, variant, regulatory, and comparative genomics data across species.", link: "https://rest.ensembl.org/", libs: "requests (Python) or curl", tags: ["code", "deterministic", "new"] },
    ],
    dataNeeded: "Query sequence(s) or MSA. For FoldSeek: a 3D structure (PDB).",
  },
  find_similar: {
    terminal: true, title: "Find Similar Items",
    paradigmBanner: { label: "Nearest Neighbor / Embedding Similarity", color: "#2563eb", explanation: "Can use hand-crafted features (fingerprints, identity) or learned representations (embeddings from pLMs or GNNs). The latter is representation learning (Section 2.4)." },
    hosted: [
      { name: "SciFinder-n", desc: "CAS chemical database. Substructure, reaction, and similarity search across 200M+ substances.", url: "https://scifinder-n.cas.org", pricing: "Institutional license", tags: ["nocode", "deterministic", "new"] },
    ],
    diy: [
      { name: "Molecular fingerprint similarity (RDKit)", libs: "rdkit, scikit-learn", desc: "Compute Morgan/ECFP fingerprints, then Tanimoto similarity. Standard for small-molecule virtual screening.", link: "https://www.rdkit.org/docs/GettingStartedInPython.html#fingerprinting-and-molecular-similarity", howto: "from rdkit import Chem\nfrom rdkit.Chem import AllChem, DataStructs\nimport numpy as np\n\n# 1. Load molecules from SMILES\nsmiles_db = ['CCO', 'CC(=O)O', 'c1ccccc1']  # your database\nquery_smi = 'CC(O)C'  # your query\n\nmols_db = [Chem.MolFromSmiles(s) for s in smiles_db]\nquery_mol = Chem.MolFromSmiles(query_smi)\n\n# 2. Compute Morgan fingerprints (radius=2 ≈ ECFP4)\nfps_db = [AllChem.GetMorganFingerprintAsBitVect(m, 2, nBits=2048) for m in mols_db]\nfp_query = AllChem.GetMorganFingerprintAsBitVect(query_mol, 2, nBits=2048)\n\n# 3. Compute Tanimoto similarity to all database molecules\nsims = [DataStructs.TanimotoSimilarity(fp_query, fp) for fp in fps_db]\n\n# 4. Rank by similarity\nranked = sorted(zip(smiles_db, sims), key=lambda x: -x[1])\nfor smi, sim in ranked:\n    print(f'{smi}: {sim:.3f}')",
        prompt: "I have a list of molecules as SMILES strings in {{YOUR_CSV_FILE_PATH}} (column \"{{SMILES_COLUMN}}\") and a query molecule: {{YOUR_QUERY_SMILES}}. Please compute Morgan fingerprint Tanimoto similarity between the query and all molecules in my file, rank by similarity, and output the top 20 most similar. Use rdkit, pandas, and numpy.", tags: ["code", "deterministic"] },
      { name: "Protein embedding similarity (ESM2)", libs: "torch, fair-esm (or huggingface transformers)", desc: "Embed proteins with ESM2, compute cosine similarity in embedding space. Captures functional similarity beyond sequence identity.", link: "https://github.com/facebookresearch/esm", howto: "import esm\nimport torch\nimport numpy as np\nfrom sklearn.metrics.pairwise import cosine_similarity\n\n# 1. Load ESM2\nmodel, alphabet = esm.pretrained.esm2_t33_650M_UR50D()\nbatch_converter = alphabet.get_batch_converter()\nmodel.eval()\n\n# 2. Embed each protein\nsequences = [('prot1', 'MKTL...'), ('prot2', 'MKVA...')]  # your sequences\n_, _, tokens = batch_converter(sequences)\nwith torch.no_grad():\n    results = model(tokens, repr_layers=[33])\nembeddings = results['representations'][33][:, 1:-1, :]  # remove BOS/EOS\n\n# 3. Mean-pool to get one vector per protein\npooled = embeddings.mean(dim=1).numpy()  # shape: (N, 1280)\n\n# 4. Compute pairwise cosine similarity\nsim_matrix = cosine_similarity(pooled)\nprint(sim_matrix)",
        prompt: "I have {{NUMBER}} protein sequences in a FASTA file at {{YOUR_FASTA_FILE}}. I want to compute pairwise similarity between all proteins using ESM2 embeddings (not sequence identity). Please extract ESM2 embeddings for each protein, compute a cosine similarity matrix, create a heatmap visualization, and identify the most similar pairs. Use fair-esm, torch, scikit-learn, seaborn, and matplotlib.", tags: ["code", "ml", "gpu"] },
      { name: "k-NN search at scale (FAISS)", libs: "faiss-cpu or faiss-gpu", desc: "Facebook's library for fast approximate nearest neighbor search. Use when searching millions of embeddings.", link: "https://github.com/facebookresearch/faiss", howto: "import faiss\nindex = faiss.IndexFlatIP(dim)  # inner product = cosine on normalized\nindex.add(embeddings)\nD, I = index.search(query, k=10)", tags: ["code", "ml"] },
    ],
    dataNeeded: "Your query item (sequence, SMILES, structure) + a database to search.",
  },
  find_internal: {
    terminal: true, title: "Search Within Your Own Documents",
    hosted: [
      { name: "Google NotebookLM", desc: "Upload documents, ask questions grounded in your sources.", url: "https://notebooklm.google", pricing: "Free", top: true, tags: ["nocode", "ai"] },
      { name: "Notion AI", desc: "AI search across team workspace.", url: "https://www.notion.so", pricing: "$10/mo + $10/mo AI", tags: ["nocode", "ai"] },
    ],
    diy: [
      { name: "Local RAG pipeline", libs: "langchain or llama-index, sentence-transformers, chromadb or FAISS", desc: "Embed your documents into a vector store, retrieve relevant chunks for each query, pass to an LLM for synthesis. Keeps data local.", link: "https://python.langchain.com/docs/tutorials/rag/", howto: "from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader\nfrom langchain.text_splitter import RecursiveCharacterTextSplitter\nfrom langchain_community.embeddings import HuggingFaceEmbeddings\nfrom langchain_community.vectorstores import Chroma\n\n# 1. Load your local documents (PDFs, text files)\nloader = DirectoryLoader('./my_docs/', glob='**/*.pdf', loader_cls=PyPDFLoader)\ndocs = loader.load()\n\n# 2. Split into chunks\nsplitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)\nchunks = splitter.split_documents(docs)\n\n# 3. Embed and store locally\nembeddings = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')\ndb = Chroma.from_documents(chunks, embeddings, persist_directory='./chroma_db')\n\n# 4. Query\nresults = db.similarity_search('What protocols were used?', k=5)\nfor doc in results:\n    print(doc.page_content[:200])",
        prompt: "I have a folder of documents ({{DOCUMENT_TYPE, e.g. PDFs, lab notebooks, text files}}) at {{YOUR_DOCS_FOLDER_PATH}}. I want to search through them by asking questions in natural language, with all data staying on my local machine. Please build a local RAG pipeline: load the documents, chunk them, embed into a local Chroma vector store, and provide a simple query interface. Use langchain, sentence-transformers, and chromadb.", tags: ["code", "ml"] },
    ],
    dataNeeded: "Your documents — PDFs, notes, or data.",
  },

  // ═══════════════════════════════════════
  // PREDICT
  // ═══════════════════════════════════════
  predict: {
    question: "Do you have labeled data (input-output pairs)?",
    paradigmBanner: { label: "Supervised Learning", color: "#dc2626", explanation: "Prediction = supervised learning (Clinic 1, Section 2.1). You have inputs (X) and outcomes (y), and want to learn f(X) ≈ y. Key choices: features (Section 1.2), architecture, and validation (Section 3.2)." },
    options: [
      { label: "Yes — I have my own measured data", next: "predict_own" },
      { label: "No — I want to use a pre-trained model (zero-shot)", next: "predict_zs" },
      { label: "I have a little data and want to leverage a pre-trained model", next: "predict_transfer" },
    ],
  },
  predict_own: {
    question: "How much labeled data do you have?",
    options: [
      { label: "Small (10–100 examples)", next: "predict_small" },
      { label: "Medium (100–10,000 examples)", next: "predict_medium" },
      { label: "Large (10,000+ examples)", next: "predict_large" },
    ],
  },
  predict_small: {
    question: "What type of input data?",
    infoBox: { text: "With small datasets, use simple models to avoid overfitting (Section 3.1). Linear models, Gaussian processes, and small random forests are good. Avoid deep learning unless using transfer learning.", color: "#dc2626" },
    options: [
      { label: "Tabular (spreadsheet: numbers, categories)", next: "predict_small_tab" },
      { label: "Protein sequences → fitness/activity", next: "predict_small_prot" },
      { label: "Molecular structures → properties", next: "predict_small_mol" },
      { label: "Other data types", next: "predict_general_small" },
    ],
  },
  predict_general_small: {
    terminal: true, title: "Small-Data Supervised Learning (General)",
    paradigmBanner: { label: "Supervised Learning — Simple Models First", color: "#dc2626", explanation: "With <100 examples, the approach is the same regardless of data type: encode your inputs as a numeric feature vector, then fit simple models. The challenge is feature engineering — converting your domain objects into good numbers." },
    diy: [
      { name: "The general recipe", libs: "scikit-learn, pandas, numpy", desc: "1) Convert your inputs to a numeric feature vector (this is the hard part — it's domain-specific). 2) Start with Ridge regression. 3) Try Random Forest. 4) Try Gaussian Process if you want uncertainty. 5) Cross-validate everything. Don't touch neural networks at this data size.", top: true,
        howto: "from sklearn.model_selection import cross_val_score\nfrom sklearn.linear_model import Ridge\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.gaussian_process import GaussianProcessRegressor\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\n\n# X = your feature matrix (N examples × M features)\n# y = your labels\n\nfor name, model in [\n    ('Ridge', Ridge(alpha=1.0)),\n    ('RF', RandomForestRegressor(n_estimators=100, max_depth=5)),\n    ('GP', GaussianProcessRegressor(normalize_y=True)),\n]:\n    pipe = Pipeline([('scale', StandardScaler()), ('model', model)])\n    scores = cross_val_score(pipe, X, y, cv=5, scoring='r2')\n    print(f'{name}: R² = {scores.mean():.3f} ± {scores.std():.3f}')",
        prompt: "I have a small dataset (fewer than 100 rows) at {{YOUR_DATA_FILE_PATH}}. My inputs are {{DESCRIPTION_OF_INPUTS}} and I want to predict \"{{TARGET_COLUMN}}\". This is a {{regression OR classification}} problem. Please load the data, convert the inputs to numeric features, compare Ridge regression, Random Forest, and Gaussian Process models with 5-fold cross-validation, and recommend the best one. Plot predicted vs actual for the winner. Use pandas, scikit-learn, and matplotlib.", tags: ["code", "ml"] },
      { name: "Feature engineering guidance", libs: "", desc: "The key question: what numeric vector best represents each example? Options: hand-crafted domain features (best if you have expertise), pre-trained embeddings (if a foundation model exists for your data type), or raw features (one-hot, counts, etc.). Better features > fancier models.", link: "https://scikit-learn.org/stable/modules/preprocessing.html", tags: ["code", "deterministic"] },
    ],
    dataNeeded: "Any data where you have inputs paired with measured outcomes. The main effort is converting your inputs to a numeric feature vector.",
    clinicConnection: "Section 1.2 (feature engineering) + Section 2.1 (supervised learning) + Section 3.1 (start simple). This is the general case of everything in Clinic 1.",
  },
  predict_small_tab: {
    terminal: true, title: "Small Tabular Data Prediction",
    paradigmBanner: { label: "Supervised Learning — Simple Models", color: "#dc2626", explanation: "With <100 examples, bias-variance tradeoff (Section 3.1) favors simple models. Use cross-validation (Section 3.2) to estimate generalization performance." },
    hosted: [
      { name: "Julius AI", desc: "No-code: upload CSV, ask questions in English, get models and plots.", url: "https://julius.ai", pricing: "Free (15 msgs/mo)", tags: ["nocode", "ai"] },
      { name: "Claude Analysis Tool", desc: "Upload CSV, describe your prediction task. Good for prototyping.", url: "https://claude.com", pricing: "Free tier / $20/mo", tags: ["nocode", "ai"] },
    ],
    diy: [
      { name: "Linear regression → regularized → tree ensemble (scikit-learn)", libs: "scikit-learn, pandas, numpy", desc: "The canonical supervised learning progression. Start with the simplest model that could work, add complexity only when validation error improves. This is the core workflow from Clinic 1.", link: "https://scikit-learn.org/stable/supervised_learning.html",
        howto: "from sklearn.model_selection import cross_val_score\nfrom sklearn.linear_model import Ridge\nfrom sklearn.ensemble import RandomForestRegressor\n\n# Always start simple\nridge = Ridge(alpha=1.0)\nscores = cross_val_score(ridge, X, y, cv=5, scoring='r2')\nprint(f'Ridge CV R²: {scores.mean():.3f} ± {scores.std():.3f}')\n\n# Try more complex only if Ridge underfits\nrf = RandomForestRegressor(n_estimators=100, max_depth=5)\nscores = cross_val_score(rf, X, y, cv=5, scoring='r2')",
        prompt: "I have a CSV file at {{YOUR_CSV_FILE_PATH}}. I want to predict the column \"{{TARGET_COLUMN}}\" using the other columns as features. This is a {{regression OR classification}} problem and I have fewer than 100 rows. Please load the data, handle any missing values, split into train/test, and compare Ridge regression, Random Forest, and Gaussian Process models using 5-fold cross-validation. Report R² (or accuracy) for each and plot predicted vs actual for the best model. Use pandas, scikit-learn, and matplotlib.", tags: ["code", "ml"] },
      { name: "Gaussian process regression (scikit-learn)", libs: "scikit-learn", desc: "Provides calibrated uncertainty estimates on predictions. Excellent for small datasets. Also the foundation for Bayesian optimization (→ OPTIMIZE). Scales poorly beyond ~1,000 points.", link: "https://scikit-learn.org/stable/modules/gaussian_process.html",
        howto: "from sklearn.gaussian_process import GaussianProcessRegressor\nfrom sklearn.gaussian_process.kernels import RBF, ConstantKernel\n\nkernel = ConstantKernel() * RBF(length_scale_bounds=(0.1, 10))\ngp = GaussianProcessRegressor(kernel=kernel, n_restarts_optimizer=5)\ngp.fit(X_train, y_train)\ny_pred, y_std = gp.predict(X_test, return_std=True)  # mean + uncertainty",
        prompt: "I have a CSV file at {{YOUR_CSV_FILE_PATH}}. I want to predict the column \"{{TARGET_COLUMN}}\" and also get uncertainty estimates for each prediction. I have fewer than 100 rows. Please load the data, train a Gaussian Process regression model with cross-validation, plot predictions with error bars (uncertainty), and identify which data points the model is least confident about. Use pandas, scikit-learn, and matplotlib.", tags: ["code", "ml"] },
    ],
    dataNeeded: "Table: N rows × M feature columns + label column. Encode categoricals (Section 1.2). Scale continuous features (StandardScaler). Always cross-validate.",
    clinicConnection: "This is the coffee quality regression from Clinic 1. Start linear, add complexity only if CV error improves. Watch for overfitting (Section 3.1).",
  },
  predict_small_prot: {
    terminal: true, title: "Few-Shot Protein Fitness Prediction",
    paradigmBanner: { label: "Transfer Learning + Active Learning", color: "#dc2626", explanation: "Leverage pre-trained protein language models (self-supervised, Section 2.6) as feature extractors, then train a lightweight supervised head. This is transfer learning (Section 2.5). Combine with active learning (Section 2.3) to let the model choose which variants to screen next." },
    hosted: [
      { name: "EVOLVEpro", desc: "pLM embeddings + active learning. Up to 100-fold improvements with ~10 data points per round.", url: "https://github.com/mat10d/EvolvePro", pricing: "Free, GitHub + Colab", top: true, tags: ["nocode", "ml"] },
      { name: "ALDE", desc: "Arnold group. Uncertainty-guided active learning for DE. 12% → 93% yield in 3 rounds.", url: "https://www.nature.com/articles/s41467-025-55987-8", pricing: "Free, code with paper", top: true, tags: ["code", "ml"] },
    ],
    diy: [
      { name: "ESM2 embeddings + Ridge/GP regression", libs: "fair-esm (or huggingface transformers), torch, scikit-learn", desc: "Extract per-residue embeddings from ESM2 for each variant, pool to a fixed-size vector (mean pooling), then train a simple Ridge or GP regressor on your fitness labels. This is transfer learning: ESM2 provides the representation, your data provides the task.", link: "https://github.com/facebookresearch/esm",
        howto: "import esm\nimport torch\nfrom sklearn.linear_model import Ridge\n\n# Load ESM2 (650M param version)\nmodel, alphabet = esm.pretrained.esm2_t33_650M_UR50D()\nbatch_converter = alphabet.get_batch_converter()\n\n# Extract embeddings for each variant\nembeddings = []\nfor seq in variant_sequences:\n    _, _, tokens = batch_converter([('', seq)])\n    with torch.no_grad():\n        result = model(tokens, repr_layers=[33])\n    emb = result['representations'][33][0, 1:-1].mean(0)  # mean pool\n    embeddings.append(emb.numpy())\n\nX = np.stack(embeddings)\n# Train simple model on embeddings\nridge = Ridge(alpha=1.0)\nridge.fit(X_train, y_train)",
        prompt: "I have {{NUMBER}} protein variant sequences in a FASTA file at {{YOUR_FASTA_FILE}} and their measured fitness values in a CSV at {{YOUR_FITNESS_CSV}} with columns \"{{SEQUENCE_COLUMN}}\" and \"{{FITNESS_COLUMN}}\". Please extract ESM2 embeddings for each variant (mean-pooled), train a Ridge regression to predict fitness from embeddings, evaluate with 5-fold cross-validation, and report R². Also plot predicted vs actual fitness. Use fair-esm, torch, scikit-learn, numpy, and matplotlib.", tags: ["code", "ml", "gpu"] },
      { name: "Active learning loop with GP + UCB", libs: "scikit-learn (GaussianProcessRegressor)", desc: "Use a GP surrogate on pLM embeddings. In each round, score all unscreened variants with UCB (predicted mean + β × predicted std), screen the top-k, add results, retrain. This is the exact UCB loop from Clinic 1 Section 2.3, applied to protein variants.", link: "https://scikit-learn.org/stable/modules/gaussian_process.html",
        howto: "# After extracting ESM2 embeddings for all candidate variants:\nfrom sklearn.gaussian_process import GaussianProcessRegressor\n\ngp = GaussianProcessRegressor(normalize_y=True)\ngp.fit(X_screened, y_screened)\n\ny_pred, y_std = gp.predict(X_unscreened, return_std=True)\nbeta = 2.0  # exploration weight\nucb = y_pred + beta * y_std\nnext_to_screen = np.argsort(ucb)[-batch_size:]  # top UCB",
        prompt: "I have {{NUMBER}} protein variant sequences with measured fitness in {{YOUR_DATA_FILE}} and {{NUMBER_UNSCREENED}} candidate variants I haven't screened yet in {{YOUR_CANDIDATES_FILE}}. I want to use active learning to choose the next batch of {{BATCH_SIZE}} variants to screen. Please extract ESM2 embeddings, train a GP model on the screened data, score all candidates with UCB acquisition, and output the top candidates to screen next. Use fair-esm, torch, scikit-learn, and numpy.", tags: ["code", "ml"] },
    ],
    dataNeeded: "Wild-type sequence + 10–50 variants with measured fitness. Active learning proposes next batches iteratively.",
    clinicConnection: "Combines transfer learning (Section 2.5: ESM2 = D1 pre-training) with active learning (Section 2.3: GP + UCB loop). The coffee → proteins progression.",
  },
  predict_small_mol: {
    terminal: true, title: "Few-Shot Molecular Property Prediction",
    diy: [
      { name: "Molecular fingerprints + Random Forest", libs: "rdkit, scikit-learn", desc: "Compute Morgan fingerprints (ECFP), train a random forest. Simple, fast, often competitive. Good baseline before trying graph neural networks.", link: "https://www.rdkit.org/docs/GettingStartedInPython.html",
        howto: "from rdkit import Chem\nfrom rdkit.Chem import AllChem\nimport numpy as np\nfrom sklearn.ensemble import RandomForestRegressor\n\n# Generate fingerprints from SMILES\nfps = []\nfor smi in smiles_list:\n    mol = Chem.MolFromSmiles(smi)\n    fp = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=2048)\n    fps.append(np.array(fp))\nX = np.stack(fps)\n\nrf = RandomForestRegressor(n_estimators=200)\nrf.fit(X_train, y_train)",
        prompt: "I have a CSV at {{YOUR_CSV_FILE_PATH}} with SMILES strings in column \"{{SMILES_COLUMN}}\" and a measured property in column \"{{PROPERTY_COLUMN}}\". I have {{NUMBER}} molecules. Please compute Morgan fingerprints from the SMILES, train a Random Forest model with cross-validation, report performance (R² or accuracy), and show which structural features matter most. Use rdkit, scikit-learn, pandas, and matplotlib.", tags: ["code", "ml"] },
      { name: "Chemprop — graph neural network", libs: "chemprop (pip install chemprop)", desc: "Message-passing neural network that learns directly from molecular graphs. v2 is 2× faster. Can fine-tune pre-trained checkpoints for few-shot learning. Relevant for biofuel properties (cetane, octane), toxicity, solubility.", link: "https://github.com/chemprop/chemprop",
        howto: "# CLI usage (simplest):\n# chemprop train --data-path data.csv --smiles-columns smiles --target-columns property\n# chemprop predict --test-path test.csv --model-path model.pt", tags: ["cli", "ml", "gpu"] },
    ],
    dataNeeded: "SMILES strings + measured property values. Fingerprint models can work with 20–50 molecules. GNNs want 100+.",
  },
  predict_medium: {
    question: "What type of input data?",
    infoBox: { text: "With 100–10K examples, gradient boosted trees (XGBoost, LightGBM) typically win on tabular data. Neural networks become competitive for structured inputs (sequences, graphs, images).", color: "#dc2626" },
    options: [
      { label: "Tabular (spreadsheet)", next: "predict_med_tab" },
      { label: "Protein sequences", next: "predict_med_prot" },
      { label: "Molecular structures", next: "predict_med_mol" },
      { label: "Time series / process data", next: "predict_med_time" },
      { label: "Images", next: "predict_med_img" },
      { label: "Other data types", next: "predict_general_med" },
    ],
  },
  predict_general_med: {
    terminal: true, title: "Medium-Data Supervised Learning (General)",
    paradigmBanner: { label: "Supervised Learning — Trees or Neural Networks", color: "#dc2626", explanation: "With 100–10K examples, gradient boosted trees (XGBoost) are the default for tabular/flat features. Neural networks are worth trying if your data has natural structure (sequences, graphs, spatial)." },
    diy: [
      { name: "XGBoost + Optuna (general tabular recipe)", libs: "xgboost, optuna, scikit-learn", desc: "The workhorse. Handles mixed features, missing values, and non-linear relationships. Pair with Optuna for hyperparameter tuning.", top: true,
        howto: "import xgboost as xgb\nimport optuna\nfrom sklearn.model_selection import cross_val_score\n\ndef objective(trial):\n    params = {\n        'max_depth': trial.suggest_int('max_depth', 3, 10),\n        'learning_rate': trial.suggest_float('lr', 0.01, 0.3, log=True),\n        'n_estimators': trial.suggest_int('n_est', 50, 500),\n        'subsample': trial.suggest_float('subsample', 0.6, 1.0),\n        'colsample_bytree': trial.suggest_float('colsample', 0.6, 1.0),\n    }\n    model = xgb.XGBRegressor(**params)\n    return cross_val_score(model, X, y, cv=5, scoring='r2').mean()\n\nstudy = optuna.create_study(direction='maximize')\nstudy.optimize(objective, n_trials=50)",
        prompt: "I have a CSV at {{YOUR_CSV_FILE_PATH}} with {{NUMBER_OF_ROWS}} rows. I want to predict \"{{TARGET_COLUMN}}\" from the other columns. This is a {{regression OR classification}} problem. Please load the data, preprocess it, train an XGBoost model with Optuna hyperparameter optimization (50 trials), report cross-validated performance, and show SHAP feature importances for the best model. Use pandas, xgboost, optuna, scikit-learn, shap, and matplotlib.", tags: ["code", "ml"] },
      { name: "PyTorch for structured data", libs: "pytorch, pytorch-lightning", desc: "If your data has inherent structure (graphs, sequences, spatial), a neural network can learn features directly (representation learning, Section 2.4). Otherwise, stick with trees.", link: "https://pytorch-lightning.readthedocs.io/", tags: ["code", "ml", "gpu"] },
    ],
    dataNeeded: "Feature matrix + labels. At this scale, proper train/val/test splits are critical (Section 3.2).",
  },
  predict_med_tab: {
    terminal: true, title: "Tabular Prediction (100–10K examples)",
    paradigmBanner: { label: "Supervised Learning — Gradient Boosted Trees", color: "#dc2626", explanation: "Ensemble tree methods consistently outperform neural networks on tabular data. They handle mixed types, missing values, and are robust to overfitting." },
    diy: [
      { name: "XGBoost / LightGBM — gradient boosted trees", libs: "xgboost or lightgbm, scikit-learn", desc: "The go-to for tabular prediction. Fast, handles missing values, built-in feature importance. Use RandomizedSearchCV for hyperparameter tuning.", link: "https://xgboost.readthedocs.io/en/stable/python/python_intro.html",
        howto: "import xgboost as xgb\nfrom sklearn.model_selection import RandomizedSearchCV\n\nparam_dist = {\n    'max_depth': [3, 5, 7, 9],\n    'learning_rate': [0.01, 0.05, 0.1, 0.3],\n    'n_estimators': [100, 300, 500],\n    'subsample': [0.7, 0.8, 0.9],\n}\nmodel = xgb.XGBRegressor()\nsearch = RandomizedSearchCV(model, param_dist, n_iter=30, cv=5, scoring='r2')\nsearch.fit(X_train, y_train)\nprint(f'Best CV R²: {search.best_score_:.3f}')", top: true,
        prompt: "I have a CSV file at {{YOUR_CSV_FILE_PATH}} with {{NUMBER_OF_ROWS}} rows. I want to predict the column \"{{TARGET_COLUMN}}\" using the other columns as features. {{BRIEF_DESCRIPTION_OF_FEATURES}}. This is a {{regression OR classification}} problem. Please load the data, build a preprocessing pipeline (handle missing values, encode categoricals, scale numerics), train an XGBoost model with hyperparameter tuning via RandomizedSearchCV, report cross-validated performance, and show a SHAP feature importance plot. Use pandas, xgboost, scikit-learn, shap, and matplotlib.", tags: ["code", "ml"] },
      { name: "Preprocessing pipeline (scikit-learn)", libs: "scikit-learn", desc: "Always build a proper pipeline: encode categoricals, scale numerics, handle missing values. This prevents data leakage (Section 3.3).", link: "https://scikit-learn.org/stable/modules/compose.html",
        howto: "from sklearn.pipeline import Pipeline\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.impute import SimpleImputer\n\npreprocessor = ColumnTransformer([\n    ('num', Pipeline([\n        ('impute', SimpleImputer(strategy='median')),\n        ('scale', StandardScaler())\n    ]), numeric_cols),\n    ('cat', Pipeline([\n        ('impute', SimpleImputer(strategy='most_frequent')),\n        ('ohe', OneHotEncoder(handle_unknown='ignore'))\n    ]), categorical_cols),\n])\n\npipe = Pipeline([('preprocess', preprocessor), ('model', xgb.XGBRegressor())])", tags: ["code", "deterministic"] },
    ],
    dataNeeded: "Clean tabular data. Split train/val/test (Section 3.2). Watch for leakage (Section 3.3).",
  },
  predict_med_prot: {
    terminal: true, title: "Protein Fitness Prediction (100+ variants)",
    paradigmBanner: { label: "Supervised on Learned Representations", color: "#dc2626", explanation: "Use pLM embeddings as features — transfer learning (Section 2.5). The embedding captures evolutionary and structural information that one-hot encoding cannot." },
    hosted: [
      { name: "Cradle.bio", desc: "Enterprise: trains custom ML on your data, suggests next variants.", url: "https://www.cradle.bio", pricing: "Enterprise (~$100K+/yr)", tags: ["nocode", "ml"] },
    ],
    diy: [
      { name: "ESM2 embeddings + XGBoost", libs: "fair-esm or transformers, torch, xgboost", desc: "Extract embeddings (see small-data protein node for code), then train XGBoost. With 100+ variants, boosted trees on embeddings are very competitive.", top: true,
        howto: "# After extracting ESM2 embeddings (see PREDICT > small > protein)\nimport xgboost as xgb\nfrom sklearn.model_selection import cross_val_score\n\nmodel = xgb.XGBRegressor(max_depth=5, n_estimators=200, learning_rate=0.1)\nscores = cross_val_score(model, X_embeddings, y_fitness, cv=5, scoring='r2')",
        prompt: "I have {{NUMBER}} protein variant sequences in {{YOUR_FASTA_FILE}} with fitness values in {{YOUR_FITNESS_CSV}} (columns \"{{SEQUENCE_COLUMN}}\" and \"{{FITNESS_COLUMN}}\"). Please extract ESM2 embeddings, train an XGBoost model with cross-validation, report R², and show which embedding dimensions are most predictive. Use fair-esm, torch, xgboost, scikit-learn, and matplotlib.", tags: ["code", "ml", "gpu"] },
      { name: "One-hot + positional encoding baseline", libs: "scikit-learn, numpy", desc: "One-hot encode mutations relative to wild-type. Simpler than embeddings and still competitive for single-mutant libraries. Always run as a baseline.", 
        howto: "import numpy as np\nfrom sklearn.linear_model import Ridge\nfrom sklearn.model_selection import cross_val_score\n\nwt_seq = 'MKTLLIFLAHG'  # your wild-type\nvariants = ['MKTLAIFLAHG', 'MKTLLIFLRHG', ...]  # your variant sequences\ny_fitness = np.array([1.2, 0.8, ...])  # measured fitness\n\n# Encode: binary vector (1 = mutated, 0 = WT) at each position\ndef encode_mutations(wt, variant):\n    return np.array([1 if a != b else 0 for a, b in zip(wt, variant)])\n\nX = np.array([encode_mutations(wt_seq, v) for v in variants])\n\n# Train and evaluate\nridge = Ridge(alpha=1.0)\nscores = cross_val_score(ridge, X, y_fitness, cv=5, scoring='r2')\nprint(f'One-hot baseline R²: {scores.mean():.3f} ± {scores.std():.3f}')", tags: ["code", "ml"] },
      { name: "Key consideration: data splitting for proteins", libs: "", desc: "Random splits overestimate performance because similar sequences leak information. Use cluster-based splits (cluster sequences at 70-80% identity, split by cluster) to test genuine extrapolation ability.", link: "https://github.com/facebookresearch/esm",
        howto: "# Use mmseqs2 to cluster your variants:\n# mmseqs easy-cluster variants.fasta clust tmp --min-seq-id 0.8\n# Then split by cluster, not by individual sequence", tags: ["code", "deterministic"] },
    ],
    dataNeeded: "100+ variant sequences with fitness. Consider cluster-based splits to test extrapolation.",
  },
  predict_med_mol: {
    terminal: true, title: "Molecular Property Prediction (100+ molecules)",
    paradigmBanner: { label: "Graph Neural Networks — Representation Learning", color: "#dc2626" },
    diy: [
      { name: "Chemprop v2 — message-passing GNN", libs: "chemprop", desc: "Learns directly from molecular graphs. Relevant for biofuel properties (cetane, octane), toxicity, solubility. v2 is 2× faster.", link: "https://github.com/chemprop/chemprop", top: true,
        howto: "# Train: chemprop train --data-path train.csv --smiles-columns smiles --target-columns target\n# Predict: chemprop predict --test-path test.csv --model-path best_model.pt\n# Ensemble: chemprop train ... --ensemble-size 5", tags: ["cli", "ml", "gpu"] },
      { name: "DeepChem — broader ML for chemistry", libs: "deepchem", desc: "Multiple architectures (GCN, MPNN, AttentiveFP), pre-trained models, uncertainty estimation.", link: "https://github.com/deepchem/deepchem",
        howto: "import deepchem as dc\n# Load dataset with featurizer\nfeaturizer = dc.feat.MolGraphConvFeaturizer()\nloader = dc.data.CSVLoader(['target'], feature_field='smiles', featurizer=featurizer)\ndataset = loader.create_dataset('data.csv')\nmodel = dc.models.GCNModel(n_tasks=1, mode='regression')\nmodel.fit(dataset, nb_epoch=50)",
        prompt: "I have a CSV at {{YOUR_CSV_FILE_PATH}} with SMILES strings in column \"{{SMILES_COLUMN}}\" and a measured property in column \"{{PROPERTY_COLUMN}}\". I want to train a graph neural network to predict the property from molecular structure. Please load the data, featurize molecules as graphs, train a GCN model with DeepChem, evaluate on a held-out test set, and report performance. Use deepchem, pandas, and matplotlib.", tags: ["code", "ml", "gpu"] },
      { name: "Fingerprint baseline (always run this first)", libs: "rdkit, scikit-learn", desc: "Morgan fingerprints + random forest. Fast and often surprisingly competitive. If this does well, a GNN may not be worth the complexity.",
        howto: "from rdkit import Chem\nfrom rdkit.Chem import AllChem\nimport numpy as np\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.model_selection import cross_val_score\n\n# 1. Generate fingerprints from SMILES\nfps = []\nfor smi in smiles_list:\n    mol = Chem.MolFromSmiles(smi)\n    fp = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=2048)\n    fps.append(np.array(fp))\nX = np.stack(fps)\n\n# 2. Train and evaluate\nrf = RandomForestRegressor(n_estimators=200, max_depth=10)\nscores = cross_val_score(rf, X, y, cv=5, scoring='r2')\nprint(f'Fingerprint + RF CV R\u00b2²: {scores.mean():.3f} ± {scores.std():.3f}')", tags: ["code", "ml"] },
    ],
    dataNeeded: "SMILES + measured properties. Chemprop handles featurization automatically.",
    clinicConnection: "Representation learning (Section 2.4): GNN learns features from molecular graphs vs. hand-engineered fingerprints.",
  },
  predict_med_time: {
    terminal: true, title: "Time Series / Process Data Prediction",
    diy: [
      { name: "Feature engineering + tabular ML", libs: "pandas, tsfresh or manual, scikit-learn/xgboost", desc: "Extract time-domain features (growth rates, lag times, peak values, AUC, slopes) then apply standard tabular ML. Domain expertise about which temporal features matter often outperforms end-to-end deep learning.", top: true,
        howto: "# Manual approach (often best):\nimport pandas as pd\ndef extract_features(timeseries):\n    return {\n        'max_rate': np.max(np.diff(timeseries)),\n        'lag_time': np.argmax(np.diff(timeseries) > threshold),\n        'auc': np.trapz(timeseries),\n        'final_value': timeseries[-1],\n    }\n\n# Automated approach:\n# pip install tsfresh\nfrom tsfresh import extract_features\nfeatures = extract_features(df, column_id='sample', column_sort='time')",
        prompt: "I have time series data in {{YOUR_CSV_FILE_PATH}} with columns: \"{{SAMPLE_ID_COLUMN}}\" (sample identifier), \"{{TIME_COLUMN}}\" (timepoint), {{MEASUREMENT_COLUMNS}} (measurements), and an outcome in {{YOUR_OUTCOMES_FILE}} column \"{{OUTCOME_COLUMN}}\". Please extract time-domain features (growth rate, lag time, AUC, max value, final value) from each sample's time series, then train an XGBoost model to predict the outcome from these features. Report cross-validated performance and feature importances. Use pandas, numpy, scikit-learn, xgboost, and matplotlib.", tags: ["code", "ml"] },
      { name: "LSTM / Transformer for raw time series", libs: "pytorch, pytorch-lightning", desc: "Learns directly from raw time series without manual features. Requires more data (1000+ series). Consider only when manual features don't capture enough.", link: "https://pytorch-lightning.readthedocs.io/",
        howto: "import torch\nimport torch.nn as nn\nfrom torch.utils.data import DataLoader, TensorDataset\n\n# 1. Prepare data: X shape (N, seq_len, n_features), y shape (N,)\nX_tensor = torch.FloatTensor(X_train)\ny_tensor = torch.FloatTensor(y_train)\nloader = DataLoader(TensorDataset(X_tensor, y_tensor), batch_size=32, shuffle=True)\n\n# 2. Define LSTM model\nclass LSTMPredictor(nn.Module):\n    def __init__(self, input_dim, hidden_dim=64):\n        super().__init__()\n        self.lstm = nn.LSTM(input_dim, hidden_dim, batch_first=True)\n        self.fc = nn.Linear(hidden_dim, 1)\n    def forward(self, x):\n        _, (h, _) = self.lstm(x)  # h: last hidden state\n        return self.fc(h.squeeze(0))\n\nmodel = LSTMPredictor(input_dim=X_train.shape[2])\noptimizer = torch.optim.Adam(model.parameters(), lr=1e-3)\nloss_fn = nn.MSELoss()\n\n# 3. Train\nfor epoch in range(50):\n    for xb, yb in loader:\n        pred = model(xb).squeeze()\n        loss = loss_fn(pred, yb)\n        optimizer.zero_grad()\n        loss.backward()\n        optimizer.step()",
        prompt: "I have time series data in {{YOUR_CSV_FILE_PATH}} with columns: \"{{SAMPLE_ID_COLUMN}}\", \"{{TIME_COLUMN}}\", {{MEASUREMENT_COLUMNS}}, and outcomes in \"{{OUTCOME_COLUMN}}\". I have {{NUMBER}} samples with {{LENGTH}} timepoints each. Manual feature extraction didn't work well enough, so I want to try an LSTM that learns directly from the raw time series. Please reshape the data, build and train an LSTM model in PyTorch, evaluate on a held-out test set, and report performance. Use pandas, torch, numpy, and matplotlib.", tags: ["code", "ml", "gpu"] },
    ],
    dataNeeded: "Time-indexed measurements + outcomes. Feature engineering first, deep learning second.",
    clinicConnection: "Feature engineering (Section 1.2) is crucial here. The features ARE the domain expertise.",
  },
  predict_med_img: {
    terminal: true, title: "Image-Based Prediction",
    paradigmBanner: { label: "Deep Learning — CNNs (Representation Learning)", color: "#dc2626", explanation: "CNNs learn hierarchical features from pixels (Section 2.4). Transfer learning from ImageNet works for microscopy with as few as 100–500 labeled images." },
    hosted: [
      { name: "Cellpose", desc: "Cell segmentation across microscopy types. No retraining needed.", url: "https://github.com/MouseLand/cellpose", pricing: "Free", top: true, tags: ["nocode", "ml"] },
      { name: "BioImage.IO", desc: "Model zoo of pre-trained DL models for bioimage analysis.", url: "https://bioimage.io", pricing: "Free", tags: ["nocode", "ml"] },
    ],
    diy: [
      { name: "Transfer learning from pre-trained CNN", libs: "pytorch, torchvision", desc: "Fine-tune a ResNet or EfficientNet pre-trained on ImageNet. Replace the final classification layer with your task head. Even 100–500 labeled images can work.", link: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html",
        howto: "import torchvision.models as models\nimport torch.nn as nn\n\nmodel = models.resnet18(pretrained=True)\n# Freeze early layers\nfor param in model.parameters():\n    param.requires_grad = False\n# Replace final layer\nmodel.fc = nn.Linear(model.fc.in_features, num_classes)\n# Train only the new layer (+ optionally unfreeze later)",
        prompt: "I have a folder of labeled images at {{YOUR_IMAGE_FOLDER}} organized in subfolders by class (e.g., class_A/, class_B/). I have {{NUMBER}} images total across {{NUMBER_OF_CLASSES}} classes. I want to train an image classifier. Please fine-tune a pre-trained ResNet18 on my images, evaluate on a held-out test set, report accuracy and confusion matrix, and save the model. Use pytorch, torchvision, and matplotlib.", tags: ["code", "ml", "gpu"] },
    ],
    dataNeeded: "Labeled images. For segmentation: images + masks. For classification: images + labels.",
  },
  predict_large: {
    terminal: true, title: "Large-Scale Prediction (10K+ examples)",
    paradigmBanner: { label: "Deep Learning — Representation Learning", color: "#dc2626", explanation: "With enough data, NNs learn features from raw inputs (Section 2.4). But always benchmark against simpler baselines." },
    diy: [
      { name: "PyTorch / Lightning", libs: "pytorch, pytorch-lightning", desc: "Full control over architecture and training. At this scale, consider transformers, custom GNNs, or multi-task learning.", link: "https://pytorch-lightning.readthedocs.io/", top: true,
        howto: "import lightning as L\nimport torch\nfrom torch import nn\nfrom torch.utils.data import DataLoader, TensorDataset\n\nclass MyModel(L.LightningModule):\n    def __init__(self, input_dim, hidden_dim=128):\n        super().__init__()\n        self.net = nn.Sequential(\n            nn.Linear(input_dim, hidden_dim), nn.ReLU(),\n            nn.Linear(hidden_dim, hidden_dim), nn.ReLU(),\n            nn.Linear(hidden_dim, 1)\n        )\n    def training_step(self, batch):\n        x, y = batch\n        loss = nn.functional.mse_loss(self.net(x).squeeze(), y)\n        self.log('train_loss', loss)\n        return loss\n    def configure_optimizers(self):\n        return torch.optim.Adam(self.parameters(), lr=1e-3)\n\n# Create data loaders\ntrain_loader = DataLoader(TensorDataset(X_train_t, y_train_t), batch_size=64)\nval_loader = DataLoader(TensorDataset(X_val_t, y_val_t), batch_size=64)\n\nmodel = MyModel(input_dim=X_train.shape[1])\ntrainer = L.Trainer(max_epochs=100, callbacks=[L.callbacks.EarlyStopping('train_loss')])\ntrainer.fit(model, train_loader)",
        prompt: "I have a large dataset at {{YOUR_DATA_FILE_PATH}} ({{NUMBER_OF_ROWS}} rows). I want to predict \"{{TARGET_COLUMN}}\" using a neural network. The input features are {{BRIEF_DESCRIPTION_OF_FEATURES}}. Please load the data, build a PyTorch Lightning model with early stopping, train it, evaluate on a test set, and report performance. Also compare against an XGBoost baseline. Use pandas, torch, lightning, xgboost, scikit-learn, and matplotlib.", tags: ["code", "ml", "gpu"] },
      { name: "XGBoost / LightGBM (always try as baseline)", libs: "xgboost or lightgbm", desc: "Still competitive on tabular data even at large scale. If a tree beats your NN, your NN isn't adding value.", top: true,
        howto: "import xgboost as xgb\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import r2_score, mean_squared_error\nimport matplotlib.pyplot as plt\n\n# 1. Split data\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\n\n# 2. Train with early stopping\nmodel = xgb.XGBRegressor(n_estimators=500, learning_rate=0.05, max_depth=6)\nmodel.fit(X_train, y_train, eval_set=[(X_test, y_test)],\n          verbose=50)\n\n# 3. Evaluate\ny_pred = model.predict(X_test)\nprint(f'R²: {r2_score(y_test, y_pred):.3f}')\nprint(f'RMSE: {mean_squared_error(y_test, y_pred, squared=False):.3f}')\n\n# 4. Feature importance\nxgb.plot_importance(model, max_num_features=15)\nplt.tight_layout()\nplt.savefig('feature_importance.png')",
        prompt: "I have a large CSV at {{YOUR_CSV_FILE_PATH}} with {{NUMBER_OF_ROWS}} rows. I want to predict \"{{TARGET_COLUMN}}\" using the other columns. This is a {{regression OR classification}} problem. Please load the data, train an XGBoost model with early stopping, report performance on a held-out test set, and create a feature importance plot. Use pandas, xgboost, scikit-learn, and matplotlib.", tags: ["code", "ml"] },
    ],
    dataNeeded: "Large labeled dataset. Always compare complex models against simple baselines.",
  },
  predict_zs: {
    question: "What do you want to predict (without your own data)?",
    paradigmBanner: { label: "Self-supervised Learning — Zero-shot", color: "#dc2626", explanation: "Uses models pre-trained with self-supervised learning (Section 2.6). They learned general patterns and predict for your system without task-specific training." },
    options: [
      { label: "Effect of mutations on a protein", next: "predict_zs_mut" },
      { label: "3D structure of a protein or complex", next: "predict_zs_struct" },
      { label: "Enzyme kinetic parameters (kcat, Km)", next: "predict_zs_kin" },
      { label: "Protein function from sequence", next: "predict_zs_func" },
      { label: "Something else (using a foundation model)", next: "predict_zs_general" },
    ],
  },
  predict_zs_general: {
    terminal: true, title: "Zero-Shot Prediction (General)",
    paradigmBanner: { label: "Foundation Models — Zero-shot", color: "#dc2626", explanation: "Zero-shot works when a large pre-trained model has learned enough about your domain during self-supervised training to make useful predictions without task-specific data. The key question: does a foundation model exist for your data type?" },
    diy: [
      { name: "Check if a foundation model exists for your data", libs: "huggingface transformers", desc: "Foundation models exist for: proteins (ESM2, SaProt), molecules (MolBERT, ChemBERTa), genomic DNA (Nucleotide Transformer, HyenaDNA), single-cell RNA (scGPT, Geneformer), text (GPT, Claude). If one exists, you can often get zero-shot predictions by probing the model's learned representations.", link: "https://huggingface.co/models", top: true,
        howto: "# Example: zero-shot mutation scoring with ESM2\nimport esm\nimport torch\n\nmodel, alphabet = esm.pretrained.esm2_t33_650M_UR50D()\nmodel.eval()\nbatch_converter = alphabet.get_batch_converter()\n\n# 1. Prepare sequence with masked position\nsequence = 'MKTLLIFLA'  # your wild-type\npos = 3  # position to score (0-indexed)\nmasked_seq = sequence[:pos] + '<mask>' + sequence[pos+1:]\n\n_, _, tokens = batch_converter([('', masked_seq)])\nwith torch.no_grad():\n    logits = model(tokens)['logits']  # (1, seq_len, vocab_size)\n\n# 2. Get probabilities at the masked position\nprobs = torch.softmax(logits[0, pos+1], dim=-1)  # +1 for BOS token\n\n# 3. Score: high probability = expected (tolerated), low = disruptive\nfor aa in 'ACDEFGHIKLMNPQRSTVWY':\n    idx = alphabet.get_idx(aa)\n    print(f'{aa}: {probs[idx]:.4f}')", tags: ["code", "ml", "gpu"] },
      { name: "LLM-based zero-shot classification/extraction", libs: "anthropic or openai API", desc: "For text-like data, LLMs can do zero-shot classification, extraction, and reasoning. Describe the task in the prompt.", 
        howto: "# Example: classify research papers by topic without training data\nprompt = '''Classify this abstract into one of: [enzyme engineering, \nmetabolic engineering, bioprocess, genomics, other].\n\nAbstract: {abstract_text}\n\nCategory:'''", tags: ["code", "ai"] },
    ],
    dataNeeded: "Your input data in whatever format. The question is whether a pre-trained model exists that has seen enough similar data to be useful.",
  },
  predict_zs_mut: {
    terminal: true, title: "Zero-Shot Mutation Effect Prediction",
    hosted: [
      { name: "EVE", desc: "Variant effects from evolutionary sequences. Pre-computed for 3,219 proteins.", url: "https://evemodel.org", pricing: "Free", tags: ["nocode", "ml"] },
    ],
    diy: [
      { name: "ESM-1v log-likelihood scoring", libs: "fair-esm, torch", desc: "Score every possible single-point mutation by computing the log-likelihood ratio (mutant vs. wild-type) under the ESM-1v masked language model. Higher log-likelihood → more tolerated mutation.", link: "https://github.com/facebookresearch/esm",
        howto: "import esm\nimport torch\n\nmodel, alphabet = esm.pretrained.esm1v_t33_650M_UR90S_1()\nmodel.eval()\nbatch_converter = alphabet.get_batch_converter()\n\nwt_sequence = 'MKTLLIFLAHG'  # your wild-type sequence\n\n# Score each position: mask it, get log-probs for all 20 AAs\nfor pos in range(len(wt_sequence)):\n    masked_seq = wt_sequence[:pos] + '<mask>' + wt_sequence[pos+1:]\n    _, _, tokens = batch_converter([('wt', masked_seq)])\n    with torch.no_grad():\n        logits = model(tokens)['logits']\n    probs = torch.log_softmax(logits[0, pos+1], dim=-1)  # +1 for BOS\n    wt_score = probs[alphabet.get_idx(wt_sequence[pos])].item()\n    # Score each possible mutation at this position\n    for mut_aa in 'ACDEFGHIKLMNPQRSTVWY':\n        if mut_aa != wt_sequence[pos]:\n            mut_score = probs[alphabet.get_idx(mut_aa)].item()\n            delta = mut_score - wt_score  # positive = tolerated\n            print(f'{wt_sequence[pos]}{pos+1}{mut_aa}: {delta:.3f}')", top: true, tags: ["code", "ml", "gpu"] },
    ],
    dataNeeded: "Just the wild-type sequence.",
    clinicConnection: "Masked language modeling (Section 2.6): high model confidence at a position → mutation likely deleterious.",
  },
  predict_zs_struct: {
    question: "What kind of structure prediction?",
    options: [
      { label: "Complex with ligands, DNA/RNA, ions", next: "predict_zs_complex" },
      { label: "Single protein — need speed (many variants)", next: "predict_zs_fast" },
      { label: "Single protein — need best accuracy", next: "predict_zs_acc" },
    ],
  },
  predict_zs_complex: {
    terminal: true, title: "Predict Complex Structure",
    hosted: [
      { name: "AlphaFold 3 Server", desc: "Complexes with DNA, RNA, ligands, ions, PTMs.", url: "https://alphafoldserver.com", pricing: "Free", top: true, tags: ["nocode", "ml"] },
      { name: "Boltz-2", desc: "Open-source (MIT). Also predicts binding affinity (~20 sec/GPU).", url: "https://github.com/jwohlwend/boltz", pricing: "Free, web via Tamarind/Neurosnap", top: true, tags: ["nocode", "ml"] },
      { name: "Chai-1", desc: "AF3-level accuracy. Free academic + commercial.", url: "https://github.com/chaidiscovery/chai-lab", pricing: "Free, web via Neurosnap", tags: ["nocode", "ml"] },
    ],
    diy: [
      { name: "Run Boltz-2 locally (GPU)", libs: "boltz (pip install boltz)", desc: "MIT license, runs on a single GPU. Predicts both structure and binding affinity.", link: "https://github.com/jwohlwend/boltz",
        howto: "# pip install boltz\n# boltz predict input.yaml --output results/\n# See repo for input YAML format (sequences + ligand SMILES)", tags: ["code", "ml", "gpu"] },
    ],
    dataNeeded: "Protein sequence(s) + ligand/nucleic acid definitions.",
  },
  predict_zs_fast: {
    terminal: true, title: "Fast Structure (no MSA)",
    hosted: [
      { name: "ESMFold", desc: "Single-sequence, up to 60× faster than AF2.", url: "https://esmatlas.com/resources?action=fold", pricing: "Free web (≤400 res)", top: true, tags: ["nocode", "ml"] },
    ],
    diy: [
      { name: "ESMFold locally", libs: "fair-esm, torch", desc: "Run ESMFold on GPU for batch predictions. No MSA needed.", link: "https://github.com/facebookresearch/esm",
        howto: "import esm\nmodel = esm.pretrained.esmfold_v1()\nmodel = model.eval().cuda()\nwith torch.no_grad():\n    output = model.infer_pdb(sequence)\n# Write PDB string to file", tags: ["code", "ml", "gpu"] },
    ],
    dataNeeded: "Amino acid sequence(s).",
  },
  predict_zs_acc: {
    terminal: true, title: "High-Accuracy Structure",
    hosted: [
      { name: "ColabFold", desc: "AF2 in Colab with free GPU. MMseqs2-based MSA.", url: "https://github.com/sokrypton/ColabFold", pricing: "Free", top: true, tags: ["nocode", "ml"] },
      { name: "AlphaFold 3 Server", desc: "Most accurate.", url: "https://alphafoldserver.com", pricing: "Free", tags: ["nocode", "ml"] },
    ],
    dataNeeded: "Amino acid sequence. MSA built automatically.",
  },
  predict_zs_kin: {
    terminal: true, title: "Predict Enzyme Kinetics",
    hosted: [
      { name: "CatPred", desc: "Predicts kcat, Km, Ki from sequence + substrate, with uncertainty.", url: "https://www.catpred.com", pricing: "Free", top: true, tags: ["nocode", "ml"] },
    ],
    dataNeeded: "Enzyme sequence + substrate SMILES.",
  },
  predict_zs_func: {
    terminal: true, title: "Predict Protein Function",
    hosted: [
      { name: "DeepGO-SE", desc: "ESM2 + Gene Ontology. Excels for proteins without close homologs.", url: "https://deepgo.cbrc.kaust.edu.sa", pricing: "Free", top: true, tags: ["nocode", "ml"] },
      { name: "InterProScan", desc: "Domain/family classification from 12+ databases.", url: "https://www.ebi.ac.uk/interpro/search/sequence/", pricing: "Free", tags: ["nocode", "deterministic"] },
      { name: "eggNOG-mapper v2", desc: "Functional annotation via orthology. 15× faster than BLAST.", url: "http://eggnog-mapper.embl.de", pricing: "Free", tags: ["nocode", "deterministic"] },
    ],
    dataNeeded: "Protein sequence(s).",
  },
  predict_transfer: {
    terminal: true, title: "Transfer Learning: Pre-trained + Small Dataset",
    paradigmBanner: { label: "Transfer Learning (Section 2.5)", color: "#dc2626", explanation: "Train on large D1 first, then fine-tune on small D2. The pre-trained model provides θ' already close to a good solution. Often dramatically outperforms training from scratch." },
    diy: [
      { name: "Proteins: ESM2 embeddings + fine-tune", libs: "fair-esm or transformers, torch, scikit-learn", desc: "ESM2 was trained on millions of sequences (D1); your few variants provide task-specific labels (D2). Extract embeddings, then train a simple model.", top: true,
        howto: "import esm, torch, numpy as np\nfrom sklearn.linear_model import Ridge\nfrom sklearn.model_selection import cross_val_score\n\n# 1. Load ESM2\nmodel, alphabet = esm.pretrained.esm2_t33_650M_UR50D()\nbatch_converter = alphabet.get_batch_converter()\nmodel.eval()\n\n# 2. Extract embeddings for each variant\nembeddings = []\nfor seq in variant_sequences:\n    _, _, tokens = batch_converter([('', seq)])\n    with torch.no_grad():\n        result = model(tokens, repr_layers=[33])\n    emb = result['representations'][33][0, 1:-1].mean(0)  # mean pool\n    embeddings.append(emb.numpy())\nX = np.stack(embeddings)\n\n# 3. Train on your fitness labels\nridge = Ridge(alpha=1.0)\nscores = cross_val_score(ridge, X, y_fitness, cv=5, scoring='r2')\nprint(f'Transfer learning R²: {scores.mean():.3f} ± {scores.std():.3f}')",
        prompt: "I have {{NUMBER}} protein variant sequences in {{YOUR_FASTA_FILE}} with fitness values in {{YOUR_FITNESS_CSV}} (columns \"{{SEQUENCE_COLUMN}}\" and \"{{FITNESS_COLUMN}}\"). Please extract ESM2 embeddings for each variant, train a Ridge regression to predict fitness, evaluate with 5-fold cross-validation, and compare against a simple one-hot encoding baseline. Use fair-esm, torch, scikit-learn, numpy, and matplotlib.", tags: ["code", "ml", "gpu"] },
      { name: "Molecules: Chemprop pre-trained checkpoint", libs: "chemprop", desc: "Fine-tune a Chemprop model pre-trained on large public datasets (e.g., ChEMBL).", link: "https://github.com/chemprop/chemprop",
        howto: "# 1. Pre-train on large dataset (or use a provided checkpoint)\n# chemprop train --data-path chembl_data.csv --smiles-columns smiles \\\n#   --target-columns activity --save-dir pretrained_model/\n\n# 2. Fine-tune on your small dataset using the pre-trained model\n# chemprop train --data-path your_data.csv --smiles-columns smiles \\\n#   --target-columns your_property --model-path pretrained_model/ \\\n#   --epochs 30 --init-lr 1e-4  # lower LR for fine-tuning\n\n# 3. Predict on new molecules\n# chemprop predict --test-path new_molecules.csv --model-path finetuned_model/", tags: ["cli", "ml", "gpu"] },
      { name: "Images: torchvision pre-trained CNNs", libs: "pytorch, torchvision", desc: "Fine-tune ResNet/EfficientNet pre-trained on ImageNet. Works with as few as 100-500 labeled images.", link: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html",
        howto: "import torchvision.models as models\nimport torch.nn as nn\nfrom torchvision import transforms, datasets\nfrom torch.utils.data import DataLoader\n\n# 1. Load pre-trained model\nmodel = models.resnet18(weights='DEFAULT')\nfor param in model.parameters():\n    param.requires_grad = False  # freeze backbone\nmodel.fc = nn.Linear(model.fc.in_features, num_classes)  # new head\n\n# 2. Prepare data with ImageNet normalization\ntransform = transforms.Compose([\n    transforms.Resize(256), transforms.CenterCrop(224),\n    transforms.ToTensor(),\n    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])\n])\ndataset = datasets.ImageFolder('data/train/', transform=transform)\nloader = DataLoader(dataset, batch_size=32, shuffle=True)\n\n# 3. Train only the new head\noptimizer = torch.optim.Adam(model.fc.parameters(), lr=1e-3)\n# ... standard training loop",
        prompt: "I have labeled images at {{YOUR_IMAGE_FOLDER}} organized in subfolders by class. I have only {{NUMBER}} images total. Please fine-tune a pre-trained ResNet18 using transfer learning: freeze the backbone, replace the classification head, train on my images, evaluate on a test split, and save the model. Use pytorch, torchvision, and matplotlib.", tags: ["code", "ml", "gpu"] },
    ],
    dataNeeded: "Small labeled dataset (even 20–100 examples).",
    clinicConnection: "Section 2.5: D1 → θ' → D2 → θ. θ' is always a better starting point than random.",
  },

  // ═══════════════════════════════════════
  // GENERATE
  // ═══════════════════════════════════════
  generate: {
    question: "What do you want to create?",
    paradigmBanner: { label: "Generative AI / Self-supervised Learning", color: "#7c3aed", explanation: "Generation = self-supervised learning for creating new data (Section 2.6). Models learn the distribution of training data and sample new instances. Key paradigms: diffusion (denoising) and masked prediction." },
    options: [
      { label: "New protein structures or sequences", next: "gen_prot" },
      { label: "Metabolic pathways, circuits, or DNA parts", next: "gen_path" },
      { label: "Text, code, or reports", next: "gen_text" },
      { label: "Experimental protocols", next: "gen_proto" },
      { label: "Something else", next: "gen_general" },
    ],
  },
  gen_general: {
    terminal: true, title: "General Generative AI",
    paradigmBanner: { label: "Generative Models", color: "#7c3aed", explanation: "Generative models learn to produce new samples from a data distribution. The core paradigms are: diffusion (iteratively denoise random noise → data), autoregressive (predict next token), and VAE (learn a compressed latent space and sample from it). Which you use depends on your data modality." },
    diy: [
      { name: "LLM generation (text, code, structured data)", libs: "anthropic or openai API, or local via vllm/ollama", desc: "For anything that can be expressed as text: code, structured data (JSON, YAML), natural language, even simple designs. The most accessible form of generation.", top: true,
        howto: "import anthropic, json\n\nclient = anthropic.Anthropic()  # uses ANTHROPIC_API_KEY env var\n\nresponse = client.messages.create(\n    model='claude-sonnet-4-20250514',\n    max_tokens=1024,\n    messages=[{'role': 'user', 'content': '''Generate 5 candidate experimental conditions as JSON.\nEach should have: temperature (20-60°C), pH (5-8), substrate_conc (0.1-10 mM).\nOptimize for enzyme activity. Return a JSON array.'''}]\n)\n\nconditions = json.loads(response.content[0].text)\nfor c in conditions:\n    print(f\"Temp={c['temperature']}°C, pH={c['pH']}, Conc={c['substrate_conc']}mM\")", tags: ["code", "ai"] },
      { name: "Variational Autoencoder (VAE)", libs: "pytorch", desc: "Learn a compressed latent space from your data, then sample new points from the latent space. Good for: generating novel variants of existing data (molecules, sequences, spectra). Requires 1000+ training examples.", link: "https://pytorch.org/tutorials/beginner/variational_autoencoder.html",
        howto: "import torch\nimport torch.nn as nn\nfrom torch.utils.data import DataLoader, TensorDataset\n\nclass VAE(nn.Module):\n    def __init__(self, input_dim, latent_dim=16):\n        super().__init__()\n        self.encoder = nn.Sequential(nn.Linear(input_dim, 64), nn.ReLU(), nn.Linear(64, 32), nn.ReLU())\n        self.fc_mu = nn.Linear(32, latent_dim)\n        self.fc_var = nn.Linear(32, latent_dim)\n        self.decoder = nn.Sequential(nn.Linear(latent_dim, 32), nn.ReLU(), nn.Linear(32, 64), nn.ReLU(), nn.Linear(64, input_dim))\n\n    def encode(self, x):\n        h = self.encoder(x)\n        return self.fc_mu(h), self.fc_var(h)\n\n    def reparameterize(self, mu, logvar):\n        std = torch.exp(0.5 * logvar)\n        return mu + std * torch.randn_like(std)\n\n    def forward(self, x):\n        mu, logvar = self.encode(x)\n        z = self.reparameterize(mu, logvar)\n        return self.decoder(z), mu, logvar\n\n# Load your data as a numeric matrix (N x D)\nimport numpy as np\nX = np.loadtxt('your_data.csv', delimiter=',')\ndata = TensorDataset(torch.FloatTensor(X))\nloader = DataLoader(data, batch_size=32, shuffle=True)\n\nmodel = VAE(input_dim=X.shape[1])\noptimizer = torch.optim.Adam(model.parameters(), lr=1e-3)\n\nfor epoch in range(100):\n    for (batch,) in loader:\n        recon, mu, logvar = model(batch)\n        recon_loss = nn.functional.mse_loss(recon, batch, reduction='sum')\n        kl_loss = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())\n        loss = recon_loss + kl_loss\n        optimizer.zero_grad()\n        loss.backward()\n        optimizer.step()\n\n# Generate new samples\nz = torch.randn(10, 16)  # 10 new samples from latent space\ngenerated = model.decoder(z).detach().numpy()",
        prompt: "I have {{NUMBER}} examples of {{DESCRIPTION_OF_DATA, e.g. molecular fingerprints, protein features, spectra}} stored as numeric vectors in {{YOUR_DATA_FILE}}. I want to train a VAE to learn a latent representation and then generate new samples that are similar to but different from my training data. Please build and train a VAE in PyTorch, visualize the latent space in 2D, and generate {{NUMBER_TO_GENERATE}} new samples. Use torch, numpy, and matplotlib.", tags: ["code", "ml", "gpu"] },
      { name: "Diffusion model", libs: "pytorch, diffusers (huggingface)", desc: "Iteratively denoise random noise into data. State of the art for images and 3D structures. Requires large datasets and GPU training.", link: "https://huggingface.co/docs/diffusers/",
        howto: "from diffusers import DDPMScheduler, UNet2DModel, DDPMPipeline\nimport torch\nfrom torchvision import transforms, datasets\nfrom torch.utils.data import DataLoader\n\n# 1. Prepare your image dataset\ntransform = transforms.Compose([\n    transforms.Resize(64), transforms.CenterCrop(64),\n    transforms.ToTensor(), transforms.Normalize([0.5], [0.5])\n])\ndataset = datasets.ImageFolder('my_images/', transform=transform)\nloader = DataLoader(dataset, batch_size=16, shuffle=True)\n\n# 2. Create model and scheduler\nmodel = UNet2DModel(sample_size=64, in_channels=3, out_channels=3,\n                    block_out_channels=(64, 128, 256), layers_per_block=2)\nscheduler = DDPMScheduler(num_train_timesteps=1000)\noptimizer = torch.optim.Adam(model.parameters(), lr=1e-4)\n\n# 3. Training loop (simplified)\nfor epoch in range(100):\n    for batch in loader:\n        images = batch[0]\n        noise = torch.randn_like(images)\n        timesteps = torch.randint(0, 1000, (images.shape[0],))\n        noisy = scheduler.add_noise(images, noise, timesteps)\n        pred = model(noisy, timesteps).sample\n        loss = torch.nn.functional.mse_loss(pred, noise)\n        loss.backward()\n        optimizer.step()\n        optimizer.zero_grad()", tags: ["code", "ml", "gpu"] },
    ],
    dataNeeded: "For LLM generation: just a prompt. For VAE/diffusion: a training dataset of examples you want to generate more of (typically 1,000+).",
  },
  gen_prot: {
    question: "What kind of protein generation?",
    options: [
      { label: "Enzyme around a specific active site (theozyme)", next: "gen_enzyme" },
      { label: "Binder for a target", next: "gen_binder" },
      { label: "Novel scaffolds / folds", next: "gen_scaffold" },
      { label: "Sequence for a known backbone (inverse folding)", next: "gen_invfold" },
      { label: "Other protein generation tasks", next: "gen_prot_general" },
    ],
  },
  gen_prot_general: {
    terminal: true, title: "General Protein Generation / Design",
    paradigmBanner: { label: "Generative Protein Models", color: "#7c3aed", explanation: "Protein generation tools are evolving rapidly. The general landscape: diffusion models (RFdiffusion) for structures, inverse folding (ProteinMPNN) for sequences, language models (ESM3) for both. All available without coding via Neurosnap and Tamarind Bio." },
    hosted: [
      { name: "Neurosnap", desc: "80+ protein AI tools via web interface. Run RFdiffusion, ProteinMPNN, AlphaFold, Boltz, DiffDock, CatPred, and more. No coding.", url: "https://neurosnap.ai", pricing: "Free tier", top: true, tags: ["nocode", "ml"] },
      { name: "Tamarind Bio", desc: "100+ tools. 10 free runs/mo per tool. Excellent 'Intro to AI for Proteins' guide.", url: "https://www.tamarind.bio", pricing: "10 free/mo/tool", top: true, tags: ["nocode", "ml"] },
    ],
    diy: [
      { name: "ESM3 — multi-modal generation", libs: "EvolutionaryScale API or local weights", desc: "Generate proteins conditioned on sequence, structure, and/or function simultaneously. The most flexible single generative model.", link: "https://www.evolutionaryscale.ai",
        howto: "from esm.models.esm3 import ESM3\nfrom esm.sdk.api import ESMProtein, GenerationConfig\n\n# 1. Load model (open-weight 1.4B version)\nmodel = ESM3.from_pretrained('esm3_sm_open_v1')\n\n# 2. Create a partial protein prompt (e.g., with some sequence masked)\nprotein = ESMProtein(sequence='MKTL____VILAG____RNDQ')  # _ = positions to generate\n\n# 3. Generate completions\nconfig = GenerationConfig(track='sequence', num_steps=16, temperature=0.7)\ngenerated = model.generate(protein, config)\nprint(generated.sequence)", tags: ["code", "ml", "gpu"] },
    ],
    dataNeeded: "Depends on the task. At minimum: a description of what you want the protein to do. Specific tools need specific inputs (structures, sequences, constraints).",
  },
  gen_enzyme: {
    terminal: true, title: "De Novo Enzyme Design",
    paradigmBanner: { label: "Diffusion (Section 2.6 + 4.2)", color: "#7c3aed", explanation: "RFdiffusion uses denoising diffusion: noise → protein backbone, conditioned on active site geometry. This is Watson et al. from Section 4.2." },
    description: "Pipeline: RFdiffusion2 (backbone) → LigandMPNN (sequence) → Boltz-2 (validate)",
    hosted: [
      { name: "Neurosnap", desc: "Run RFdiffusion2, LigandMPNN, and Boltz-2 via web interface. No coding.", url: "https://neurosnap.ai", pricing: "Free tier", top: true, tags: ["nocode", "ml"] },
      { name: "Tamarind Bio", desc: "Same tools, 10 free runs/mo per tool.", url: "https://www.tamarind.bio", pricing: "10 free/mo/tool", top: true, tags: ["nocode", "ml"] },
    ],
    diy: [
      { name: "RFdiffusion2 (locally, GPU)", libs: "RFdiffusion (GitHub), PyTorch, CUDA", desc: "Run on HPC with GPU. Requires ~16GB VRAM.", link: "https://github.com/RosettaCommons/RFdiffusion",
        howto: "# Clone repo, install dependencies, download weights\n# Run with contig specification for theozyme scaffolding:\npython run_inference.py \\\n  --config-name=base \\\n  inference.input_pdb=theozyme.pdb \\\n  contigmap.contigs=['10-40/A1-5/10-40']", tags: ["code", "ml", "gpu"] },
      { name: "LigandMPNN (inverse fold with ligand context)", libs: "LigandMPNN (GitHub)", desc: "Design sequences that fold around the generated backbone + ligand. Runs on CPU in <1 sec.", link: "https://github.com/dauparas/LigandMPNN",
        howto: "python run.py \\\n  --model_type ligand_mpnn \\\n  --pdb_path designed_backbone.pdb \\\n  --out_folder output/", tags: ["cli", "ml"] },
    ],
    dataNeeded: "A theozyme: catalytic residue identities + 3D coordinates + substrate geometry.",
  },
  gen_binder: {
    terminal: true, title: "De Novo Binder Design",
    hosted: [
      { name: "BindCraft (Colab / Tamarind)", desc: "AF2 hallucination. 10–100% hit rates at nM affinity.", url: "https://github.com/martinpacesa/BindCraft", pricing: "Free", top: true, tags: ["nocode", "ml"] },
    ],
    dataNeeded: "Target protein structure (PDB). Optionally: epitope.",
  },
  gen_scaffold: {
    terminal: true, title: "Generate Novel Scaffolds",
    hosted: [
      { name: "RFdiffusion (Neurosnap/Tamarind)", desc: "Conditioned on symmetry, fold, motifs, or unconditional.", url: "https://neurosnap.ai", pricing: "Free tier", top: true, tags: ["nocode", "ml"] },
    ],
    diy: [
      { name: "Chroma — text-conditioned protein generation", libs: "chroma (GitHub)", desc: "Condition on text prompts ('a TIM barrel enzyme'), shape, symmetry.", link: "https://github.com/generatebio/chroma", tags: ["code", "ml", "gpu"] },
      { name: "ESM3 — multi-modal generative", libs: "EvolutionaryScale API", desc: "Sequence + structure + function jointly. Generated a functional novel GFP.", link: "https://www.evolutionaryscale.ai",
        howto: "from esm.models.esm3 import ESM3\nfrom esm.sdk.api import ESMProtein, GenerationConfig\n\n# Generate a novel protein scaffold unconditionally\nmodel = ESM3.from_pretrained('esm3_sm_open_v1')\nprotein = ESMProtein(sequence='_' * 100)  # 100 residues, fully masked\nconfig = GenerationConfig(track='sequence', num_steps=32, temperature=0.7)\ngenerated = model.generate(protein, config)\nprint(generated.sequence)", tags: ["code", "ml", "gpu"] },
    ],
    dataNeeded: "Optional conditioning specs.",
  },
  gen_invfold: {
    terminal: true, title: "Inverse Folding (backbone → sequence)",
    hosted: [
      { name: "ProteinMPNN / LigandMPNN (Neurosnap/Tamarind)", desc: "Web interface, no coding. <1 sec per design.", url: "https://neurosnap.ai", pricing: "Free tier", top: true, tags: ["nocode", "ml"] },
    ],
    diy: [
      { name: "ProteinMPNN locally", libs: "ProteinMPNN (GitHub), PyTorch", desc: "Runs on CPU. Generates multiple sequence candidates per backbone.", link: "https://github.com/dauparas/LigandMPNN",
        howto: "python run.py \\\n  --pdb_path backbone.pdb \\\n  --out_folder output/ \\\n  --num_seq_per_target 100  # generate 100 candidate sequences", tags: ["cli", "ml"] },
    ],
    dataNeeded: "A 3D backbone (PDB file).",
  },
  gen_path: {
    terminal: true, title: "Design Pathways, Circuits, or DNA Parts",
    hosted: [
      { name: "Galaxy-SynBioCAD", desc: "No-code: retrosynthesis → scoring → DNA parts → robotic scripts.", url: "https://galaxy-synbiocad.org", pricing: "Free", top: true, tags: ["nocode", "deterministic"] },
      { name: "RetroPath2.0", desc: "400K+ reaction rules. Found routes for ~84% of known targets.", url: "https://retrorules.org", pricing: "Free", tags: ["nocode", "deterministic"] },
      { name: "Cello 2.0", desc: "Boolean logic (Verilog) → genetic circuit DNA.", url: "https://www.cidarlab.org/cello", pricing: "Free", tags: ["nocode", "deterministic"] },
      { name: "De Novo DNA (Salis Lab)", desc: "Design of RBS, promoters, and operons using biophysical models. Predicts translation initiation rates.", url: "https://salislab.net/software/login", pricing: "Free", tags: ["nocode", "deterministic", "new"] },
      { name: "CHOPCHOP", desc: "CRISPR guide RNA design for multiple Cas enzymes across 200+ genomes. Ranks by efficiency and off-target scores.", url: "https://chopchop.cbu.uib.no/", pricing: "Free", tags: ["nocode", "deterministic", "new"] },
      { name: "Evo Designer", desc: "AI-powered DNA sequence design from the Arc Institute's Evo foundation model.", url: "https://arcinstitute.org/tools/evo/evo-designer", pricing: "Free", tags: ["nocode", "ai", "ml", "new"] },
    ],
    diy: [
      { name: "DNA Chisel — multi-constraint codon optimization", libs: "dnachisel (pip install dnachisel)", desc: "Satisfies multiple constraints simultaneously: restriction sites, GC content, vendor constraints, codon usage tables.", link: "https://github.com/Edinburgh-Genome-Foundry/DnaChisel",
        howto: "from dnachisel import DnaOptimizationProblem, CodonOptimize, AvoidPattern\n\nproblem = DnaOptimizationProblem(\n    sequence=my_sequence,\n    constraints=[AvoidPattern('BsaI_site')],\n    objectives=[CodonOptimize(species='e_coli')]\n)\nproblem.resolve_constraints()\nproblem.optimize()",
        prompt: "I have a protein coding DNA sequence: {{YOUR_DNA_SEQUENCE_OR_FILE}}. I want to codon-optimize it for expression in {{TARGET_ORGANISM, e.g. E. coli, S. cerevisiae}} while avoiding {{RESTRICTION_SITES_TO_AVOID, e.g. BsaI, BbsI}} and keeping GC content between 40-60%. Please optimize the sequence using DNA Chisel, report what changes were made, and output the optimized sequence. Use dnachisel.", tags: ["code", "deterministic"] },
    ],
    dataNeeded: "Target molecule (SMILES/name) or Boolean logic spec.",
  },
  gen_text: {
    terminal: true, title: "Generate Text, Code, or Reports",
    paradigmBanner: { label: "LLMs — Causal Language Modeling", color: "#7c3aed", explanation: "LLMs = self-supervised on text (Section 2.6): predict the next token. The 'general AI' from Section 1.1." },
    hosted: [
      { name: "Claude", desc: "Strongest reasoning for scientific content.", url: "https://claude.com", pricing: "Free tier; Pro $20/mo", top: true, tags: ["nocode", "ai"] },
      { name: "GitHub Copilot", desc: "Best in-IDE code completion. 2,000 free completions/mo.", url: "https://github.com/features/copilot", pricing: "Free; Pro $10/mo", top: true, tags: ["nocode", "ai"] },
      { name: "Cursor", desc: "Most powerful multi-file agentic editing.", url: "https://cursor.com", pricing: "Free tier; Pro $20/mo", tags: ["nocode", "ai"] },
    ],
    diy: [
      { name: "Run open-source LLMs on HPC (vLLM)", libs: "vllm, torch", desc: "Deploy Qwen, Mistral, Llama on HPC GPUs. Useful for batch processing, sensitive data, or custom fine-tuning.", link: "https://docs.vllm.ai/",
        howto: "# On Kestrel / HPC with H100s:\npip install vllm\npython -m vllm.entrypoints.openai.api_server \\\n  --model mistralai/Mistral-7B-Instruct-v0.3 \\\n  --tensor-parallel-size 2  # multi-GPU", tags: ["cli", "ai", "gpu"] },
    ],
    dataNeeded: "A clear prompt. Be specific, provide examples.",
  },
  gen_proto: {
    terminal: true, title: "Generate Experimental Protocols",
    hosted: [
      { name: "CRISPR-GPT", desc: "Automates CRISPR design. 90%+ editing efficiency for a novice.", url: "https://genomics.stanford.edu", pricing: "Free beta", top: true, tags: ["nocode", "ai"] },
      { name: "CHOPCHOP v3", desc: "Guide RNA design for Cas9/12a/13 across 200+ organisms.", url: "https://chopchop.cbu.uib.no", pricing: "Free", tags: ["nocode", "deterministic"] },
      { name: "CRISPOR", desc: "30+ Cas variants, 549+ genomes.", url: "http://crispor.tefor.net", pricing: "Free", tags: ["nocode", "deterministic"] },
      { name: "Opentrons AI", desc: "Liquid handling protocols from natural language.", url: "https://opentrons.com", pricing: "Free (with hardware)", tags: ["nocode", "ai"] },
    ],
    dataNeeded: "Target gene/region + organism. Or natural language experiment description.",
  },

  // ═══════════════════════════════════════
  // OPTIMIZE
  // ═══════════════════════════════════════
  optimize: {
    question: "What is the optimization loop?",
    paradigmBanner: { label: "Active Learning / Bayesian Optimization", color: "#059669", explanation: "Optimization = active learning (Section 2.3). The model proposes experiments, you measure, it updates. Key: surrogate function + acquisition function (UCB from Clinic 1) to balance exploration vs. exploitation." },
    options: [
      { label: "Physical experiments (wet lab, reactor)", next: "opt_physical" },
      { label: "Computational experiments (simulations)", next: "opt_compute" },
      { label: "ML model hyperparameters", next: "opt_hyper" },
    ],
  },
  opt_physical: {
    question: "What are you optimizing?",
    options: [
      { label: "Protein variants (directed evolution)", next: "predict_small_prot" },
      { label: "Growth conditions / media / reaction parameters", next: "opt_conditions" },
      { label: "Genetic modifications for strain performance", next: "opt_strain" },
      { label: "DNA sequence design (RBS, promoters, guide RNAs)", next: "gen_path" },
      { label: "Something else in the lab", next: "opt_general" },
    ],
  },
  opt_general: {
    terminal: true, title: "General Lab Optimization (Bayesian Optimization)",
    paradigmBanner: { label: "Bayesian Optimization — The General Recipe", color: "#059669", explanation: "Any iterative lab optimization with continuous or mixed parameters can be framed as Bayesian optimization. You need: (1) a parameter space with bounds, (2) an objective to maximize/minimize, (3) the ability to run experiments in rounds." },
    diy: [
      { name: "GP + UCB in scikit-learn (general recipe)", libs: "scikit-learn, numpy", desc: "This works for ANY optimization problem where experiments are expensive and you can define numeric input parameters + a numeric outcome. Temperature, pH, concentrations, flow rates, residence times, pressures — anything.", top: true,
        howto: "from sklearn.gaussian_process import GaussianProcessRegressor\nfrom sklearn.gaussian_process.kernels import Matern\nimport numpy as np\n\n# Define your parameter space\nbounds = np.array([\n    [20, 60],    # param 1: temperature (°C)\n    [5.0, 8.0],  # param 2: pH\n    [0.1, 10],   # param 3: concentration (mM)\n])  # shape: (n_params, 2)\n\n# Your initial experiments\nX_tested = np.array([...])  # shape: (n_experiments, n_params)\ny_tested = np.array([...])  # shape: (n_experiments,)\n\n# Fit surrogate\ngp = GaussianProcessRegressor(kernel=Matern(nu=2.5), normalize_y=True)\ngp.fit(X_tested, y_tested)\n\n# Score random candidates\nX_candidates = np.random.uniform(bounds[:,0], bounds[:,1], size=(10000, len(bounds)))\ny_pred, y_std = gp.predict(X_candidates, return_std=True)\n\n# UCB acquisition\nbeta = 2.0\nnext_experiment = X_candidates[np.argmax(y_pred + beta * y_std)]\nprint(f'Next experiment: {next_experiment}')",
        prompt: "I'm optimizing {{WHAT_YOU_ARE_OPTIMIZING, e.g. enzyme activity, growth rate, yield}}. My parameters are {{PARAMETER_NAMES_AND_BOUNDS, e.g. temperature (20-60°C), pH (5-8), concentration (0.1-10 mM)}}. I have {{NUMBER}} experiments so far in a CSV at {{YOUR_CSV_FILE_PATH}} with columns for each parameter and the outcome \"{{OUTCOME_COLUMN}}\". Please fit a Gaussian Process model, use UCB acquisition to suggest the next {{NUMBER}} experiments, and visualize the predicted response surface. Use scikit-learn, numpy, and matplotlib.", tags: ["code", "ml"] },
      { name: "BoTorch for advanced use cases", libs: "botorch, gpytorch, torch", desc: "Use when you need: batch acquisition (select N experiments per round), multi-objective optimization, constraints (e.g., cost limits), or mixed continuous/categorical parameters.", link: "https://botorch.org/",
        howto: "import torch\nfrom botorch.models import SingleTaskGP\nfrom botorch.fit import fit_gpytorch_mll\nfrom botorch.acquisition import qExpectedImprovement\nfrom botorch.optim import optimize_acqf\nfrom gpytorch.mlls import ExactMarginalLogLikelihood\n\n# Your data: parameters tested and outcomes measured\ntrain_X = torch.tensor([[25.0, 6.5], [40.0, 7.0], [55.0, 5.5]])  # (N, D)\ntrain_Y = torch.tensor([[1.2], [3.5], [2.1]])  # (N, 1)\nbounds = torch.tensor([[20.0, 5.0], [60.0, 8.0]])  # (2, D) lower/upper\n\n# Fit GP model\nmodel = SingleTaskGP(train_X, train_Y)\nmll = ExactMarginalLogLikelihood(model.likelihood, model)\nfit_gpytorch_mll(mll)\n\n# Select next batch of 5 experiments\nacqf = qExpectedImprovement(model, best_f=train_Y.max())\ncandidates, acq_value = optimize_acqf(\n    acqf, bounds=bounds, q=5, num_restarts=20, raw_samples=512\n)\nprint('Next experiments to run:')\nfor i, c in enumerate(candidates):\n    print(f'  Experiment {i+1}: param1={c[0]:.1f}, param2={c[1]:.2f}')", tags: ["code", "ml", "gpu"] },
    ],
    dataNeeded: "Parameter space definition (bounds for each variable) + initial experiments (~10–30 with measured outcomes). Plan for 3–10 iterative rounds.",
    clinicConnection: "This is the UCB demo from Section 2.3 generalized to any domain. The math is identical — only the parameters and objectives change.",
  },
  opt_conditions: {
    terminal: true, title: "Optimize Process Conditions / Media",
    paradigmBanner: { label: "Bayesian Optimization", color: "#059669", explanation: "Exactly the UCB example from Section 2.3 — in multiple dimensions. GP models the response surface, acquisition function picks the most informative next experiment, balancing exploitation (try predicted best) and exploration (try uncertain regions)." },
    hosted: [
      { name: "ART (JBEI/LBL)", desc: "DOE lab tool. Bayesian ensemble. 106% tryptophan improvement.", url: "https://github.com/JBEI/ART", pricing: "Free (email azournas@lbl.gov)", top: true, tags: ["code", "ml"] },
    ],
    diy: [
      { name: "Gaussian process Bayesian optimization (scikit-learn)", libs: "scikit-learn, numpy", desc: "Fit a GP surrogate to your data, compute UCB or Expected Improvement, select the next experiment at the acquisition function maximum. This is the active learning loop from Clinic 1 Section 2.3 generalized to N dimensions.", top: true,
        howto: "from sklearn.gaussian_process import GaussianProcessRegressor\nfrom sklearn.gaussian_process.kernels import Matern\nimport numpy as np\n\n# Your data: X = conditions tested (N x D), y = outcomes\ngp = GaussianProcessRegressor(kernel=Matern(nu=2.5), normalize_y=True)\ngp.fit(X_tested, y_tested)\n\n# Generate candidate conditions (grid or random)\nX_candidates = np.random.uniform(low=bounds[:,0], high=bounds[:,1], size=(10000, D))\ny_pred, y_std = gp.predict(X_candidates, return_std=True)\n\n# UCB acquisition function\nbeta = 2.0  # exploration weight\nucb = y_pred + beta * y_std\nnext_experiment = X_candidates[np.argmax(ucb)]",
        prompt: "I have a CSV at {{YOUR_CSV_FILE_PATH}} with my experimental results so far. The parameter columns are {{PARAMETER_COLUMNS, e.g. temperature, pH, concentration}} and the outcome column is \"{{OUTCOME_COLUMN}}\". The parameter bounds are {{PARAMETER_BOUNDS, e.g. temperature: 20-60, pH: 5-8}}. Please fit a Gaussian Process model to my data, use UCB acquisition to suggest the next {{NUMBER}} experiments to run, and create a visualization of the GP predictions with uncertainty. Use pandas, scikit-learn, numpy, and matplotlib.", tags: ["code", "ml"] },
      { name: "BoTorch — production Bayesian optimization", libs: "botorch, gpytorch, torch", desc: "Facebook's library for advanced BayesOpt. Supports batch acquisition (select multiple experiments per round), multi-objective optimization, and constrained optimization. Use when you outgrow scikit-learn GPs.", link: "https://botorch.org/",
        howto: "import torch\nfrom botorch.models import SingleTaskGP\nfrom botorch.fit import fit_gpytorch_mll\nfrom botorch.acquisition import qExpectedImprovement\nfrom botorch.optim import optimize_acqf\nfrom gpytorch.mlls import ExactMarginalLogLikelihood\n\n# Fit GP\nmodel = SingleTaskGP(train_X, train_Y)\nmll = ExactMarginalLogLikelihood(model.likelihood, model)\nfit_gpytorch_mll(mll)\n\n# Optimize acquisition function\nacqf = qExpectedImprovement(model, best_f=train_Y.max())\ncandidates, _ = optimize_acqf(acqf, bounds=bounds, q=5, num_restarts=20)", tags: ["code", "ml", "gpu"] },
      { name: "Intellegens Alchemite", libs: "N/A (SaaS)", desc: "Commercial: enhances DOE with ML. Claims 50–80% fewer experiments.", link: "https://intellegens.com/doe/", tags: ["nocode", "ml"] },
    ],
    dataNeeded: "Initial experiments (~10–30 conditions + outcomes). Define parameter bounds (temperature: [20, 60], pH: [5, 8], etc.). Plan for 3–10 iterative rounds.",
    clinicConnection: "The UCB demo from Section 2.3, generalized to multiple dimensions. Each round: fit GP → compute acquisition → experiment → repeat.",
  },
  opt_strain: {
    terminal: true, title: "Optimize Strain Performance (DBTL)",
    hosted: [
      { name: "ART (JBEI/LBL)", desc: "Bayesian ensemble for DBTL. Proven on biofuel production optimization.", url: "https://github.com/JBEI/ART", pricing: "Free academic", top: true, tags: ["code", "ml"] },
    ],
    diy: [
      { name: "Custom DBTL loop with BayesOpt", libs: "scikit-learn or botorch", desc: "Same GP + acquisition function approach as process optimization, but features are genetic modifications (promoter strengths, gene presence/absence) and outcomes are titer/rate/yield.",
        howto: "import numpy as np\nfrom sklearn.gaussian_process import GaussianProcessRegressor\nfrom sklearn.gaussian_process.kernels import Matern\n\n# 1. Encode genetic modifications as numeric features\n# Knockouts: binary (0/1), promoter strengths: continuous, copy number: integer\nX_tested = np.array([\n    # [gene1_ko, gene2_ko, promoter_strength, copy_num]\n    [1, 0, 0.5, 2],  # construct 1\n    [0, 1, 0.8, 1],  # construct 2\n    # ... your constructs\n])\ny_tested = np.array([1.2, 3.5])  # measured titer/rate/yield\n\n# 2. Fit GP surrogate\ngp = GaussianProcessRegressor(kernel=Matern(nu=2.5), normalize_y=True)\ngp.fit(X_tested, y_tested)\n\n# 3. Score candidate constructs with UCB\nX_candidates = np.random.uniform(0, 1, size=(5000, 4))  # random candidates\nX_candidates[:, [0, 1]] = np.round(X_candidates[:, [0, 1]])  # binary KOs\nX_candidates[:, 3] = np.round(X_candidates[:, 3] * 5)  # integer copy number\n\ny_pred, y_std = gp.predict(X_candidates, return_std=True)\nbeta = 2.0\nucb = y_pred + beta * y_std\nnext_construct = X_candidates[np.argmax(ucb)]\nprint(f'Next construct to build: {next_construct}')",
        prompt: "I'm doing directed evolution / strain engineering. I have {{NUMBER}} genetic constructs tested so far in {{YOUR_CSV_FILE_PATH}} with columns for genetic modifications ({{MODIFICATION_COLUMNS, e.g. gene knockouts, promoter strengths, copy numbers}}) and measured outcome \"{{OUTCOME_COLUMN}}\". Please encode the modifications as numeric features, fit a GP model, use UCB to suggest the next {{BATCH_SIZE}} constructs to build, and visualize feature importances. Use scikit-learn, numpy, and matplotlib.", tags: ["code", "ml"] },
    ],
    dataNeeded: "Genetic modifications + measured outcomes. Even 20–50 constructs can seed the first model.",
  },
  opt_compute: {
    terminal: true, title: "Optimize Over Simulations",
    paradigmBanner: { label: "Surrogate Modeling + BayesOpt", color: "#059669", explanation: "When each simulation is expensive, build a cheap ML surrogate (supervised learning), then optimize over the surrogate. This is the Hyun-Seob et al. pattern from Section 4.1." },
    hosted: [
      { name: "COBRApy + StrainDesign", desc: "GEM optimization: OptKnock, FVA, RobustKnock.", url: "https://github.com/opencobra/cobrapy", pricing: "Free", top: true, tags: ["code", "deterministic"] },
    ],
    diy: [
      { name: "ML surrogate + Bayesian optimization", libs: "scikit-learn or pytorch, botorch", desc: "1) Sample parameter space (Latin hypercube). 2) Run simulation at each point. 3) Train ML surrogate on simulation I/O. 4) Optimize over surrogate with BayesOpt.",
        howto: "from scipy.stats import qmc\n\n# 1. Sample parameter space\nsampler = qmc.LatinHypercube(d=num_params)\nX_sample = sampler.random(n=500)\nX_sample = qmc.scale(X_sample, bounds[:,0], bounds[:,1])\n\n# 2. Run simulation at each point\ny_sample = [run_simulation(x) for x in X_sample]\n\n# 3. Train surrogate (neural network or GP)\nfrom sklearn.neural_network import MLPRegressor\nsurrogate = MLPRegressor(hidden_layer_sizes=(64, 64)).fit(X_sample, y_sample)\n\n# 4. Optimize over surrogate (grid search or BayesOpt)\n# Much cheaper than optimizing over the real simulation",
        prompt: "I have a simulation that takes {{PARAMETER_NAMES_AND_BOUNDS}} as input and produces {{OUTPUT_DESCRIPTION}} as output. Each simulation run takes {{TIME_PER_RUN}}. I've already run {{NUMBER}} simulations and saved the results in {{YOUR_CSV_FILE_PATH}}. Please train an ML surrogate model on the simulation data, then use Bayesian optimization over the surrogate to find the optimal parameters. Compare the surrogate predictions against a few validation simulation runs. Use scikit-learn, numpy, scipy, and matplotlib.", tags: ["code", "ml"] },
      { name: "BioSTEAM — TEA/LCA optimization", libs: "biosteam", desc: "Python framework for techno-economic + life cycle analysis of biorefineries.", link: "https://biosteam.readthedocs.io/",
        howto: "import biosteam as bst\nfrom biorefineries import cellulosic\n\n# 1. Load a biorefinery model (e.g., cellulosic ethanol)\ncellulosic.load()\nsys = bst.main_flowsheet.system\n\n# 2. Run TEA\nsys.simulate()\ntea = sys.TEA\nprint(f'MPSP: ${tea.solve_price(cellulosic.ethanol):.2f}/gal')\nprint(f'NPV: ${tea.NPV/1e6:.1f}M')\n\n# 3. Sensitivity analysis — vary a parameter\nimport numpy as np\nprices = []\nfor yield_factor in np.linspace(0.5, 1.5, 20):\n    cellulosic.set_yield(yield_factor)\n    sys.simulate()\n    prices.append(tea.solve_price(cellulosic.ethanol))\n# Plot prices vs. yield_factor", tags: ["code", "deterministic"] },
    ],
    dataNeeded: "A parameterized simulation. Generate training data via Latin hypercube or Sobol sampling.",
    clinicConnection: "Hyun-Seob et al. (Section 4.1): replace FBA with neural network for 1000× speedup.",
  },
  opt_hyper: {
    terminal: true, title: "Hyperparameter Optimization",
    paradigmBanner: { label: "Meta-Optimization (Section 3.4)", color: "#059669" },
    diy: [
      { name: "Optuna — Bayesian hyperparameter search", libs: "optuna", desc: "State-of-the-art. Tree-structured Parzen estimator + pruning. Automatically stops bad trials early.", link: "https://optuna.org/", top: true,
        howto: "import optuna\n\ndef objective(trial):\n    params = {\n        'max_depth': trial.suggest_int('max_depth', 3, 10),\n        'learning_rate': trial.suggest_float('lr', 1e-3, 0.3, log=True),\n        'n_estimators': trial.suggest_int('n_est', 50, 500),\n    }\n    model = xgb.XGBRegressor(**params)\n    score = cross_val_score(model, X, y, cv=5, scoring='r2').mean()\n    return score\n\nstudy = optuna.create_study(direction='maximize')\nstudy.optimize(objective, n_trials=100)",
        prompt: "I have an ML model ({{MODEL_TYPE, e.g. XGBoost, Random Forest, neural network}}) trained on data at {{YOUR_CSV_FILE_PATH}} predicting \"{{TARGET_COLUMN}}\". I want to find the best hyperparameters. Please set up an Optuna study that tunes the model's hyperparameters using 5-fold cross-validation, run 100 trials, print the best parameters and score, and plot the optimization history. Use optuna, the relevant ML library, scikit-learn, and matplotlib.", tags: ["code", "ml"] },
      { name: "RandomizedSearchCV (scikit-learn)", libs: "scikit-learn", desc: "Simple random search with cross-validation. Good starting point. Usually better than grid search.", link: "https://scikit-learn.org/stable/modules/grid_search.html",
        howto: "from sklearn.model_selection import RandomizedSearchCV\nfrom sklearn.ensemble import RandomForestRegressor\nfrom scipy.stats import randint, uniform\nimport pandas as pd\n\ndf = pd.read_csv('your_data.csv')\nX = df.drop(columns=['target'])\ny = df['target']\n\nmodel = RandomForestRegressor()\nparam_distributions = {\n    'n_estimators': randint(50, 500),\n    'max_depth': randint(3, 15),\n    'min_samples_split': randint(2, 20),\n    'max_features': uniform(0.3, 0.7),\n}\nsearch = RandomizedSearchCV(model, param_distributions, n_iter=50, cv=5, scoring='r2', verbose=1)\nsearch.fit(X, y)\nprint(f'Best R²: {search.best_score_:.3f}')\nprint(f'Best params: {search.best_params_}')", tags: ["code", "ml"] },
    ],
    dataNeeded: "Your ML pipeline + validation metric.",
    clinicConnection: "Section 3.4. Random > grid. Optuna = Bayesian optimization applied to hyperparameters.",
  },

  // ═══════════════════════════════════════
  // UNDERSTAND
  // ═══════════════════════════════════════
  understand: {
    question: "What kind of understanding?",
    paradigmBanner: { label: "Unsupervised Learning / Exploratory Analysis", color: "#d97706", explanation: "Understanding = unsupervised learning (Section 2.2) or EDA. No labels needed — looking for structure: clusters, dimensions of variation, correlations, outliers." },
    options: [
      { label: "Find natural groups / clusters", next: "und_cluster" },
      { label: "Visualize high-dimensional data in 2D/3D", next: "und_dim" },
      { label: "Explore & visualize a dataset (general EDA)", next: "und_eda" },
      { label: "What drives my model's predictions?", next: "und_interp" },
      { label: "Annotate a genome or assign functions", next: "und_annot" },
      { label: "Profile a microbial community", next: "und_micro" },
      { label: "Something else", next: "und_general" },
    ],
  },
  und_general: {
    terminal: true, title: "General Exploratory Analysis & Pattern Discovery",
    paradigmBanner: { label: "Unsupervised Learning — General", color: "#d97706", explanation: "When you have data but no specific labels, unsupervised methods help you find structure. The general progression is: visualize → cluster → interpret. This applies to any numeric feature matrix." },
    diy: [
      { name: "The EDA → dim reduction → clustering pipeline", libs: "pandas, scikit-learn, umap-learn, matplotlib, seaborn", desc: "A general-purpose analysis pipeline for any high-dimensional dataset. Works for: gene expression, mass spec, process data, survey data, embeddings, etc.", top: true,
        howto: "import pandas as pd\nimport numpy as np\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\nimport umap\nimport hdbscan\nimport matplotlib.pyplot as plt\n\n# 1. Load and clean\ndf = pd.read_csv('data.csv')\nX = df.select_dtypes(include=[np.number]).dropna()\n\n# 2. Scale\nX_scaled = StandardScaler().fit_transform(X)\n\n# 3. PCA — how many dimensions matter?\npca = PCA().fit(X_scaled)\nplt.plot(np.cumsum(pca.explained_variance_ratio_))\nplt.xlabel('Components'); plt.ylabel('Cumulative variance')\n\n# 4. UMAP for visualization\nX_2d = umap.UMAP().fit_transform(X_scaled)\n\n# 5. Cluster\nlabels = hdbscan.HDBSCAN(min_cluster_size=10).fit_predict(X_2d)\nplt.scatter(X_2d[:,0], X_2d[:,1], c=labels, s=5, cmap='tab20')",
        prompt: "I have a dataset at {{YOUR_DATA_FILE}} with many numeric columns. I want to explore the structure of this data: are there natural groups? What are the main dimensions of variation? Please run a full unsupervised analysis: standardize the features, do PCA to see how many dimensions matter, project to 2D with UMAP, cluster with HDBSCAN, and create labeled visualizations. Save a CSV with cluster assignments. Use pandas, scikit-learn, umap-learn, hdbscan, and matplotlib.", tags: ["code", "ml"] },
      { name: "Correlation analysis", libs: "pandas, seaborn", desc: "Before any ML, look at pairwise correlations. Often the simplest analysis is the most informative.",
        howto: "import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\n\ndf = pd.read_csv('your_data.csv')\n\n# Compute correlation matrix\ncorr = df.select_dtypes(include='number').corr()\n\n# Plot heatmap\nplt.figure(figsize=(10, 8))\nsns.heatmap(corr, annot=True, cmap='coolwarm', center=0, fmt='.2f')\nplt.tight_layout()\nplt.savefig('correlation_heatmap.png')\n\n# Find strongest correlations (excluding self-correlations)\nimport numpy as np\nmask = np.triu(np.ones_like(corr, dtype=bool), k=1)\ntop_pairs = corr.where(mask).stack().sort_values(ascending=False)\nprint('Top correlations:')\nprint(top_pairs.head(10))", tags: ["code", "deterministic"] },
    ],
    dataNeeded: "Any dataset with multiple numeric features across multiple examples. The more examples and features, the more structure you can find.",
    clinicConnection: "Section 2.2 (unsupervised learning). Clustering and dim reduction are the two main unsupervised tools. PCA is linear, UMAP is non-linear.",
  },
  und_cluster: {
    terminal: true, title: "Find Clusters",
    paradigmBanner: { label: "Unsupervised — Clustering (Section 2.2)", color: "#d97706" },
    diy: [
      { name: "KMeans — when you know ~how many groups", libs: "scikit-learn", desc: "Fast. Specify k. Use the elbow method or silhouette score to choose k.", top: true,
        howto: "from sklearn.cluster import KMeans\nfrom sklearn.metrics import silhouette_score\nfrom sklearn.preprocessing import StandardScaler\n\nX_scaled = StandardScaler().fit_transform(X)\n\n# Try different k, pick best silhouette\nfor k in range(2, 10):\n    km = KMeans(n_clusters=k, n_init=10)\n    labels = km.fit_predict(X_scaled)\n    print(f'k={k}, silhouette={silhouette_score(X_scaled, labels):.3f}')",
        prompt: "I have a dataset at {{YOUR_DATA_FILE}} with numeric columns. I think there are roughly {{EXPECTED_NUMBER}} natural groups in this data. Please load the data, standardize the features, run KMeans clustering for k=2 through k=10, plot the silhouette scores to find the best k, then visualize the clusters using PCA or UMAP. Save a CSV with the cluster labels appended. Use pandas, scikit-learn, matplotlib, and umap-learn.", tags: ["code", "ml"] },
      { name: "HDBSCAN — discover clusters automatically", libs: "hdbscan or scikit-learn (v1.3+)", desc: "No need to specify k. Handles noise points (labels them as -1). Works well after UMAP dimensionality reduction.",
        howto: "import hdbscan\n\nclustering = hdbscan.HDBSCAN(min_cluster_size=15)\nlabels = clustering.fit_predict(X_scaled)\nprint(f'Found {len(set(labels)) - 1} clusters + noise')", tags: ["code", "ml"] },
      { name: "UMAP + HDBSCAN (common combo)", libs: "umap-learn, hdbscan", desc: "Reduce to low-D with UMAP first, then cluster. Often better than clustering in high-D.", top: true,
        howto: "import umap\nimport hdbscan\n\nreducer = umap.UMAP(n_components=10)  # reduce to 10D for clustering\nX_umap = reducer.fit_transform(X_scaled)\n\nlabels = hdbscan.HDBSCAN(min_cluster_size=15).fit_predict(X_umap)",
        prompt: "I have a dataset at {{YOUR_DATA_FILE}} with numeric feature columns. I want to discover natural groupings without specifying how many clusters to expect. Please load the data, standardize the features, reduce dimensionality with UMAP, cluster with HDBSCAN, create a 2D scatter plot colored by cluster, and save a CSV with cluster labels appended. Use pandas, scikit-learn, umap-learn, hdbscan, and matplotlib.", tags: ["code", "ml"] },
    ],
    dataNeeded: "N × M numeric feature matrix. Scale features (StandardScaler) first.",
  },
  und_dim: {
    terminal: true, title: "Dimensionality Reduction & Visualization",
    paradigmBanner: { label: "Unsupervised — Dim. Reduction (Section 2.2)", color: "#d97706" },
    diy: [
      { name: "PCA — linear, interpretable", libs: "scikit-learn", desc: "Start here. PC axes tell you the main directions of variation. Variance explained ratio tells you how much information each PC captures.", top: true,
        howto: "from sklearn.decomposition import PCA\nimport matplotlib.pyplot as plt\n\npca = PCA(n_components=2)\nX_pca = pca.fit_transform(X_scaled)\nprint(f'Explained variance: {pca.explained_variance_ratio_}')\n\nplt.scatter(X_pca[:, 0], X_pca[:, 1], c=labels_if_any)\nplt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')",
        prompt: "I have a dataset at {{YOUR_DATA_FILE}} with many numeric columns. I want to understand the main dimensions of variation. Please load the data, standardize the features, run PCA, plot a scree plot (cumulative variance explained), create a 2D scatter plot of PC1 vs PC2 {{colored by LABEL_COLUMN if you have one, otherwise leave uncolored}}, and print which original features contribute most to each PC. Use pandas, scikit-learn, and matplotlib.", tags: ["code", "deterministic"] },
      { name: "UMAP — non-linear, preserves local structure", libs: "umap-learn", desc: "Better than t-SNE for most biological data. Faster, and UMAP distances are more interpretable.", top: true,
        howto: "import umap\n\nreducer = umap.UMAP(n_neighbors=15, min_dist=0.1, metric='euclidean')\nX_2d = reducer.fit_transform(X_scaled)\nplt.scatter(X_2d[:, 0], X_2d[:, 1], c=labels, s=5)",
        prompt: "I have a high-dimensional dataset at {{YOUR_DATA_FILE}} with numeric columns. I want to visualize it in 2D to see if there are natural groupings or structure. Please load the data, standardize the features, run UMAP to project to 2D, and create a scatter plot {{colored by LABEL_COLUMN if available}}. Save the plot. Use pandas, scikit-learn, umap-learn, and matplotlib.", tags: ["code", "ml"] },
      { name: "t-SNE — non-linear, visualization only", libs: "scikit-learn", desc: "Classic for visualization. Slower. Distances between clusters are NOT meaningful (only within-cluster structure is).",
        howto: "import pandas as pd\nimport numpy as np\nfrom sklearn.manifold import TSNE\nfrom sklearn.preprocessing import StandardScaler\nimport matplotlib.pyplot as plt\n\ndf = pd.read_csv('your_data.csv')\nX = df.select_dtypes(include='number').dropna()\nX_scaled = StandardScaler().fit_transform(X)\n\ntsne = TSNE(n_components=2, perplexity=30, random_state=42)\nX_2d = tsne.fit_transform(X_scaled)\n\nplt.figure(figsize=(8, 6))\nplt.scatter(X_2d[:, 0], X_2d[:, 1], s=5, alpha=0.7)\nplt.xlabel('t-SNE 1')\nplt.ylabel('t-SNE 2')\nplt.title('t-SNE visualization')\nplt.savefig('tsne_plot.png')", tags: ["code", "ml"] },
    ],
    dataNeeded: "High-dimensional numeric feature matrix.",
  },
  und_eda: {
    terminal: true, title: "Exploratory Data Analysis",
    hosted: [
      { name: "Claude / ChatGPT Analysis", desc: "Upload CSV, describe what you want. Generates plots + statistics.", url: "https://claude.com", pricing: "Free tier / $20/mo", top: true, tags: ["nocode", "ai"] },
      { name: "Julius AI", desc: "No-code: upload data, ask in English.", url: "https://julius.ai", pricing: "Free (15 msgs/mo)", tags: ["nocode", "ai"] },
    ],
    diy: [
      { name: "pandas + seaborn quick EDA", libs: "pandas, seaborn, matplotlib", desc: "The standard Python EDA workflow. Start with df.describe(), df.corr(), pairplots.",
        howto: "import pandas as pd\nimport seaborn as sns\n\ndf = pd.read_csv('data.csv')\nprint(df.describe())\nprint(df.isnull().sum())\n\n# Correlation heatmap\nsns.heatmap(df.corr(), annot=True, cmap='coolwarm')\n\n# Pairplot (small # of features)\nsns.pairplot(df, hue='category_col')", top: true,
        prompt: "I have a CSV file at {{YOUR_CSV_FILE_PATH}}. {{BRIEF_DESCRIPTION_OF_DATA}}. Please do a full exploratory data analysis: show summary statistics, check for missing values, create a correlation heatmap, make distribution plots for each numeric column, and create pairplots for the most interesting features. Save all plots as PNGs. Use pandas, seaborn, and matplotlib.", tags: ["code", "deterministic"] },
      { name: "Google Colab", desc: "Free Jupyter with GPU. Pre-installed scientific libraries.", url: "https://colab.research.google.com", tags: ["nocode", "deterministic"] },
    ],
    dataNeeded: "Data in CSV / Excel format.",
  },
  und_interp: {
    terminal: true, title: "Model Interpretability",
    diy: [
      { name: "SHAP — model-agnostic feature importance", libs: "shap", desc: "Shows which features drive each prediction and by how much. Works with any model (linear, tree, NN). The gold standard for interpretability.", link: "https://shap.readthedocs.io/", top: true,
        howto: "import shap\n\n# For tree models (fast):\nexplainer = shap.TreeExplainer(model)\nshap_values = explainer.shap_values(X_test)\n\n# Summary plot (global importance)\nshap.summary_plot(shap_values, X_test, feature_names=feature_names)\n\n# Force plot (explain one prediction)\nshap.force_plot(explainer.expected_value, shap_values[0], X_test.iloc[0])",
        prompt: "I have a CSV file at {{YOUR_CSV_FILE_PATH}} and a trained model that predicts \"{{TARGET_COLUMN}}\" from the other columns. The model is a {{MODEL_TYPE, e.g. XGBoost, Random Forest, or scikit-learn pipeline}}. Please load the data and model (or retrain the model from the CSV), compute SHAP values, create a SHAP summary plot showing global feature importance, and create a SHAP dependence plot for the top 3 most important features. Save all plots. Use pandas, shap, and matplotlib.", tags: ["code", "ml"] },
      { name: "Permutation importance (scikit-learn)", libs: "scikit-learn", desc: "Simpler than SHAP. Shuffle each feature and measure performance drop. Large drop = important feature.",
        howto: "from sklearn.inspection import permutation_importance\nresult = permutation_importance(model, X_test, y_test, n_repeats=10)\nfor i in result.importances_mean.argsort()[::-1]:\n    print(f'{feature_names[i]}: {result.importances_mean[i]:.3f} ± {result.importances_std[i]:.3f}')",
        prompt: "I have a trained {{MODEL_TYPE}} model that predicts \"{{TARGET_COLUMN}}\" from data at {{YOUR_CSV_FILE_PATH}}. I want to understand which features matter most using permutation importance. Please load the data, retrain the model if needed, compute permutation importances on a test set, rank features by importance, and create a bar plot. Use pandas, scikit-learn, and matplotlib.", tags: ["code", "ml"] },
    ],
    dataNeeded: "A trained model + dataset.",
  },
  und_annot: {
    terminal: true, title: "Genome Annotation",
    hosted: [
      { name: "Bakta", desc: "Rapid standardized bacterial annotation.", url: "https://bakta.computational.bio", pricing: "Free", top: true, tags: ["nocode", "deterministic"] },
      { name: "KBase", desc: "DOE-funded. Assembly + annotation + metabolic modeling.", url: "https://www.kbase.us", pricing: "Free", top: true, tags: ["nocode", "deterministic"] },
      { name: "eggNOG-mapper v2", desc: "Functional annotation via orthology. 15× faster than BLAST.", url: "http://eggnog-mapper.embl.de", pricing: "Free", tags: ["nocode", "deterministic"] },
      { name: "Evo Interpretability Visualizer", desc: "Mechanistic interpretability for genomic sequences. Visualize what the Evo foundation model learned about regulatory grammar and genomic elements.", url: "https://arcinstitute.org/tools/evo/evo-mech-interp", pricing: "Free", tags: ["nocode", "ai", "ml", "new"] },
    ],
    diy: [
      { name: "AlphaGenome", desc: "DeepMind model for human genome regulatory annotation. Predicts chromatin accessibility, histone modifications, and gene expression from DNA sequence. Note: currently limited to human genomes.", link: "https://github.com/google-deepmind/alphagenome", libs: "jax, alphafold dependencies", tags: ["code", "ml", "gpu", "new"] },
    ],
    dataNeeded: "Assembled genome (FASTA).",
  },
  und_micro: {
    terminal: true, title: "Microbial Community Profiling",
    diy: [
      { name: "MetaPhlAn 4", libs: "metaphlan (conda install)", desc: "Species-level profiling from metagenomic data.", link: "https://github.com/biobakery/MetaPhlAn", top: true,
        howto: "metaphlan sample.fastq --input_type fastq -o profiled_metagenome.txt", tags: ["cli", "deterministic"] },
    ],
    dataNeeded: "Metagenomic reads (FASTQ).",
  },

  // ═══════════════════════════════════════
  // AUTOMATE
  // ═══════════════════════════════════════
  automate: {
    question: "What do you want to automate?",
    paradigmBanner: { label: "AI Agents / Autonomous Systems", color: "#0891b2", explanation: "Beyond scripts — agents that perceive, decide, and act. The 'general AI' from Section 1.1, often combining multiple ML paradigms." },
    options: [
      { label: "The research cycle (hypothesis → experiment → analysis)", next: "auto_research" },
      { label: "Lab protocols / liquid handling", next: "auto_lab" },
      { label: "Coding / data processing", next: "auto_code" },
      { label: "Literature monitoring", next: "auto_lit" },
      { label: "Something else", next: "auto_general" },
    ],
  },
  auto_general: {
    terminal: true, title: "Build a Custom AI Agent / Automation",
    paradigmBanner: { label: "LLM Agents — General Pattern", color: "#0891b2", explanation: "An agent = an LLM that can use tools and make decisions in a loop. The pattern: LLM receives a goal → decides which tool to use → executes tool → observes result → decides next action → repeat until done." },
    diy: [
      { name: "LangGraph — stateful agent workflows", libs: "langgraph, langchain", desc: "Build agents as state machines: define nodes (LLM calls, tool executions), edges (routing logic), and state (accumulated context). Supports sub-agents, human-in-the-loop, and persistence.", link: "https://langchain-ai.github.io/langgraph/", top: true,
        howto: "from langgraph.graph import StateGraph\nfrom langchain_anthropic import ChatAnthropic\nfrom langchain_core.tools import tool\n\n# 1. Define tools the agent can use\n@tool\ndef search_database(query: str) -> str:\n    \"\"\"Search the internal database.\"\"\"\n    return db.search(query)\n\n@tool  \ndef run_analysis(data: str) -> str:\n    \"\"\"Run statistical analysis on data.\"\"\"\n    return analyze(data)\n\n# 2. Define agent state and graph\n# 3. Add nodes (LLM reasoning, tool execution)\n# 4. Add edges (routing based on LLM decisions)\n# See: https://langchain-ai.github.io/langgraph/tutorials/",
        prompt: "I want to build an AI agent that can {{DESCRIPTION_OF_AGENT_GOAL, e.g. query my experiment database, analyze results, and write summary reports}}. The tools/APIs it needs access to are: {{LIST_OF_TOOLS, e.g. a SQLite database at path X, a file system for reading CSVs, a plotting library}}. Please build a LangGraph agent with these tools, test it with a sample query, and show how to run it interactively. Use langgraph, langchain, and langchain-anthropic.", tags: ["code", "ai"] },
      { name: "Simple tool-use with Claude API", libs: "anthropic", desc: "For simpler automation: give Claude a set of tools (functions) it can call. No framework needed.", link: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use",
        howto: "import anthropic\nclient = anthropic.Anthropic()\n\n# Define tools as JSON schemas\ntools = [{\n    'name': 'query_database',\n    'description': 'Query the experiment database',\n    'input_schema': {'type': 'object', 'properties': {\n        'sql': {'type': 'string', 'description': 'SQL query'}\n    }}\n}]\n\nresponse = client.messages.create(\n    model='claude-sonnet-4-20250514',\n    tools=tools,\n    messages=[{'role': 'user', 'content': 'Find all experiments with yield > 80%'}]\n)",
        prompt: "I want to build a simple AI assistant that can {{DESCRIPTION_OF_WHAT_IT_DOES, e.g. query my experiment database and summarize results}}. The tool(s) it needs: {{TOOL_DESCRIPTIONS, e.g. a function that runs SQL queries against my SQLite database at path X}}. Please set up Claude tool-use with the Anthropic API, define the tools, and show a working example conversation. Use the anthropic Python SDK.", tags: ["code", "ai"] },
    ],
    dataNeeded: "Define: (1) the goal, (2) the tools/APIs the agent can access, (3) what decisions it needs to make. Start simple — a single LLM + 2-3 tools — before building complex multi-agent systems.",
  },
  auto_research: {
    terminal: true, title: "Autonomous Research Agents",
    hosted: [
      { name: "FutureHouse Platform", desc: "Crow (literature), Falcon (databases), Phoenix (synthesis), Finch (data analysis).", url: "https://platform.futurehouse.org", pricing: "Free", top: true, tags: ["nocode", "ai"] },
      { name: "Google AI Co-Scientist", desc: "Multi-agent hypothesis generation. Accelerated for DOE labs.", url: "https://research.google/blog/accelerating-scientific-breakthroughs-with-an-ai-co-scientist/", pricing: "Free for DOE", top: true, tags: ["nocode", "ai"] },
    ],
    diy: [
      { name: "LangGraph multi-agent system", libs: "langgraph, langchain", desc: "Build custom agent workflows: literature search → hypothesis → experiment design → analysis. Orchestrate specialized sub-agents.", link: "https://langchain-ai.github.io/langgraph/",
        howto: "from langgraph.graph import StateGraph, MessagesState\nfrom langchain_anthropic import ChatAnthropic\nfrom langchain_core.messages import HumanMessage\n\n# 1. Define specialized agent nodes\nllm = ChatAnthropic(model='claude-sonnet-4-20250514')\n\ndef literature_agent(state: MessagesState):\n    response = llm.invoke([HumanMessage(\n        content=f'Search literature for: {state[\"messages\"][-1].content}'\n    )])\n    return {'messages': [response]}\n\ndef analysis_agent(state: MessagesState):\n    response = llm.invoke([HumanMessage(\n        content=f'Analyze and summarize: {state[\"messages\"][-1].content}'\n    )])\n    return {'messages': [response]}\n\n# 2. Build workflow graph\ngraph = StateGraph(MessagesState)\ngraph.add_node('search', literature_agent)\ngraph.add_node('analyze', analysis_agent)\ngraph.set_entry_point('search')\ngraph.add_edge('search', 'analyze')\n\n# 3. Compile and run\nworkflow = graph.compile()\nresult = workflow.invoke({'messages': [HumanMessage(content='your research question')]})", tags: ["code", "ai"] },
    ],
    dataNeeded: "A research question.",
  },
  auto_lab: {
    terminal: true, title: "Lab Automation",
    hosted: [
      { name: "Opentrons + AI", desc: "Affordable robots (~$25K) + AI protocols from natural language.", url: "https://opentrons.com", pricing: "~$25K hardware; AI free", top: true, tags: ["nocode", "ai"] },
      { name: "Benchling AI", desc: "ELN agents: Deep Research, Compose, Data Entry.", url: "https://www.benchling.com/ai", pricing: "Free for academics", tags: ["nocode", "ai"] },
    ],
    diy: [
      { name: "pyHamilton", desc: "Python interface for Hamilton liquid handling robots. Programmatically define pipetting and complex liquid handling protocols.", link: "https://github.com/dgretton/pyhamilton", libs: "pyhamilton", tags: ["code", "deterministic", "new"] },
    ],
    dataNeeded: "Protocol description or SOPs.",
  },
  auto_code: {
    terminal: true, title: "Automate Coding",
    hosted: [
      { name: "Claude Code", desc: "CLI agentic coding for scientific code.", url: "https://claude.com", pricing: "Pro $20/mo", top: true, tags: ["nocode", "ai"] },
      { name: "Cursor", desc: "Agentic multi-file IDE.", url: "https://cursor.com", pricing: "Free tier; Pro $20/mo", top: true, tags: ["nocode", "ai"] },
      { name: "Jupyter AI", desc: "AI in notebooks. Supports local models for HPC.", url: "https://github.com/jupyterlab/jupyter-ai", pricing: "Free", tags: ["nocode", "ai"] },
    ],
    diy: [
      { name: "Windsurf / Tabnine (secure environments)", libs: "N/A", desc: "Windsurf: FedRAMP High certified. Tabnine: fully air-gapped on-premise. For national lab compliance.", link: "https://windsurf.com", tags: ["nocode", "ai"] },
    ],
    dataNeeded: "Your codebase.",
  },
  auto_lit: {
    terminal: true, title: "Literature Monitoring",
    hosted: [
      { name: "Semantic Scholar Alerts", desc: "Free alerts for new papers.", url: "https://www.semanticscholar.org", pricing: "Free", top: true, tags: ["nocode", "deterministic"] },
      { name: "Elicit Notebooks", desc: "Living reviews that auto-update.", url: "https://elicit.com", pricing: "Free tier", tags: ["nocode", "ai"] },
    ],
    dataNeeded: "Keywords or topics.",
  },

  // ═══════════════════════════════════════
  // COMMUNICATE
  // ═══════════════════════════════════════
  communicate: {
    question: "What are you communicating?",
    paradigmBanner: { label: "LLM-Assisted Communication", color: "#be185d" },
    options: [
      { label: "Scientific paper", next: "comm_paper" },
      { label: "Grant proposal", next: "comm_grant" },
      { label: "Scientific figures", next: "comm_fig" },
      { label: "Presentations", next: "comm_pres" },
      { label: "Research knowledge management", next: "comm_know" },
      { label: "Something else", next: "comm_general" },
    ],
  },
  comm_general: {
    terminal: true, title: "General LLM-Assisted Communication",
    paradigmBanner: { label: "LLM Prompting", color: "#be185d", explanation: "LLMs are general-purpose text processors. For any communication task, the key is prompt engineering: be specific about format, audience, tone, and constraints." },
    diy: [
      { name: "Structured prompting for any communication task", libs: "Claude, ChatGPT, or any LLM", desc: "The general pattern: specify the role, audience, format, constraints, and provide examples of what you want.", top: true,
        howto: "# General prompt template:\nprompt = '''\nRole: You are a [scientific writer / technical editor / etc.]\nTask: [specific task]\nAudience: [who will read this]\nFormat: [email / abstract / report / etc.]\nTone: [formal / casual / technical]\nConstraints: [word limit, style guide, etc.]\n\nInput: [your content]\n\nOutput:'''", tags: ["code", "ai"] },
    ],
    dataNeeded: "Your content and a clear description of what you want.",
  },
  comm_paper: {
    terminal: true, title: "Scientific Writing",
    hosted: [
      { name: "Paperpal", desc: "Grammar, 250M+ paper citations, plagiarism, journal checks.", url: "https://paperpal.com", pricing: "Free; Prime ~$13/mo", top: true, tags: ["nocode", "ai"] },
      { name: "Writefull", desc: "Trained on peer-reviewed articles. Best for LaTeX.", url: "https://www.writefull.com", pricing: "Free; ~$7/mo", tags: ["nocode", "ai"] },
    ],
    dataNeeded: "Your draft.",
    note: "NIH policy NOT-OD-25-132 prohibits applications substantially developed with AI. Use for editing, not generation.",
  },
  comm_grant: {
    terminal: true, title: "Grant Writing",
    hosted: [{ name: "Granted AI", desc: "Reads RFPs, coaches section-by-section. DOE/NSF/NIH.", url: "https://grantedai.com", pricing: "$29/mo", top: true, tags: ["nocode", "ai"] }],
    note: "Use for coaching, not wholesale generation.",
  },
  comm_fig: {
    terminal: true, title: "Scientific Figures",
    hosted: [{ name: "BioRender", desc: "50,000+ icons, AI editing, PDB integration.", url: "https://www.biorender.com", pricing: "Free plan; ~$39/mo", top: true, tags: ["nocode", "deterministic"] }],
  },
  comm_pres: {
    terminal: true, title: "Presentations",
    hosted: [{ name: "Gamma", desc: "Decks from text. Exports to PowerPoint.", url: "https://gamma.app", pricing: "Free plan", top: true, tags: ["nocode", "ai"] }],
  },
  comm_know: {
    question: "What kind of system?",
    options: [
      { label: "Team wiki", next: "comm_team" },
      { label: "Personal notes (local/private)", next: "comm_pers" },
      { label: "Academic writing + references", next: "comm_refs" },
    ],
  },
  comm_team: { terminal: true, title: "Team Workspace", hosted: [{ name: "Notion AI", desc: "Notes + databases + wikis + AI.", url: "https://www.notion.so", pricing: "$10/mo + $10/mo AI", top: true, tags: ["nocode", "ai"] }] },
  comm_pers: {
    terminal: true, title: "Personal Knowledge Base",
    hosted: [
      { name: "Obsidian", desc: "Local-first. Bidirectional linking. AI plugins.", url: "https://obsidian.md", pricing: "Free", top: true, tags: ["nocode", "deterministic"] },
      { name: "Logseq", desc: "Open-source. PDF annotation + knowledge graphs.", url: "https://logseq.com", pricing: "Free", tags: ["nocode", "deterministic"] },
    ],
    note: "Critical for pre-publication data — stays on your machine.",
  },
  comm_refs: { terminal: true, title: "Academic Writing + References", hosted: [{ name: "Zettlr", desc: "Markdown + Zotero + LaTeX.", url: "https://www.zettlr.com", pricing: "Free", top: true, tags: ["nocode", "deterministic"] }] },
};

export function getCatColor(p) {
  if (p.length <= 1) return null;
  return { find:"#2563eb",predict:"#dc2626",generate:"#7c3aed",optimize:"#059669",understand:"#d97706",automate:"#0891b2",communicate:"#be185d" }[p[1]] || "#64748b";
}
