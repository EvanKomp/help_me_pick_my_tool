import { useState, useCallback, useMemo } from "react";

/*
 * AI/ML Decision Guide for Biological Science
 * AI Clinic Series
 *
 * Structure:
 *   - Top level: cognitive task types (FIND, PREDICT, GENERATE, OPTIMIZE, UNDERSTAND, AUTOMATE, COMMUNICATE)
 *   - Terminal nodes have two sections:
 *     1. "Ready-to-use" - hosted/packaged tools
 *     2. "Build your own" - concrete implementation guidance with libraries, approaches, and links
 */

const NODES = {
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
      { name: "Claude / ChatGPT (with web search)", desc: "For publicly available information. Describe what you're looking for.", url: "https://claude.com", pricing: "Free tier", top: true },
      { name: "Perplexity", desc: "AI search engine that cites sources. Good for factual lookups.", url: "https://www.perplexity.ai", pricing: "Free tier" },
    ],
    diy: [
      { name: "Custom RAG pipeline", libs: "langchain or llama-index, sentence-transformers, chromadb or FAISS", desc: "Embed your data (any modality: text, tables, code), store in a vector database, retrieve relevant chunks for each query, pass to an LLM. Works for internal databases, documentation, experimental logs, etc.", link: "https://python.langchain.com/docs/tutorials/rag/", top: true,
        howto: "from langchain.document_loaders import DirectoryLoader\nfrom langchain.text_splitter import RecursiveCharacterTextSplitter\nfrom langchain.embeddings import HuggingFaceEmbeddings\nfrom langchain.vectorstores import Chroma\n\n# 1. Load and chunk your data\ndocs = DirectoryLoader('./my_data/').load()\nchunks = RecursiveCharacterTextSplitter(chunk_size=1000).split_documents(docs)\n\n# 2. Embed and store\ndb = Chroma.from_documents(chunks, HuggingFaceEmbeddings())\n\n# 3. Retrieve\nresults = db.similarity_search('my question', k=5)" },
      { name: "SQL / structured database querying with LLM", libs: "langchain, sqlalchemy", desc: "If your data is in a database, LLMs can translate natural language to SQL queries.", link: "https://python.langchain.com/docs/tutorials/sql_qa/" },
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
      { name: "Elicit", desc: "Searches 138M+ papers, extracts structured data, generates citation-backed reports.", url: "https://elicit.com", pricing: "Free (2 reports/mo); Pro $29/mo", top: true },
      { name: "Undermind", desc: "Reads hundreds of papers, follows citation chains, adapts search strategy.", url: "https://www.undermind.ai", pricing: "Freemium" },
      { name: "Rayyan", desc: "Gold standard for screening with AI-assisted prioritization.", url: "https://www.rayyan.ai", pricing: "Freemium" },
    ],
    dataNeeded: "A well-defined research question. No data required.",
  },
  find_lit_quick: {
    terminal: true, title: "Quick Literature Answer",
    hosted: [
      { name: "Consensus", desc: "Shows degree of scientific agreement via a 'Consensus Meter.'", url: "https://consensus.app", pricing: "Free tier", top: true },
      { name: "Semantic Scholar", desc: "Free, 200M+ papers, TLDR summaries, 'Ask This Paper' querying.", url: "https://www.semanticscholar.org", pricing: "Free", top: true },
    ],
    dataNeeded: "Just your question.",
  },
  find_lit_map: {
    terminal: true, title: "Map the Research Landscape",
    hosted: [
      { name: "Connected Papers", desc: "Visual graphs of related papers by citation overlap.", url: "https://www.connectedpapers.com", pricing: "Free (2 graphs/mo)", top: true },
      { name: "Litmaps", desc: "Citation networks with 'shortest path' between papers.", url: "https://www.litmaps.com", pricing: "Free tier" },
    ],
    dataNeeded: "A seed paper (DOI or title).",
  },
  find_lit_read: {
    terminal: true, title: "Help Understanding a Paper",
    hosted: [
      { name: "Google NotebookLM", desc: "Upload PDFs, get AI analysis grounded in your sources. Audio Overviews.", url: "https://notebooklm.google", pricing: "Free", top: true },
      { name: "SciSpace", desc: "Translates jargon and formulas in real time.", url: "https://scispace.com", pricing: "Free tier" },
    ],
    dataNeeded: "The PDF(s) you want to understand.",
  },
  find_lit_verify: {
    terminal: true, title: "Verify Claims & Citation Context",
    hosted: [
      { name: "Scite", desc: "1.2B+ citation statements — shows support, contradict, or mention.", url: "https://scite.ai", pricing: "Free tier; ~$12/mo", top: true },
    ],
    dataNeeded: "A paper DOI or specific claim.",
  },
  find_seq: {
    terminal: true, title: "Find Sequences, Structures, or Database Records",
    paradigmBanner: { label: "Sequence Alignment / HMMs / Structure Search", color: "#2563eb" },
    hosted: [
      { name: "FoldSeek", desc: "Structure-based search. Finds remote homologs sequence methods miss.", url: "https://search.foldseek.com", pricing: "Free", top: true },
      { name: "InterProScan", desc: "Domain/family classification from 12+ databases.", url: "https://www.ebi.ac.uk/interpro/search/sequence/", pricing: "Free" },
    ],
    diy: [
      { name: "BLAST / MMseqs2 — sequence similarity search", libs: "NCBI BLAST+, MMseqs2", desc: "MMseqs2 is 100× faster than BLAST with comparable sensitivity. Use for large-scale homolog detection.", link: "https://github.com/soedinglab/MMseqs2", howto: "mmseqs easy-search query.fasta targetDB result.m8 tmp" },
      { name: "HMMER — profile HMM search", libs: "HMMER3", desc: "Build a profile HMM from a multiple sequence alignment of known family members, then search databases for distant homologs. More sensitive than BLAST for divergent sequences.", link: "http://hmmer.org/", howto: "hmmbuild profile.hmm alignment.sto && hmmsearch profile.hmm database.fasta" },
      { name: "DIAMOND + DeepClust — fast clustering", libs: "DIAMOND", desc: "Fast alignment-based clustering at specified identity/coverage thresholds. Useful for deduplicating large sequence datasets before downstream ML.", link: "https://github.com/bbuchfink/diamond", howto: "diamond deepclust -d seqs.fasta -o clusters.tsv --member-cover 80 --approx-id 30" },
    ],
    dataNeeded: "Query sequence(s) or MSA. For FoldSeek: a 3D structure (PDB).",
  },
  find_similar: {
    terminal: true, title: "Find Similar Items",
    paradigmBanner: { label: "Nearest Neighbor / Embedding Similarity", color: "#2563eb", explanation: "Can use hand-crafted features (fingerprints, identity) or learned representations (embeddings from pLMs or GNNs). The latter is representation learning (Section 2.4)." },
    diy: [
      { name: "Molecular fingerprint similarity (RDKit)", libs: "rdkit, scikit-learn", desc: "Compute Morgan/ECFP fingerprints, then Tanimoto similarity. Standard for small-molecule virtual screening.", link: "https://www.rdkit.org/docs/GettingStartedInPython.html#fingerprinting-and-molecular-similarity", howto: "from rdkit.Chem import AllChem, DataStructs\nfp1 = AllChem.GetMorganFingerprintAsBitVect(mol1, 2)\nfp2 = AllChem.GetMorganFingerprintAsBitVect(mol2, 2)\nsim = DataStructs.TanimotoSimilarity(fp1, fp2)" },
      { name: "Protein embedding similarity (ESM2)", libs: "torch, fair-esm (or huggingface transformers)", desc: "Embed proteins with ESM2, compute cosine similarity in embedding space. Captures functional similarity beyond sequence identity.", link: "https://github.com/facebookresearch/esm", howto: "# Extract embeddings with esm.pretrained.esm2_t33_650M_UR50D()\n# Pool per-residue embeddings (mean), compute cosine sim\nfrom sklearn.metrics.pairwise import cosine_similarity" },
      { name: "k-NN search at scale (FAISS)", libs: "faiss-cpu or faiss-gpu", desc: "Facebook's library for fast approximate nearest neighbor search. Use when searching millions of embeddings.", link: "https://github.com/facebookresearch/faiss", howto: "import faiss\nindex = faiss.IndexFlatIP(dim)  # inner product = cosine on normalized\nindex.add(embeddings)\nD, I = index.search(query, k=10)" },
    ],
    dataNeeded: "Your query item (sequence, SMILES, structure) + a database to search.",
  },
  find_internal: {
    terminal: true, title: "Search Within Your Own Documents",
    hosted: [
      { name: "Google NotebookLM", desc: "Upload documents, ask questions grounded in your sources.", url: "https://notebooklm.google", pricing: "Free", top: true },
      { name: "Notion AI", desc: "AI search across team workspace.", url: "https://www.notion.so", pricing: "$10/mo + $10/mo AI" },
    ],
    diy: [
      { name: "Local RAG pipeline", libs: "langchain or llama-index, sentence-transformers, chromadb or FAISS", desc: "Embed your documents into a vector store, retrieve relevant chunks for each query, pass to an LLM for synthesis. Keeps data local.", link: "https://python.langchain.com/docs/tutorials/rag/", howto: "# 1. Load docs (PDF, txt)\n# 2. Split into chunks (RecursiveCharacterTextSplitter)\n# 3. Embed chunks (sentence-transformers)\n# 4. Store in Chroma/FAISS\n# 5. Query: embed question → retrieve top-k → pass to LLM" },
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
        howto: "from sklearn.model_selection import cross_val_score\nfrom sklearn.linear_model import Ridge\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.gaussian_process import GaussianProcessRegressor\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\n\n# X = your feature matrix (N examples × M features)\n# y = your labels\n\nfor name, model in [\n    ('Ridge', Ridge(alpha=1.0)),\n    ('RF', RandomForestRegressor(n_estimators=100, max_depth=5)),\n    ('GP', GaussianProcessRegressor(normalize_y=True)),\n]:\n    pipe = Pipeline([('scale', StandardScaler()), ('model', model)])\n    scores = cross_val_score(pipe, X, y, cv=5, scoring='r2')\n    print(f'{name}: R² = {scores.mean():.3f} ± {scores.std():.3f}')" },
      { name: "Feature engineering guidance", libs: "", desc: "The key question: what numeric vector best represents each example? Options: hand-crafted domain features (best if you have expertise), pre-trained embeddings (if a foundation model exists for your data type), or raw features (one-hot, counts, etc.). Better features > fancier models.", link: "https://scikit-learn.org/stable/modules/preprocessing.html" },
    ],
    dataNeeded: "Any data where you have inputs paired with measured outcomes. The main effort is converting your inputs to a numeric feature vector.",
    clinicConnection: "Section 1.2 (feature engineering) + Section 2.1 (supervised learning) + Section 3.1 (start simple). This is the general case of everything in Clinic 1.",
  },
  predict_small_tab: {
    terminal: true, title: "Small Tabular Data Prediction",
    paradigmBanner: { label: "Supervised Learning — Simple Models", color: "#dc2626", explanation: "With <100 examples, bias-variance tradeoff (Section 3.1) favors simple models. Use cross-validation (Section 3.2) to estimate generalization performance." },
    hosted: [
      { name: "Julius AI", desc: "No-code: upload CSV, ask questions in English, get models and plots.", url: "https://julius.ai", pricing: "Free (15 msgs/mo)" },
      { name: "Claude Analysis Tool", desc: "Upload CSV, describe your prediction task. Good for prototyping.", url: "https://claude.com", pricing: "Free tier / $20/mo" },
    ],
    diy: [
      { name: "Linear regression → regularized → tree ensemble (scikit-learn)", libs: "scikit-learn, pandas, numpy", desc: "The canonical supervised learning progression. Start with the simplest model that could work, add complexity only when validation error improves. This is the core workflow from Clinic 1.", link: "https://scikit-learn.org/stable/supervised_learning.html",
        howto: "from sklearn.model_selection import cross_val_score\nfrom sklearn.linear_model import Ridge\nfrom sklearn.ensemble import RandomForestRegressor\n\n# Always start simple\nridge = Ridge(alpha=1.0)\nscores = cross_val_score(ridge, X, y, cv=5, scoring='r2')\nprint(f'Ridge CV R²: {scores.mean():.3f} ± {scores.std():.3f}')\n\n# Try more complex only if Ridge underfits\nrf = RandomForestRegressor(n_estimators=100, max_depth=5)\nscores = cross_val_score(rf, X, y, cv=5, scoring='r2')" },
      { name: "Gaussian process regression (scikit-learn)", libs: "scikit-learn", desc: "Provides calibrated uncertainty estimates on predictions. Excellent for small datasets. Also the foundation for Bayesian optimization (→ OPTIMIZE). Scales poorly beyond ~1,000 points.", link: "https://scikit-learn.org/stable/modules/gaussian_process.html",
        howto: "from sklearn.gaussian_process import GaussianProcessRegressor\nfrom sklearn.gaussian_process.kernels import RBF, ConstantKernel\n\nkernel = ConstantKernel() * RBF(length_scale_bounds=(0.1, 10))\ngp = GaussianProcessRegressor(kernel=kernel, n_restarts_optimizer=5)\ngp.fit(X_train, y_train)\ny_pred, y_std = gp.predict(X_test, return_std=True)  # mean + uncertainty" },
    ],
    dataNeeded: "Table: N rows × M feature columns + label column. Encode categoricals (Section 1.2). Scale continuous features (StandardScaler). Always cross-validate.",
    clinicConnection: "This is the coffee quality regression from Clinic 1. Start linear, add complexity only if CV error improves. Watch for overfitting (Section 3.1).",
  },
  predict_small_prot: {
    terminal: true, title: "Few-Shot Protein Fitness Prediction",
    paradigmBanner: { label: "Transfer Learning + Active Learning", color: "#dc2626", explanation: "Leverage pre-trained protein language models (self-supervised, Section 2.6) as feature extractors, then train a lightweight supervised head. This is transfer learning (Section 2.5). Combine with active learning (Section 2.3) to let the model choose which variants to screen next." },
    hosted: [
      { name: "EVOLVEpro", desc: "pLM embeddings + active learning. Up to 100-fold improvements with ~10 data points per round.", url: "https://github.com/mat10d/EvolvePro", pricing: "Free, GitHub + Colab", top: true },
      { name: "ALDE", desc: "Arnold group. Uncertainty-guided active learning for DE. 12% → 93% yield in 3 rounds.", url: "https://www.nature.com/articles/s41467-025-55987-8", pricing: "Free, code with paper", top: true },
    ],
    diy: [
      { name: "ESM2 embeddings + Ridge/GP regression", libs: "fair-esm (or huggingface transformers), torch, scikit-learn", desc: "Extract per-residue embeddings from ESM2 for each variant, pool to a fixed-size vector (mean pooling), then train a simple Ridge or GP regressor on your fitness labels. This is transfer learning: ESM2 provides the representation, your data provides the task.", link: "https://github.com/facebookresearch/esm",
        howto: "import esm\nimport torch\nfrom sklearn.linear_model import Ridge\n\n# Load ESM2 (650M param version)\nmodel, alphabet = esm.pretrained.esm2_t33_650M_UR50D()\nbatch_converter = alphabet.get_batch_converter()\n\n# Extract embeddings for each variant\nembeddings = []\nfor seq in variant_sequences:\n    _, _, tokens = batch_converter([('', seq)])\n    with torch.no_grad():\n        result = model(tokens, repr_layers=[33])\n    emb = result['representations'][33][0, 1:-1].mean(0)  # mean pool\n    embeddings.append(emb.numpy())\n\nX = np.stack(embeddings)\n# Train simple model on embeddings\nridge = Ridge(alpha=1.0)\nridge.fit(X_train, y_train)" },
      { name: "Active learning loop with GP + UCB", libs: "scikit-learn (GaussianProcessRegressor)", desc: "Use a GP surrogate on pLM embeddings. In each round, score all unscreened variants with UCB (predicted mean + β × predicted std), screen the top-k, add results, retrain. This is the exact UCB loop from Clinic 1 Section 2.3, applied to protein variants.", link: "https://scikit-learn.org/stable/modules/gaussian_process.html",
        howto: "# After extracting ESM2 embeddings for all candidate variants:\nfrom sklearn.gaussian_process import GaussianProcessRegressor\n\ngp = GaussianProcessRegressor(normalize_y=True)\ngp.fit(X_screened, y_screened)\n\ny_pred, y_std = gp.predict(X_unscreened, return_std=True)\nbeta = 2.0  # exploration weight\nucb = y_pred + beta * y_std\nnext_to_screen = np.argsort(ucb)[-batch_size:]  # top UCB" },
    ],
    dataNeeded: "Wild-type sequence + 10–50 variants with measured fitness. Active learning proposes next batches iteratively.",
    clinicConnection: "Combines transfer learning (Section 2.5: ESM2 = D1 pre-training) with active learning (Section 2.3: GP + UCB loop). The coffee → proteins progression.",
  },
  predict_small_mol: {
    terminal: true, title: "Few-Shot Molecular Property Prediction",
    diy: [
      { name: "Molecular fingerprints + Random Forest", libs: "rdkit, scikit-learn", desc: "Compute Morgan fingerprints (ECFP), train a random forest. Simple, fast, often competitive. Good baseline before trying graph neural networks.", link: "https://www.rdkit.org/docs/GettingStartedInPython.html",
        howto: "from rdkit import Chem\nfrom rdkit.Chem import AllChem\nimport numpy as np\nfrom sklearn.ensemble import RandomForestRegressor\n\n# Generate fingerprints from SMILES\nfps = []\nfor smi in smiles_list:\n    mol = Chem.MolFromSmiles(smi)\n    fp = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=2048)\n    fps.append(np.array(fp))\nX = np.stack(fps)\n\nrf = RandomForestRegressor(n_estimators=200)\nrf.fit(X_train, y_train)" },
      { name: "Chemprop — graph neural network", libs: "chemprop (pip install chemprop)", desc: "Message-passing neural network that learns directly from molecular graphs. v2 is 2× faster. Can fine-tune pre-trained checkpoints for few-shot learning. Relevant for biofuel properties (cetane, octane), toxicity, solubility.", link: "https://github.com/chemprop/chemprop",
        howto: "# CLI usage (simplest):\n# chemprop train --data-path data.csv --smiles-columns smiles --target-columns property\n# chemprop predict --test-path test.csv --model-path model.pt" },
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
        howto: "import xgboost as xgb\nimport optuna\nfrom sklearn.model_selection import cross_val_score\n\ndef objective(trial):\n    params = {\n        'max_depth': trial.suggest_int('max_depth', 3, 10),\n        'learning_rate': trial.suggest_float('lr', 0.01, 0.3, log=True),\n        'n_estimators': trial.suggest_int('n_est', 50, 500),\n        'subsample': trial.suggest_float('subsample', 0.6, 1.0),\n        'colsample_bytree': trial.suggest_float('colsample', 0.6, 1.0),\n    }\n    model = xgb.XGBRegressor(**params)\n    return cross_val_score(model, X, y, cv=5, scoring='r2').mean()\n\nstudy = optuna.create_study(direction='maximize')\nstudy.optimize(objective, n_trials=50)" },
      { name: "PyTorch for structured data", libs: "pytorch, pytorch-lightning", desc: "If your data has inherent structure (graphs, sequences, spatial), a neural network can learn features directly (representation learning, Section 2.4). Otherwise, stick with trees.", link: "https://pytorch-lightning.readthedocs.io/" },
    ],
    dataNeeded: "Feature matrix + labels. At this scale, proper train/val/test splits are critical (Section 3.2).",
  },
  predict_med_tab: {
    terminal: true, title: "Tabular Prediction (100–10K examples)",
    paradigmBanner: { label: "Supervised Learning — Gradient Boosted Trees", color: "#dc2626", explanation: "Ensemble tree methods consistently outperform neural networks on tabular data. They handle mixed types, missing values, and are robust to overfitting." },
    diy: [
      { name: "XGBoost / LightGBM — gradient boosted trees", libs: "xgboost or lightgbm, scikit-learn", desc: "The go-to for tabular prediction. Fast, handles missing values, built-in feature importance. Use RandomizedSearchCV for hyperparameter tuning.", link: "https://xgboost.readthedocs.io/en/stable/python/python_intro.html",
        howto: "import xgboost as xgb\nfrom sklearn.model_selection import RandomizedSearchCV\n\nparam_dist = {\n    'max_depth': [3, 5, 7, 9],\n    'learning_rate': [0.01, 0.05, 0.1, 0.3],\n    'n_estimators': [100, 300, 500],\n    'subsample': [0.7, 0.8, 0.9],\n}\nmodel = xgb.XGBRegressor()\nsearch = RandomizedSearchCV(model, param_dist, n_iter=30, cv=5, scoring='r2')\nsearch.fit(X_train, y_train)\nprint(f'Best CV R²: {search.best_score_:.3f}')", top: true },
      { name: "Preprocessing pipeline (scikit-learn)", libs: "scikit-learn", desc: "Always build a proper pipeline: encode categoricals, scale numerics, handle missing values. This prevents data leakage (Section 3.3).", link: "https://scikit-learn.org/stable/modules/compose.html",
        howto: "from sklearn.pipeline import Pipeline\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.impute import SimpleImputer\n\npreprocessor = ColumnTransformer([\n    ('num', Pipeline([\n        ('impute', SimpleImputer(strategy='median')),\n        ('scale', StandardScaler())\n    ]), numeric_cols),\n    ('cat', Pipeline([\n        ('impute', SimpleImputer(strategy='most_frequent')),\n        ('ohe', OneHotEncoder(handle_unknown='ignore'))\n    ]), categorical_cols),\n])\n\npipe = Pipeline([('preprocess', preprocessor), ('model', xgb.XGBRegressor())])" },
    ],
    dataNeeded: "Clean tabular data. Split train/val/test (Section 3.2). Watch for leakage (Section 3.3).",
  },
  predict_med_prot: {
    terminal: true, title: "Protein Fitness Prediction (100+ variants)",
    paradigmBanner: { label: "Supervised on Learned Representations", color: "#dc2626", explanation: "Use pLM embeddings as features — transfer learning (Section 2.5). The embedding captures evolutionary and structural information that one-hot encoding cannot." },
    hosted: [
      { name: "Cradle.bio", desc: "Enterprise: trains custom ML on your data, suggests next variants.", url: "https://www.cradle.bio", pricing: "Enterprise (~$100K+/yr)" },
    ],
    diy: [
      { name: "ESM2 embeddings + XGBoost", libs: "fair-esm or transformers, torch, xgboost", desc: "Extract embeddings (see small-data protein node for code), then train XGBoost. With 100+ variants, boosted trees on embeddings are very competitive.", top: true,
        howto: "# After extracting ESM2 embeddings (see PREDICT > small > protein)\nimport xgboost as xgb\nfrom sklearn.model_selection import cross_val_score\n\nmodel = xgb.XGBRegressor(max_depth=5, n_estimators=200, learning_rate=0.1)\nscores = cross_val_score(model, X_embeddings, y_fitness, cv=5, scoring='r2')" },
      { name: "One-hot + positional encoding baseline", libs: "scikit-learn, numpy", desc: "One-hot encode mutations relative to wild-type. Simpler than embeddings and still competitive for single-mutant libraries. Always run as a baseline.", 
        howto: "# For each variant, create a binary vector:\n# position i = 1 if mutated, 0 if WT\n# Can also include identity of mutation (20-dim one-hot per position)\nimport numpy as np\ndef encode_mutations(wt_seq, variant_seq):\n    return np.array([1 if a != b else 0 for a, b in zip(wt_seq, variant_seq)])" },
      { name: "Key consideration: data splitting for proteins", libs: "", desc: "Random splits overestimate performance because similar sequences leak information. Use cluster-based splits (cluster sequences at 70-80% identity, split by cluster) to test genuine extrapolation ability.", link: "https://github.com/facebookresearch/esm",
        howto: "# Use mmseqs2 to cluster your variants:\n# mmseqs easy-cluster variants.fasta clust tmp --min-seq-id 0.8\n# Then split by cluster, not by individual sequence" },
    ],
    dataNeeded: "100+ variant sequences with fitness. Consider cluster-based splits to test extrapolation.",
  },
  predict_med_mol: {
    terminal: true, title: "Molecular Property Prediction (100+ molecules)",
    paradigmBanner: { label: "Graph Neural Networks — Representation Learning", color: "#dc2626" },
    diy: [
      { name: "Chemprop v2 — message-passing GNN", libs: "chemprop", desc: "Learns directly from molecular graphs. Relevant for biofuel properties (cetane, octane), toxicity, solubility. v2 is 2× faster.", link: "https://github.com/chemprop/chemprop", top: true,
        howto: "# Train: chemprop train --data-path train.csv --smiles-columns smiles --target-columns target\n# Predict: chemprop predict --test-path test.csv --model-path best_model.pt\n# Ensemble: chemprop train ... --ensemble-size 5" },
      { name: "DeepChem — broader ML for chemistry", libs: "deepchem", desc: "Multiple architectures (GCN, MPNN, AttentiveFP), pre-trained models, uncertainty estimation.", link: "https://github.com/deepchem/deepchem",
        howto: "import deepchem as dc\n# Load dataset with featurizer\nfeaturizer = dc.feat.MolGraphConvFeaturizer()\nloader = dc.data.CSVLoader(['target'], feature_field='smiles', featurizer=featurizer)\ndataset = loader.create_dataset('data.csv')\nmodel = dc.models.GCNModel(n_tasks=1, mode='regression')\nmodel.fit(dataset, nb_epoch=50)" },
      { name: "Fingerprint baseline (always run this first)", libs: "rdkit, scikit-learn", desc: "Morgan fingerprints + random forest. Fast and often surprisingly competitive. If this does well, a GNN may not be worth the complexity.",
        howto: "# See PREDICT > small > molecular for fingerprint code" },
    ],
    dataNeeded: "SMILES + measured properties. Chemprop handles featurization automatically.",
    clinicConnection: "Representation learning (Section 2.4): GNN learns features from molecular graphs vs. hand-engineered fingerprints.",
  },
  predict_med_time: {
    terminal: true, title: "Time Series / Process Data Prediction",
    diy: [
      { name: "Feature engineering + tabular ML", libs: "pandas, tsfresh or manual, scikit-learn/xgboost", desc: "Extract time-domain features (growth rates, lag times, peak values, AUC, slopes) then apply standard tabular ML. Domain expertise about which temporal features matter often outperforms end-to-end deep learning.", top: true,
        howto: "# Manual approach (often best):\nimport pandas as pd\ndef extract_features(timeseries):\n    return {\n        'max_rate': np.max(np.diff(timeseries)),\n        'lag_time': np.argmax(np.diff(timeseries) > threshold),\n        'auc': np.trapz(timeseries),\n        'final_value': timeseries[-1],\n    }\n\n# Automated approach:\n# pip install tsfresh\nfrom tsfresh import extract_features\nfeatures = extract_features(df, column_id='sample', column_sort='time')" },
      { name: "LSTM / Transformer for raw time series", libs: "pytorch, pytorch-lightning", desc: "Learns directly from raw time series without manual features. Requires more data (1000+ series). Consider only when manual features don't capture enough.", link: "https://pytorch-lightning.readthedocs.io/" },
    ],
    dataNeeded: "Time-indexed measurements + outcomes. Feature engineering first, deep learning second.",
    clinicConnection: "Feature engineering (Section 1.2) is crucial here. The features ARE the domain expertise.",
  },
  predict_med_img: {
    terminal: true, title: "Image-Based Prediction",
    paradigmBanner: { label: "Deep Learning — CNNs (Representation Learning)", color: "#dc2626", explanation: "CNNs learn hierarchical features from pixels (Section 2.4). Transfer learning from ImageNet works for microscopy with as few as 100–500 labeled images." },
    hosted: [
      { name: "Cellpose", desc: "Cell segmentation across microscopy types. No retraining needed.", url: "https://github.com/MouseLand/cellpose", pricing: "Free", top: true },
      { name: "BioImage.IO", desc: "Model zoo of pre-trained DL models for bioimage analysis.", url: "https://bioimage.io", pricing: "Free" },
    ],
    diy: [
      { name: "Transfer learning from pre-trained CNN", libs: "pytorch, torchvision", desc: "Fine-tune a ResNet or EfficientNet pre-trained on ImageNet. Replace the final classification layer with your task head. Even 100–500 labeled images can work.", link: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html",
        howto: "import torchvision.models as models\nimport torch.nn as nn\n\nmodel = models.resnet18(pretrained=True)\n# Freeze early layers\nfor param in model.parameters():\n    param.requires_grad = False\n# Replace final layer\nmodel.fc = nn.Linear(model.fc.in_features, num_classes)\n# Train only the new layer (+ optionally unfreeze later)" },
    ],
    dataNeeded: "Labeled images. For segmentation: images + masks. For classification: images + labels.",
  },
  predict_large: {
    terminal: true, title: "Large-Scale Prediction (10K+ examples)",
    paradigmBanner: { label: "Deep Learning — Representation Learning", color: "#dc2626", explanation: "With enough data, NNs learn features from raw inputs (Section 2.4). But always benchmark against simpler baselines." },
    diy: [
      { name: "PyTorch / Lightning", libs: "pytorch, pytorch-lightning", desc: "Full control over architecture and training. At this scale, consider transformers, custom GNNs, or multi-task learning.", link: "https://pytorch-lightning.readthedocs.io/", top: true },
      { name: "XGBoost / LightGBM (always try as baseline)", libs: "xgboost or lightgbm", desc: "Still competitive on tabular data even at large scale. If a tree beats your NN, your NN isn't adding value.", top: true },
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
        howto: "# General pattern for zero-shot with any masked language model:\n# 1. Mask a position in your input\n# 2. Ask the model to predict what should go there\n# 3. The model's confidence = how 'expected' each option is\n#\n# For proteins: mask amino acid position → predict mutation effects\n# For DNA: mask nucleotides → predict regulatory elements\n# For molecules: mask atoms → predict chemical properties" },
      { name: "LLM-based zero-shot classification/extraction", libs: "anthropic or openai API", desc: "For text-like data, LLMs can do zero-shot classification, extraction, and reasoning. Describe the task in the prompt.", 
        howto: "# Example: classify research papers by topic without training data\nprompt = '''Classify this abstract into one of: [enzyme engineering, \nmetabolic engineering, bioprocess, genomics, other].\n\nAbstract: {abstract_text}\n\nCategory:'''" },
    ],
    dataNeeded: "Your input data in whatever format. The question is whether a pre-trained model exists that has seen enough similar data to be useful.",
  },
  predict_zs_mut: {
    terminal: true, title: "Zero-Shot Mutation Effect Prediction",
    hosted: [
      { name: "EVE", desc: "Variant effects from evolutionary sequences. Pre-computed for 3,219 proteins.", url: "https://evemodel.org", pricing: "Free" },
    ],
    diy: [
      { name: "ESM-1v log-likelihood scoring", libs: "fair-esm, torch", desc: "Score every possible single-point mutation by computing the log-likelihood ratio (mutant vs. wild-type) under the ESM-1v masked language model. Higher log-likelihood → more tolerated mutation.", link: "https://github.com/facebookresearch/esm",
        howto: "# The idea: mask position i, predict probability of each amino acid\n# P(mutant_aa | context) vs P(wt_aa | context)\n# See: https://github.com/facebookresearch/esm#zero-shot-variant-prediction\nimport esm\nmodel, alphabet = esm.pretrained.esm1v_t33_650M_UR90S_1()\n# Mask each position, get log-probs for all 20 AAs\n# Score = log P(mut) - log P(wt)", top: true },
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
      { name: "AlphaFold 3 Server", desc: "Complexes with DNA, RNA, ligands, ions, PTMs.", url: "https://alphafoldserver.com", pricing: "Free", top: true },
      { name: "Boltz-2", desc: "Open-source (MIT). Also predicts binding affinity (~20 sec/GPU).", url: "https://github.com/jwohlwend/boltz", pricing: "Free, web via Tamarind/Neurosnap", top: true },
      { name: "Chai-1", desc: "AF3-level accuracy. Free academic + commercial.", url: "https://github.com/chaidiscovery/chai-lab", pricing: "Free, web via Neurosnap" },
    ],
    diy: [
      { name: "Run Boltz-2 locally (GPU)", libs: "boltz (pip install boltz)", desc: "MIT license, runs on a single GPU. Predicts both structure and binding affinity.", link: "https://github.com/jwohlwend/boltz",
        howto: "# pip install boltz\n# boltz predict input.yaml --output results/\n# See repo for input YAML format (sequences + ligand SMILES)" },
    ],
    dataNeeded: "Protein sequence(s) + ligand/nucleic acid definitions.",
  },
  predict_zs_fast: {
    terminal: true, title: "Fast Structure (no MSA)",
    hosted: [
      { name: "ESMFold", desc: "Single-sequence, up to 60× faster than AF2.", url: "https://esmatlas.com/resources?action=fold", pricing: "Free web (≤400 res)", top: true },
    ],
    diy: [
      { name: "ESMFold locally", libs: "fair-esm, torch", desc: "Run ESMFold on GPU for batch predictions. No MSA needed.", link: "https://github.com/facebookresearch/esm",
        howto: "import esm\nmodel = esm.pretrained.esmfold_v1()\nmodel = model.eval().cuda()\nwith torch.no_grad():\n    output = model.infer_pdb(sequence)\n# Write PDB string to file" },
    ],
    dataNeeded: "Amino acid sequence(s).",
  },
  predict_zs_acc: {
    terminal: true, title: "High-Accuracy Structure",
    hosted: [
      { name: "ColabFold", desc: "AF2 in Colab with free GPU. MMseqs2-based MSA.", url: "https://github.com/sokrypton/ColabFold", pricing: "Free", top: true },
      { name: "AlphaFold 3 Server", desc: "Most accurate.", url: "https://alphafoldserver.com", pricing: "Free" },
    ],
    dataNeeded: "Amino acid sequence. MSA built automatically.",
  },
  predict_zs_kin: {
    terminal: true, title: "Predict Enzyme Kinetics",
    hosted: [
      { name: "CatPred", desc: "Predicts kcat, Km, Ki from sequence + substrate, with uncertainty.", url: "https://www.catpred.com", pricing: "Free", top: true },
    ],
    dataNeeded: "Enzyme sequence + substrate SMILES.",
  },
  predict_zs_func: {
    terminal: true, title: "Predict Protein Function",
    hosted: [
      { name: "DeepGO-SE", desc: "ESM2 + Gene Ontology. Excels for proteins without close homologs.", url: "https://deepgo.cbrc.kaust.edu.sa", pricing: "Free", top: true },
      { name: "InterProScan", desc: "Domain/family classification from 12+ databases.", url: "https://www.ebi.ac.uk/interpro/search/sequence/", pricing: "Free" },
      { name: "eggNOG-mapper v2", desc: "Functional annotation via orthology. 15× faster than BLAST.", url: "http://eggnog-mapper.embl.de", pricing: "Free" },
    ],
    dataNeeded: "Protein sequence(s).",
  },
  predict_transfer: {
    terminal: true, title: "Transfer Learning: Pre-trained + Small Dataset",
    paradigmBanner: { label: "Transfer Learning (Section 2.5)", color: "#dc2626", explanation: "Train on large D1 first, then fine-tune on small D2. The pre-trained model provides θ' already close to a good solution. Often dramatically outperforms training from scratch." },
    diy: [
      { name: "Proteins: ESM2 embeddings + fine-tune", libs: "fair-esm or transformers, torch, scikit-learn", desc: "See PREDICT > small > protein for full code. The key insight: ESM2 was trained on millions of sequences (D1), your few variants provide task-specific labels (D2).", top: true },
      { name: "Molecules: Chemprop pre-trained checkpoint", libs: "chemprop", desc: "Fine-tune a Chemprop model pre-trained on large public datasets (e.g., ChEMBL).", link: "https://github.com/chemprop/chemprop" },
      { name: "Images: torchvision pre-trained CNNs", libs: "pytorch, torchvision", desc: "Fine-tune ResNet/EfficientNet pre-trained on ImageNet. See PREDICT > medium > images for code.", link: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html" },
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
        howto: "# Use Claude/GPT for structured generation:\nprompt = '''Generate 5 candidate experimental conditions as JSON:\n{\"temperature\": float, \"pH\": float, \"substrate_conc\": float}\nConstraints: temperature 20-60°C, pH 5-8, substrate 0.1-10 mM\nOptimize for: enzyme activity'''" },
      { name: "Variational Autoencoder (VAE)", libs: "pytorch", desc: "Learn a compressed latent space from your data, then sample new points from the latent space. Good for: generating novel variants of existing data (molecules, sequences, spectra). Requires 1000+ training examples.", link: "https://pytorch.org/tutorials/beginner/variational_autoencoder.html",
        howto: "# Core idea:\n# Encoder: data → latent mean + variance (μ, σ)\n# Sample: z ~ N(μ, σ)\n# Decoder: z → reconstructed data\n# Loss = reconstruction_loss + KL_divergence(q(z|x) || p(z))\n# After training, sample z ~ N(0,1) and decode to get new data" },
      { name: "Diffusion model", libs: "pytorch, diffusers (huggingface)", desc: "Iteratively denoise random noise into data. State of the art for images and 3D structures. Requires large datasets and GPU training.", link: "https://huggingface.co/docs/diffusers/" },
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
      { name: "Neurosnap", desc: "80+ protein AI tools via web interface. Run RFdiffusion, ProteinMPNN, AlphaFold, Boltz, DiffDock, CatPred, and more. No coding.", url: "https://neurosnap.ai", pricing: "Free tier", top: true },
      { name: "Tamarind Bio", desc: "100+ tools. 10 free runs/mo per tool. Excellent 'Intro to AI for Proteins' guide.", url: "https://www.tamarind.bio", pricing: "10 free/mo/tool", top: true },
    ],
    diy: [
      { name: "ESM3 — multi-modal generation", libs: "EvolutionaryScale API or local weights", desc: "Generate proteins conditioned on sequence, structure, and/or function simultaneously. The most flexible single generative model.", link: "https://www.evolutionaryscale.ai" },
    ],
    dataNeeded: "Depends on the task. At minimum: a description of what you want the protein to do. Specific tools need specific inputs (structures, sequences, constraints).",
  },
  gen_enzyme: {
    terminal: true, title: "De Novo Enzyme Design",
    paradigmBanner: { label: "Diffusion (Section 2.6 + 4.2)", color: "#7c3aed", explanation: "RFdiffusion uses denoising diffusion: noise → protein backbone, conditioned on active site geometry. This is Watson et al. from Section 4.2." },
    description: "Pipeline: RFdiffusion2 (backbone) → LigandMPNN (sequence) → Boltz-2 (validate)",
    hosted: [
      { name: "Neurosnap", desc: "Run RFdiffusion2, LigandMPNN, and Boltz-2 via web interface. No coding.", url: "https://neurosnap.ai", pricing: "Free tier", top: true },
      { name: "Tamarind Bio", desc: "Same tools, 10 free runs/mo per tool.", url: "https://www.tamarind.bio", pricing: "10 free/mo/tool", top: true },
    ],
    diy: [
      { name: "RFdiffusion2 (locally, GPU)", libs: "RFdiffusion (GitHub), PyTorch, CUDA", desc: "Run on HPC with GPU. Requires ~16GB VRAM.", link: "https://github.com/RosettaCommons/RFdiffusion",
        howto: "# Clone repo, install dependencies, download weights\n# Run with contig specification for theozyme scaffolding:\npython run_inference.py \\\n  --config-name=base \\\n  inference.input_pdb=theozyme.pdb \\\n  contigmap.contigs=['10-40/A1-5/10-40']" },
      { name: "LigandMPNN (inverse fold with ligand context)", libs: "LigandMPNN (GitHub)", desc: "Design sequences that fold around the generated backbone + ligand. Runs on CPU in <1 sec.", link: "https://github.com/dauparas/LigandMPNN",
        howto: "python run.py \\\n  --model_type ligand_mpnn \\\n  --pdb_path designed_backbone.pdb \\\n  --out_folder output/" },
    ],
    dataNeeded: "A theozyme: catalytic residue identities + 3D coordinates + substrate geometry.",
  },
  gen_binder: {
    terminal: true, title: "De Novo Binder Design",
    hosted: [
      { name: "BindCraft (Colab / Tamarind)", desc: "AF2 hallucination. 10–100% hit rates at nM affinity.", url: "https://github.com/martinpacesa/BindCraft", pricing: "Free", top: true },
    ],
    dataNeeded: "Target protein structure (PDB). Optionally: epitope.",
  },
  gen_scaffold: {
    terminal: true, title: "Generate Novel Scaffolds",
    hosted: [
      { name: "RFdiffusion (Neurosnap/Tamarind)", desc: "Conditioned on symmetry, fold, motifs, or unconditional.", url: "https://neurosnap.ai", pricing: "Free tier", top: true },
    ],
    diy: [
      { name: "Chroma — text-conditioned protein generation", libs: "chroma (GitHub)", desc: "Condition on text prompts ('a TIM barrel enzyme'), shape, symmetry.", link: "https://github.com/generatebio/chroma" },
      { name: "ESM3 — multi-modal generative", libs: "EvolutionaryScale API", desc: "Sequence + structure + function jointly. Generated a functional novel GFP.", link: "https://www.evolutionaryscale.ai" },
    ],
    dataNeeded: "Optional conditioning specs.",
  },
  gen_invfold: {
    terminal: true, title: "Inverse Folding (backbone → sequence)",
    hosted: [
      { name: "ProteinMPNN / LigandMPNN (Neurosnap/Tamarind)", desc: "Web interface, no coding. <1 sec per design.", url: "https://neurosnap.ai", pricing: "Free tier", top: true },
    ],
    diy: [
      { name: "ProteinMPNN locally", libs: "ProteinMPNN (GitHub), PyTorch", desc: "Runs on CPU. Generates multiple sequence candidates per backbone.", link: "https://github.com/dauparas/LigandMPNN",
        howto: "python run.py \\\n  --pdb_path backbone.pdb \\\n  --out_folder output/ \\\n  --num_seq_per_target 100  # generate 100 candidate sequences" },
    ],
    dataNeeded: "A 3D backbone (PDB file).",
  },
  gen_path: {
    terminal: true, title: "Design Pathways, Circuits, or DNA Parts",
    hosted: [
      { name: "Galaxy-SynBioCAD", desc: "No-code: retrosynthesis → scoring → DNA parts → robotic scripts.", url: "https://galaxy-synbiocad.org", pricing: "Free", top: true },
      { name: "RetroPath2.0", desc: "400K+ reaction rules. Found routes for ~84% of known targets.", url: "https://retrorules.org", pricing: "Free" },
      { name: "Cello 2.0", desc: "Boolean logic (Verilog) → genetic circuit DNA.", url: "https://www.cidarlab.org/cello", pricing: "Free" },
    ],
    diy: [
      { name: "DNA Chisel — multi-constraint codon optimization", libs: "dnachisel (pip install dnachisel)", desc: "Satisfies multiple constraints simultaneously: restriction sites, GC content, vendor constraints, codon usage tables.", link: "https://github.com/Edinburgh-Genome-Foundry/DnaChisel",
        howto: "from dnachisel import DnaOptimizationProblem, CodonOptimize, AvoidPattern\n\nproblem = DnaOptimizationProblem(\n    sequence=my_sequence,\n    constraints=[AvoidPattern('BsaI_site')],\n    objectives=[CodonOptimize(species='e_coli')]\n)\nproblem.resolve_constraints()\nproblem.optimize()" },
    ],
    dataNeeded: "Target molecule (SMILES/name) or Boolean logic spec.",
  },
  gen_text: {
    terminal: true, title: "Generate Text, Code, or Reports",
    paradigmBanner: { label: "LLMs — Causal Language Modeling", color: "#7c3aed", explanation: "LLMs = self-supervised on text (Section 2.6): predict the next token. The 'general AI' from Section 1.1." },
    hosted: [
      { name: "Claude", desc: "Strongest reasoning for scientific content.", url: "https://claude.com", pricing: "Free tier; Pro $20/mo", top: true },
      { name: "GitHub Copilot", desc: "Best in-IDE code completion. 2,000 free completions/mo.", url: "https://github.com/features/copilot", pricing: "Free; Pro $10/mo", top: true },
      { name: "Cursor", desc: "Most powerful multi-file agentic editing.", url: "https://cursor.com", pricing: "Free tier; Pro $20/mo" },
    ],
    diy: [
      { name: "Run open-source LLMs on HPC (vLLM)", libs: "vllm, torch", desc: "Deploy Qwen, Mistral, Llama on HPC GPUs. Useful for batch processing, sensitive data, or custom fine-tuning.", link: "https://docs.vllm.ai/",
        howto: "# On Kestrel / HPC with H100s:\npip install vllm\npython -m vllm.entrypoints.openai.api_server \\\n  --model mistralai/Mistral-7B-Instruct-v0.3 \\\n  --tensor-parallel-size 2  # multi-GPU" },
    ],
    dataNeeded: "A clear prompt. Be specific, provide examples.",
  },
  gen_proto: {
    terminal: true, title: "Generate Experimental Protocols",
    hosted: [
      { name: "CRISPR-GPT", desc: "Automates CRISPR design. 90%+ editing efficiency for a novice.", url: "https://genomics.stanford.edu", pricing: "Free beta", top: true },
      { name: "CHOPCHOP v3", desc: "Guide RNA design for Cas9/12a/13 across 200+ organisms.", url: "https://chopchop.cbu.uib.no", pricing: "Free" },
      { name: "CRISPOR", desc: "30+ Cas variants, 549+ genomes.", url: "http://crispor.tefor.net", pricing: "Free" },
      { name: "Opentrons AI", desc: "Liquid handling protocols from natural language.", url: "https://opentrons.com", pricing: "Free (with hardware)" },
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
      { label: "Something else in the lab", next: "opt_general" },
    ],
  },
  opt_general: {
    terminal: true, title: "General Lab Optimization (Bayesian Optimization)",
    paradigmBanner: { label: "Bayesian Optimization — The General Recipe", color: "#059669", explanation: "Any iterative lab optimization with continuous or mixed parameters can be framed as Bayesian optimization. You need: (1) a parameter space with bounds, (2) an objective to maximize/minimize, (3) the ability to run experiments in rounds." },
    diy: [
      { name: "GP + UCB in scikit-learn (general recipe)", libs: "scikit-learn, numpy", desc: "This works for ANY optimization problem where experiments are expensive and you can define numeric input parameters + a numeric outcome. Temperature, pH, concentrations, flow rates, residence times, pressures — anything.", top: true,
        howto: "from sklearn.gaussian_process import GaussianProcessRegressor\nfrom sklearn.gaussian_process.kernels import Matern\nimport numpy as np\n\n# Define your parameter space\nbounds = np.array([\n    [20, 60],    # param 1: temperature (°C)\n    [5.0, 8.0],  # param 2: pH\n    [0.1, 10],   # param 3: concentration (mM)\n])  # shape: (n_params, 2)\n\n# Your initial experiments\nX_tested = np.array([...])  # shape: (n_experiments, n_params)\ny_tested = np.array([...])  # shape: (n_experiments,)\n\n# Fit surrogate\ngp = GaussianProcessRegressor(kernel=Matern(nu=2.5), normalize_y=True)\ngp.fit(X_tested, y_tested)\n\n# Score random candidates\nX_candidates = np.random.uniform(bounds[:,0], bounds[:,1], size=(10000, len(bounds)))\ny_pred, y_std = gp.predict(X_candidates, return_std=True)\n\n# UCB acquisition\nbeta = 2.0\nnext_experiment = X_candidates[np.argmax(y_pred + beta * y_std)]\nprint(f'Next experiment: {next_experiment}')" },
      { name: "BoTorch for advanced use cases", libs: "botorch, gpytorch, torch", desc: "Use when you need: batch acquisition (select N experiments per round), multi-objective optimization, constraints (e.g., cost limits), or mixed continuous/categorical parameters.", link: "https://botorch.org/",
        howto: "# BoTorch handles:\n# - Batch: select 5 experiments simultaneously (q=5)\n# - Multi-objective: optimize yield AND purity\n# - Constraints: keep cost < budget\n# - Mixed params: continuous + categorical\n# See: https://botorch.org/tutorials/" },
    ],
    dataNeeded: "Parameter space definition (bounds for each variable) + initial experiments (~10–30 with measured outcomes). Plan for 3–10 iterative rounds.",
    clinicConnection: "This is the UCB demo from Section 2.3 generalized to any domain. The math is identical — only the parameters and objectives change.",
  },
  opt_conditions: {
    terminal: true, title: "Optimize Process Conditions / Media",
    paradigmBanner: { label: "Bayesian Optimization", color: "#059669", explanation: "Exactly the UCB example from Section 2.3 — in multiple dimensions. GP models the response surface, acquisition function picks the most informative next experiment, balancing exploitation (try predicted best) and exploration (try uncertain regions)." },
    hosted: [
      { name: "ART (JBEI/LBL)", desc: "DOE lab tool. Bayesian ensemble. 106% tryptophan improvement.", url: "https://github.com/JBEI/ART", pricing: "Free (email azournas@lbl.gov)", top: true },
    ],
    diy: [
      { name: "Gaussian process Bayesian optimization (scikit-learn)", libs: "scikit-learn, numpy", desc: "Fit a GP surrogate to your data, compute UCB or Expected Improvement, select the next experiment at the acquisition function maximum. This is the active learning loop from Clinic 1 Section 2.3 generalized to N dimensions.", top: true,
        howto: "from sklearn.gaussian_process import GaussianProcessRegressor\nfrom sklearn.gaussian_process.kernels import Matern\nimport numpy as np\n\n# Your data: X = conditions tested (N x D), y = outcomes\ngp = GaussianProcessRegressor(kernel=Matern(nu=2.5), normalize_y=True)\ngp.fit(X_tested, y_tested)\n\n# Generate candidate conditions (grid or random)\nX_candidates = np.random.uniform(low=bounds[:,0], high=bounds[:,1], size=(10000, D))\ny_pred, y_std = gp.predict(X_candidates, return_std=True)\n\n# UCB acquisition function\nbeta = 2.0  # exploration weight\nucb = y_pred + beta * y_std\nnext_experiment = X_candidates[np.argmax(ucb)]" },
      { name: "BoTorch — production Bayesian optimization", libs: "botorch, gpytorch, torch", desc: "Facebook's library for advanced BayesOpt. Supports batch acquisition (select multiple experiments per round), multi-objective optimization, and constrained optimization. Use when you outgrow scikit-learn GPs.", link: "https://botorch.org/",
        howto: "import torch\nfrom botorch.models import SingleTaskGP\nfrom botorch.fit import fit_gpytorch_mll\nfrom botorch.acquisition import qExpectedImprovement\nfrom botorch.optim import optimize_acqf\nfrom gpytorch.mlls import ExactMarginalLogLikelihood\n\n# Fit GP\nmodel = SingleTaskGP(train_X, train_Y)\nmll = ExactMarginalLogLikelihood(model.likelihood, model)\nfit_gpytorch_mll(mll)\n\n# Optimize acquisition function\nacqf = qExpectedImprovement(model, best_f=train_Y.max())\ncandidates, _ = optimize_acqf(acqf, bounds=bounds, q=5, num_restarts=20)" },
      { name: "Intellegens Alchemite", libs: "N/A (SaaS)", desc: "Commercial: enhances DOE with ML. Claims 50–80% fewer experiments.", link: "https://intellegens.com/doe/" },
    ],
    dataNeeded: "Initial experiments (~10–30 conditions + outcomes). Define parameter bounds (temperature: [20, 60], pH: [5, 8], etc.). Plan for 3–10 iterative rounds.",
    clinicConnection: "The UCB demo from Section 2.3, generalized to multiple dimensions. Each round: fit GP → compute acquisition → experiment → repeat.",
  },
  opt_strain: {
    terminal: true, title: "Optimize Strain Performance (DBTL)",
    hosted: [
      { name: "ART (JBEI/LBL)", desc: "Bayesian ensemble for DBTL. Proven on biofuel production optimization.", url: "https://github.com/JBEI/ART", pricing: "Free academic", top: true },
    ],
    diy: [
      { name: "Custom DBTL loop with BayesOpt", libs: "scikit-learn or botorch", desc: "Same GP + acquisition function approach as process optimization, but features are genetic modifications (promoter strengths, gene presence/absence) and outcomes are titer/rate/yield.", 
        howto: "# Features: encode genetic modifications as a numeric vector\n# - Gene knockouts: binary (0/1)\n# - Promoter strengths: continuous or ordinal\n# - Copy number: integer\n# Then follow the same BayesOpt loop as process conditions" },
    ],
    dataNeeded: "Genetic modifications + measured outcomes. Even 20–50 constructs can seed the first model.",
  },
  opt_compute: {
    terminal: true, title: "Optimize Over Simulations",
    paradigmBanner: { label: "Surrogate Modeling + BayesOpt", color: "#059669", explanation: "When each simulation is expensive, build a cheap ML surrogate (supervised learning), then optimize over the surrogate. This is the Hyun-Seob et al. pattern from Section 4.1." },
    hosted: [
      { name: "COBRApy + StrainDesign", desc: "GEM optimization: OptKnock, FVA, RobustKnock.", url: "https://github.com/opencobra/cobrapy", pricing: "Free", top: true },
    ],
    diy: [
      { name: "ML surrogate + Bayesian optimization", libs: "scikit-learn or pytorch, botorch", desc: "1) Sample parameter space (Latin hypercube). 2) Run simulation at each point. 3) Train ML surrogate on simulation I/O. 4) Optimize over surrogate with BayesOpt.",
        howto: "from scipy.stats import qmc\n\n# 1. Sample parameter space\nsampler = qmc.LatinHypercube(d=num_params)\nX_sample = sampler.random(n=500)\nX_sample = qmc.scale(X_sample, bounds[:,0], bounds[:,1])\n\n# 2. Run simulation at each point\ny_sample = [run_simulation(x) for x in X_sample]\n\n# 3. Train surrogate (neural network or GP)\nfrom sklearn.neural_network import MLPRegressor\nsurrogate = MLPRegressor(hidden_layer_sizes=(64, 64)).fit(X_sample, y_sample)\n\n# 4. Optimize over surrogate (grid search or BayesOpt)\n# Much cheaper than optimizing over the real simulation" },
      { name: "BioSTEAM — TEA/LCA optimization", libs: "biosteam", desc: "Python framework for techno-economic + life cycle analysis of biorefineries.", link: "https://biosteam.readthedocs.io/" },
    ],
    dataNeeded: "A parameterized simulation. Generate training data via Latin hypercube or Sobol sampling.",
    clinicConnection: "Hyun-Seob et al. (Section 4.1): replace FBA with neural network for 1000× speedup.",
  },
  opt_hyper: {
    terminal: true, title: "Hyperparameter Optimization",
    paradigmBanner: { label: "Meta-Optimization (Section 3.4)", color: "#059669" },
    diy: [
      { name: "Optuna — Bayesian hyperparameter search", libs: "optuna", desc: "State-of-the-art. Tree-structured Parzen estimator + pruning. Automatically stops bad trials early.", link: "https://optuna.org/", top: true,
        howto: "import optuna\n\ndef objective(trial):\n    params = {\n        'max_depth': trial.suggest_int('max_depth', 3, 10),\n        'learning_rate': trial.suggest_float('lr', 1e-3, 0.3, log=True),\n        'n_estimators': trial.suggest_int('n_est', 50, 500),\n    }\n    model = xgb.XGBRegressor(**params)\n    score = cross_val_score(model, X, y, cv=5, scoring='r2').mean()\n    return score\n\nstudy = optuna.create_study(direction='maximize')\nstudy.optimize(objective, n_trials=100)" },
      { name: "RandomizedSearchCV (scikit-learn)", libs: "scikit-learn", desc: "Simple random search with cross-validation. Good starting point. Usually better than grid search.", link: "https://scikit-learn.org/stable/modules/grid_search.html",
        howto: "from sklearn.model_selection import RandomizedSearchCV\nsearch = RandomizedSearchCV(model, param_distributions, n_iter=50, cv=5)\nsearch.fit(X, y)" },
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
        howto: "import pandas as pd\nimport numpy as np\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\nimport umap\nimport hdbscan\nimport matplotlib.pyplot as plt\n\n# 1. Load and clean\ndf = pd.read_csv('data.csv')\nX = df.select_dtypes(include=[np.number]).dropna()\n\n# 2. Scale\nX_scaled = StandardScaler().fit_transform(X)\n\n# 3. PCA — how many dimensions matter?\npca = PCA().fit(X_scaled)\nplt.plot(np.cumsum(pca.explained_variance_ratio_))\nplt.xlabel('Components'); plt.ylabel('Cumulative variance')\n\n# 4. UMAP for visualization\nX_2d = umap.UMAP().fit_transform(X_scaled)\n\n# 5. Cluster\nlabels = hdbscan.HDBSCAN(min_cluster_size=10).fit_predict(X_2d)\nplt.scatter(X_2d[:,0], X_2d[:,1], c=labels, s=5, cmap='tab20')" },
      { name: "Correlation analysis", libs: "pandas, seaborn", desc: "Before any ML, look at pairwise correlations. Often the simplest analysis is the most informative.",
        howto: "import seaborn as sns\nsns.heatmap(df.corr(), annot=True, cmap='coolwarm', center=0)\n# Look for: strong correlations, unexpected relationships, redundant features" },
    ],
    dataNeeded: "Any dataset with multiple numeric features across multiple examples. The more examples and features, the more structure you can find.",
    clinicConnection: "Section 2.2 (unsupervised learning). Clustering and dim reduction are the two main unsupervised tools. PCA is linear, UMAP is non-linear.",
  },
  und_cluster: {
    terminal: true, title: "Find Clusters",
    paradigmBanner: { label: "Unsupervised — Clustering (Section 2.2)", color: "#d97706" },
    diy: [
      { name: "KMeans — when you know ~how many groups", libs: "scikit-learn", desc: "Fast. Specify k. Use the elbow method or silhouette score to choose k.", top: true,
        howto: "from sklearn.cluster import KMeans\nfrom sklearn.metrics import silhouette_score\nfrom sklearn.preprocessing import StandardScaler\n\nX_scaled = StandardScaler().fit_transform(X)\n\n# Try different k, pick best silhouette\nfor k in range(2, 10):\n    km = KMeans(n_clusters=k, n_init=10)\n    labels = km.fit_predict(X_scaled)\n    print(f'k={k}, silhouette={silhouette_score(X_scaled, labels):.3f}')" },
      { name: "HDBSCAN — discover clusters automatically", libs: "hdbscan or scikit-learn (v1.3+)", desc: "No need to specify k. Handles noise points (labels them as -1). Works well after UMAP dimensionality reduction.",
        howto: "import hdbscan\n\nclustering = hdbscan.HDBSCAN(min_cluster_size=15)\nlabels = clustering.fit_predict(X_scaled)\nprint(f'Found {len(set(labels)) - 1} clusters + noise')" },
      { name: "UMAP + HDBSCAN (common combo)", libs: "umap-learn, hdbscan", desc: "Reduce to low-D with UMAP first, then cluster. Often better than clustering in high-D.", top: true,
        howto: "import umap\nimport hdbscan\n\nreducer = umap.UMAP(n_components=10)  # reduce to 10D for clustering\nX_umap = reducer.fit_transform(X_scaled)\n\nlabels = hdbscan.HDBSCAN(min_cluster_size=15).fit_predict(X_umap)" },
    ],
    dataNeeded: "N × M numeric feature matrix. Scale features (StandardScaler) first.",
  },
  und_dim: {
    terminal: true, title: "Dimensionality Reduction & Visualization",
    paradigmBanner: { label: "Unsupervised — Dim. Reduction (Section 2.2)", color: "#d97706" },
    diy: [
      { name: "PCA — linear, interpretable", libs: "scikit-learn", desc: "Start here. PC axes tell you the main directions of variation. Variance explained ratio tells you how much information each PC captures.", top: true,
        howto: "from sklearn.decomposition import PCA\nimport matplotlib.pyplot as plt\n\npca = PCA(n_components=2)\nX_pca = pca.fit_transform(X_scaled)\nprint(f'Explained variance: {pca.explained_variance_ratio_}')\n\nplt.scatter(X_pca[:, 0], X_pca[:, 1], c=labels_if_any)\nplt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')" },
      { name: "UMAP — non-linear, preserves local structure", libs: "umap-learn", desc: "Better than t-SNE for most biological data. Faster, and UMAP distances are more interpretable.", top: true,
        howto: "import umap\n\nreducer = umap.UMAP(n_neighbors=15, min_dist=0.1, metric='euclidean')\nX_2d = reducer.fit_transform(X_scaled)\nplt.scatter(X_2d[:, 0], X_2d[:, 1], c=labels, s=5)" },
      { name: "t-SNE — non-linear, visualization only", libs: "scikit-learn", desc: "Classic for visualization. Slower. Distances between clusters are NOT meaningful (only within-cluster structure is).",
        howto: "from sklearn.manifold import TSNE\nX_tsne = TSNE(n_components=2, perplexity=30).fit_transform(X_scaled)" },
    ],
    dataNeeded: "High-dimensional numeric feature matrix.",
  },
  und_eda: {
    terminal: true, title: "Exploratory Data Analysis",
    hosted: [
      { name: "Claude / ChatGPT Analysis", desc: "Upload CSV, describe what you want. Generates plots + statistics.", url: "https://claude.com", pricing: "Free tier / $20/mo", top: true },
      { name: "Julius AI", desc: "No-code: upload data, ask in English.", url: "https://julius.ai", pricing: "Free (15 msgs/mo)" },
    ],
    diy: [
      { name: "pandas + seaborn quick EDA", libs: "pandas, seaborn, matplotlib", desc: "The standard Python EDA workflow. Start with df.describe(), df.corr(), pairplots.",
        howto: "import pandas as pd\nimport seaborn as sns\n\ndf = pd.read_csv('data.csv')\nprint(df.describe())\nprint(df.isnull().sum())\n\n# Correlation heatmap\nsns.heatmap(df.corr(), annot=True, cmap='coolwarm')\n\n# Pairplot (small # of features)\nsns.pairplot(df, hue='category_col')", top: true },
      { name: "Google Colab", desc: "Free Jupyter with GPU. Pre-installed scientific libraries.", url: "https://colab.research.google.com" },
    ],
    dataNeeded: "Data in CSV / Excel format.",
  },
  und_interp: {
    terminal: true, title: "Model Interpretability",
    diy: [
      { name: "SHAP — model-agnostic feature importance", libs: "shap", desc: "Shows which features drive each prediction and by how much. Works with any model (linear, tree, NN). The gold standard for interpretability.", link: "https://shap.readthedocs.io/", top: true,
        howto: "import shap\n\n# For tree models (fast):\nexplainer = shap.TreeExplainer(model)\nshap_values = explainer.shap_values(X_test)\n\n# Summary plot (global importance)\nshap.summary_plot(shap_values, X_test, feature_names=feature_names)\n\n# Force plot (explain one prediction)\nshap.force_plot(explainer.expected_value, shap_values[0], X_test.iloc[0])" },
      { name: "Permutation importance (scikit-learn)", libs: "scikit-learn", desc: "Simpler than SHAP. Shuffle each feature and measure performance drop. Large drop = important feature.",
        howto: "from sklearn.inspection import permutation_importance\nresult = permutation_importance(model, X_test, y_test, n_repeats=10)\nfor i in result.importances_mean.argsort()[::-1]:\n    print(f'{feature_names[i]}: {result.importances_mean[i]:.3f} ± {result.importances_std[i]:.3f}')" },
    ],
    dataNeeded: "A trained model + dataset.",
  },
  und_annot: {
    terminal: true, title: "Genome Annotation",
    hosted: [
      { name: "Bakta", desc: "Rapid standardized bacterial annotation.", url: "https://bakta.computational.bio", pricing: "Free", top: true },
      { name: "KBase", desc: "DOE-funded. Assembly + annotation + metabolic modeling.", url: "https://www.kbase.us", pricing: "Free", top: true },
      { name: "eggNOG-mapper v2", desc: "Functional annotation via orthology. 15× faster than BLAST.", url: "http://eggnog-mapper.embl.de", pricing: "Free" },
    ],
    dataNeeded: "Assembled genome (FASTA).",
  },
  und_micro: {
    terminal: true, title: "Microbial Community Profiling",
    diy: [
      { name: "MetaPhlAn 4", libs: "metaphlan (conda install)", desc: "Species-level profiling from metagenomic data.", link: "https://github.com/biobakery/MetaPhlAn", top: true,
        howto: "metaphlan sample.fastq --input_type fastq -o profiled_metagenome.txt" },
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
        howto: "from langgraph.graph import StateGraph\nfrom langchain_anthropic import ChatAnthropic\nfrom langchain_core.tools import tool\n\n# 1. Define tools the agent can use\n@tool\ndef search_database(query: str) -> str:\n    \"\"\"Search the internal database.\"\"\"\n    return db.search(query)\n\n@tool  \ndef run_analysis(data: str) -> str:\n    \"\"\"Run statistical analysis on data.\"\"\"\n    return analyze(data)\n\n# 2. Define agent state and graph\n# 3. Add nodes (LLM reasoning, tool execution)\n# 4. Add edges (routing based on LLM decisions)\n# See: https://langchain-ai.github.io/langgraph/tutorials/" },
      { name: "Simple tool-use with Claude API", libs: "anthropic", desc: "For simpler automation: give Claude a set of tools (functions) it can call. No framework needed.", link: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use",
        howto: "import anthropic\nclient = anthropic.Anthropic()\n\n# Define tools as JSON schemas\ntools = [{\n    'name': 'query_database',\n    'description': 'Query the experiment database',\n    'input_schema': {'type': 'object', 'properties': {\n        'sql': {'type': 'string', 'description': 'SQL query'}\n    }}\n}]\n\nresponse = client.messages.create(\n    model='claude-sonnet-4-20250514',\n    tools=tools,\n    messages=[{'role': 'user', 'content': 'Find all experiments with yield > 80%'}]\n)" },
    ],
    dataNeeded: "Define: (1) the goal, (2) the tools/APIs the agent can access, (3) what decisions it needs to make. Start simple — a single LLM + 2-3 tools — before building complex multi-agent systems.",
  },
  auto_research: {
    terminal: true, title: "Autonomous Research Agents",
    hosted: [
      { name: "FutureHouse Platform", desc: "Crow (literature), Falcon (databases), Phoenix (synthesis), Finch (data analysis).", url: "https://platform.futurehouse.org", pricing: "Free", top: true },
      { name: "Google AI Co-Scientist", desc: "Multi-agent hypothesis generation. Accelerated for DOE labs.", url: "https://research.google/blog/accelerating-scientific-breakthroughs-with-an-ai-co-scientist/", pricing: "Free for DOE", top: true },
    ],
    diy: [
      { name: "LangGraph multi-agent system", libs: "langgraph, langchain", desc: "Build custom agent workflows: literature search → hypothesis → experiment design → analysis. Orchestrate specialized sub-agents.", link: "https://langchain-ai.github.io/langgraph/",
        howto: "# Define agent state, nodes (tools/LLMs), and edges (routing logic)\n# See LangGraph docs for patterns:\n# - Supervisor pattern (router agent)\n# - Hierarchical (sub-agents)\n# - Human-in-the-loop" },
    ],
    dataNeeded: "A research question.",
  },
  auto_lab: {
    terminal: true, title: "Lab Automation",
    hosted: [
      { name: "Opentrons + AI", desc: "Affordable robots (~$25K) + AI protocols from natural language.", url: "https://opentrons.com", pricing: "~$25K hardware; AI free", top: true },
      { name: "Benchling AI", desc: "ELN agents: Deep Research, Compose, Data Entry.", url: "https://www.benchling.com/ai", pricing: "Free for academics" },
    ],
    dataNeeded: "Protocol description or SOPs.",
  },
  auto_code: {
    terminal: true, title: "Automate Coding",
    hosted: [
      { name: "Claude Code", desc: "CLI agentic coding for scientific code.", url: "https://claude.com", pricing: "Pro $20/mo", top: true },
      { name: "Cursor", desc: "Agentic multi-file IDE.", url: "https://cursor.com", pricing: "Free tier; Pro $20/mo", top: true },
      { name: "Jupyter AI", desc: "AI in notebooks. Supports local models for HPC.", url: "https://github.com/jupyterlab/jupyter-ai", pricing: "Free" },
    ],
    diy: [
      { name: "Windsurf / Tabnine (secure environments)", libs: "N/A", desc: "Windsurf: FedRAMP High certified. Tabnine: fully air-gapped on-premise. For national lab compliance.", link: "https://windsurf.com" },
    ],
    dataNeeded: "Your codebase.",
  },
  auto_lit: {
    terminal: true, title: "Literature Monitoring",
    hosted: [
      { name: "Semantic Scholar Alerts", desc: "Free alerts for new papers.", url: "https://www.semanticscholar.org", pricing: "Free", top: true },
      { name: "Elicit Notebooks", desc: "Living reviews that auto-update.", url: "https://elicit.com", pricing: "Free tier" },
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
        howto: "# General prompt template:\nprompt = '''\nRole: You are a [scientific writer / technical editor / etc.]\nTask: [specific task]\nAudience: [who will read this]\nFormat: [email / abstract / report / etc.]\nTone: [formal / casual / technical]\nConstraints: [word limit, style guide, etc.]\n\nInput: [your content]\n\nOutput:'''" },
    ],
    dataNeeded: "Your content and a clear description of what you want.",
  },
  comm_paper: {
    terminal: true, title: "Scientific Writing",
    hosted: [
      { name: "Paperpal", desc: "Grammar, 250M+ paper citations, plagiarism, journal checks.", url: "https://paperpal.com", pricing: "Free; Prime ~$13/mo", top: true },
      { name: "Writefull", desc: "Trained on peer-reviewed articles. Best for LaTeX.", url: "https://www.writefull.com", pricing: "Free; ~$7/mo" },
    ],
    dataNeeded: "Your draft.",
    note: "NIH policy NOT-OD-25-132 prohibits applications substantially developed with AI. Use for editing, not generation.",
  },
  comm_grant: {
    terminal: true, title: "Grant Writing",
    hosted: [{ name: "Granted AI", desc: "Reads RFPs, coaches section-by-section. DOE/NSF/NIH.", url: "https://grantedai.com", pricing: "$29/mo", top: true }],
    note: "Use for coaching, not wholesale generation.",
  },
  comm_fig: {
    terminal: true, title: "Scientific Figures",
    hosted: [{ name: "BioRender", desc: "50,000+ icons, AI editing, PDB integration.", url: "https://www.biorender.com", pricing: "Free plan; ~$39/mo", top: true }],
  },
  comm_pres: {
    terminal: true, title: "Presentations",
    hosted: [{ name: "Gamma", desc: "Decks from text. Exports to PowerPoint.", url: "https://gamma.app", pricing: "Free plan", top: true }],
  },
  comm_know: {
    question: "What kind of system?",
    options: [
      { label: "Team wiki", next: "comm_team" },
      { label: "Personal notes (local/private)", next: "comm_pers" },
      { label: "Academic writing + references", next: "comm_refs" },
    ],
  },
  comm_team: { terminal: true, title: "Team Workspace", hosted: [{ name: "Notion AI", desc: "Notes + databases + wikis + AI.", url: "https://www.notion.so", pricing: "$10/mo + $10/mo AI", top: true }] },
  comm_pers: {
    terminal: true, title: "Personal Knowledge Base",
    hosted: [
      { name: "Obsidian", desc: "Local-first. Bidirectional linking. AI plugins.", url: "https://obsidian.md", pricing: "Free", top: true },
      { name: "Logseq", desc: "Open-source. PDF annotation + knowledge graphs.", url: "https://logseq.com", pricing: "Free" },
    ],
    note: "Critical for pre-publication data — stays on your machine.",
  },
  comm_refs: { terminal: true, title: "Academic Writing + References", hosted: [{ name: "Zettlr", desc: "Markdown + Zotero + LaTeX.", url: "https://www.zettlr.com", pricing: "Free", top: true }] },
};

// ─── helpers ───
function getCatColor(p) {
  if (p.length <= 1) return null;
  return { find:"#2563eb",predict:"#dc2626",generate:"#7c3aed",optimize:"#059669",understand:"#d97706",automate:"#0891b2",communicate:"#be185d" }[p[1]] || "#64748b";
}
const bs = { padding:"4px 12px", border:"1px solid #e2e8f0", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:500, color:"#475569", background:"#f8fafc" };

// ─── Component ───
export default function DecisionTree() {
  const [path, setPath] = useState(["root"]);
  const [showCode, setShowCode] = useState({});
  const id = path[path.length-1], node = NODES[id], cc = getCatColor(path), isRoot = id==="root";

  const nav = useCallback(n => setPath(p => [...p, n]), []);
  const back = useCallback(() => setPath(p => p.length>1 ? p.slice(0,-1) : p), []);
  const home = useCallback(() => setPath(["root"]), []);
  const toggleCode = useCallback(k => setShowCode(s => ({...s, [k]: !s[k]})), []);

  const crumbs = useMemo(() => path.map((pid,i) => {
    const n = NODES[pid]; if (!n) return pid;
    if (n.terminal) return n.title.length>28 ? n.title.slice(0,25)+"…" : n.title;
    if (pid==="root") return "Start";
    for (let j=i-1;j>=0;j--) { const par=NODES[path[j]]; if(par?.options){ const o=par.options.find(x=>x.next===pid); if(o){const l=o.label; return l.length>28?l.slice(0,25)+"…":l;}}}
    return pid;
  }), [path]);

  const renderTool = (t, i, section) => {
    const key = `${section}-${i}`;
    return (
      <div key={key} style={{ background:"#fff", border:`1px solid ${t.top?(cc||"#2563eb"):"#e2e8f0"}`, borderRadius:8, padding:"10px 14px", marginBottom:6, borderLeft:t.top?`3px solid ${cc||"#2563eb"}`:undefined }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2, flexWrap:"wrap" }}>
          <span style={{ fontSize:14, fontWeight:700 }}>
            {t.url ? <a href={t.url} target="_blank" rel="noopener noreferrer" style={{ color:cc||"#2563eb", textDecoration:"none" }}>{t.name} ↗</a> : <span style={{color:"#1e293b"}}>{t.name}</span>}
          </span>
          {t.top && <span style={{ fontSize:9, fontWeight:700, background:(cc||"#2563eb")+"18", color:cc||"#2563eb", padding:"1px 7px", borderRadius:10 }}>RECOMMENDED</span>}
          {t.pricing && <span style={{ fontSize:10, color:"#94a3b8" }}>💰 {t.pricing}</span>}
        </div>
        {t.libs && <div style={{ fontSize:11, color:"#059669", fontFamily:"monospace", marginBottom:2 }}>📦 {t.libs}</div>}
        <p style={{ fontSize:12, color:"#374151", margin:"0 0 3px", lineHeight:1.45 }}>{t.desc}</p>
        {t.link && <a href={t.link} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:cc||"#2563eb" }}>📖 Documentation ↗</a>}
        {t.howto && (
          <div style={{ marginTop:4 }}>
            <button onClick={() => toggleCode(key)} style={{ fontSize:11, color:cc||"#2563eb", background:"none", border:"none", cursor:"pointer", padding:0, textDecoration:"underline" }}>
              {showCode[key] ? "▼ Hide code example" : "▶ Show code example"}
            </button>
            {showCode[key] && (
              <pre style={{ background:"#1e293b", color:"#e2e8f0", padding:"10px 12px", borderRadius:6, fontSize:11, lineHeight:1.5, overflow:"auto", marginTop:4, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{t.howto}</pre>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,system-ui,sans-serif", maxWidth:860, margin:"0 auto", padding:16 }}>
      <div style={{ textAlign:"center", marginBottom:18, paddingBottom:14, borderBottom:"1px solid #e2e8f0" }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:"#1e293b", margin:0 }}>AI/ML Decision Guide for Biological Science</h1>
        <p style={{ fontSize:11, color:"#94a3b8", margin:"3px 0 0" }}>AI Clinic Series</p>
      </div>

      {cc && <div style={{ height:3, background:cc, borderRadius:2, marginBottom:10 }} />}

      {!isRoot && (
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", gap:6, marginBottom:6 }}>
            <button onClick={back} style={bs}>← Back</button>
            <button onClick={home} style={{...bs, color:"#94a3b8"}}>Start over</button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:3, fontSize:11, color:"#94a3b8" }}>
            {crumbs.map((l,i) => (
              <span key={i} style={{ display:"flex", alignItems:"center", gap:3 }}>
                {i>0 && <span>›</span>}
                <span onClick={()=>i<path.length-1&&setPath(path.slice(0,i+1))} style={{ cursor:i<path.length-1?"pointer":"default", fontWeight:i===path.length-1?600:400, color:i===path.length-1?(cc||"#1e293b"):"#94a3b8", textDecoration:i<path.length-1?"underline":"none" }}>{l}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {node?.paradigmBanner && (
        <div style={{ background:node.paradigmBanner.color+"0d", border:`1px solid ${node.paradigmBanner.color}33`, borderRadius:8, padding:"10px 14px", marginBottom:12, borderLeft:`4px solid ${node.paradigmBanner.color}` }}>
          <div style={{ fontSize:12, fontWeight:700, color:node.paradigmBanner.color, marginBottom:node.paradigmBanner.explanation?4:0 }}>🎓 {node.paradigmBanner.label}</div>
          {node.paradigmBanner.explanation && <div style={{ fontSize:12, color:"#374151", lineHeight:1.55 }}>{node.paradigmBanner.explanation}</div>}
        </div>
      )}
      {node?.infoBox && <div style={{ background:node.infoBox.color+"0a", border:`1px solid ${node.infoBox.color}22`, borderRadius:8, padding:"10px 14px", marginBottom:12, fontSize:12, color:"#374151", lineHeight:1.55 }}>💡 {node.infoBox.text}</div>}

      {/* QUESTION NODE */}
      {!node?.terminal && (
        <div>
          <h2 style={{ fontSize:18, fontWeight:600, color:"#1e293b", margin:"0 0 4px" }}>{node.question}</h2>
          {node.subtitle && <p style={{ fontSize:13, color:"#64748b", margin:"0 0 12px" }}>{node.subtitle}</p>}
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {node.options.map((o,i) => (
              <button key={i} onClick={()=>nav(o.next)} style={{ display:"flex", alignItems:"center", gap:12, padding:isRoot?"14px 16px":"11px 14px", background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, cursor:"pointer", textAlign:"left", borderLeft:o.color?`4px solid ${o.color}`:undefined, transition:"border-color 0.1s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=cc||"#2563eb";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";}}>
                {o.icon && <span style={{ fontSize:22, flexShrink:0 }}>{o.icon}</span>}
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:isRoot?15:14, fontWeight:isRoot?700:500, color:"#1e293b" }}>{o.label}</div>
                  {o.desc && <div style={{ fontSize:12, color:"#64748b", marginTop:1 }}>{o.desc}</div>}
                </div>
                <span style={{ color:"#cbd5e1", flexShrink:0 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TERMINAL NODE */}
      {node?.terminal && (
        <div>
          <h2 style={{ fontSize:19, fontWeight:700, color:"#1e293b", margin:"0 0 6px" }}>{node.title}</h2>
          {node.description && <p style={{ fontSize:13, color:"#374151", lineHeight:1.6, margin:"0 0 12px" }}>{node.description}</p>}
          {node.pipeline && (
            <div style={{ background:"#d1fae5", border:"1px solid #059669", borderRadius:8, padding:"8px 12px", marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#059669" }}>PIPELINE</div>
              <div style={{ fontSize:13, fontFamily:"monospace", color:"#064e3b" }}>{node.pipeline}</div>
            </div>
          )}

          {/* Hosted tools */}
          {node.hosted?.length > 0 && (
            <div style={{ marginBottom:14 }}>
              <h3 style={{ fontSize:11, fontWeight:700, color:"#94a3b8", margin:"0 0 6px", textTransform:"uppercase", letterSpacing:"0.06em" }}>🌐 Ready-to-use tools</h3>
              {node.hosted.map((t,i) => renderTool(t, i, "hosted"))}
            </div>
          )}

          {/* DIY */}
          {node.diy?.length > 0 && (
            <div style={{ marginBottom:14 }}>
              <h3 style={{ fontSize:11, fontWeight:700, color:"#94a3b8", margin:"0 0 6px", textTransform:"uppercase", letterSpacing:"0.06em" }}>🔧 Build your own</h3>
              {node.diy.map((t,i) => renderTool(t, i, "diy"))}
            </div>
          )}

          {node.dataNeeded && (
            <div style={{ background:"#fef3c7", border:"1px solid #d97706", borderRadius:8, padding:"10px 14px", marginTop:10, marginBottom:8 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#92400e", marginBottom:2 }}>📋 DATA YOU'LL NEED</div>
              <div style={{ fontSize:12, color:"#374151", lineHeight:1.5 }}>{node.dataNeeded}</div>
            </div>
          )}
          {node.clinicConnection && (
            <div style={{ background:"#ede9fe", border:"1px solid #7c3aed", borderRadius:8, padding:"10px 14px", marginBottom:8 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#5b21b6", marginBottom:2 }}>🔗 CLINIC 1 CONNECTION</div>
              <div style={{ fontSize:12, color:"#374151", lineHeight:1.5 }}>{node.clinicConnection}</div>
            </div>
          )}
          {node.note && (
            <div style={{ background:"#fef2f2", border:"1px solid #ef4444", borderRadius:8, padding:"10px 14px", marginBottom:8 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#b91c1c", marginBottom:2 }}>⚠️ NOTE</div>
              <div style={{ fontSize:12, color:"#374151", lineHeight:1.5 }}>{node.note}</div>
            </div>
          )}
        </div>
      )}

      <div style={{ textAlign:"center", marginTop:24, paddingTop:10, borderTop:"1px solid #e2e8f0", fontSize:11, color:"#94a3b8" }}>
        AI Clinic Series
      </div>
    </div>
  );
}
