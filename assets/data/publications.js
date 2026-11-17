// Publications — hand-editable. kind: book | article | chapter | working | progress
window.PUBS = [
  // Books
  { kind: "book", year: 2026, title: "August Lösch: Briefe / Letters, 1926–1945",
    note: "Edited scholarly edition, 1,074 pp., 450 letters with critical apparatus, indices and genealogies. Beiträge zur Geschichte der deutschsprachigen Ökonomie.",
    venue: "Marburg: Metropolis Verlag", selected: true,
    url: "https://www.metropolis-verlag.de/August-Loesch---Briefe--Letters/1628/book.do" },

  // Peer-reviewed articles
  { kind: "article", year: 2023, title: "National expenditures on local amenities", authors: "with Nicolai V. Kuminoff and Jaren C. Pope",
    venue: "Journal of Environmental Economics and Management, 117", selected: true,
    url: "https://doi.org/10.1016/j.jeem.2022.102726" },
  { kind: "article", year: 2024, title: "Schumpeter's Gesetz and Gestalt in space: exploring evolutionary economic geographies of money and finance",
    venue: "Cambridge Journal of Regions, Economy and Society", selected: true,
    url: "https://econpapers.repec.org/RAS/pbi53.htm" },
  { kind: "article", year: 2017, title: "Managing “cataclysmic money”: how financial regulation matters for the future of U.S. housing policy",
    venue: "Housing Policy Debate, 27(3), 476–482", url: "https://doi.org/10.1080/10511482.2016.1273252" },
  { kind: "article", year: 2015, title: "Crowdfunding the city: the end of ‘cataclysmic money’?",
    venue: "Environment and Planning A, 47(12), 2429–2435", selected: true, url: "https://doi.org/10.1177/0308518X15615369" },
  { kind: "article", year: 2013, title: "Are green cities nice places to live? On the link between sustainability and quality of life",
    venue: "Michigan Journal of Sustainability, 1(1), 44–73" },
  { kind: "article", year: 2013, title: "Form follows function: on the interaction between real estate finance and urban spatial structure",
    venue: "CriticalProductive, 2(1), 7–16", url: "https://ideas.repec.org/e/pbi53.html" },
  { kind: "article", year: 2010, title: "Booming Bohemia? Evidence from the U.S. high-technology industry",
    venue: "Industry & Innovation, 17(1), 23–48", url: "https://doi.org/10.1080/13662710903573844" },
  { kind: "article", year: 2009, title: "Financial stability, the Basel Process and the new geography of regulation",
    venue: "Cambridge Journal of Regions, Economy and Society, 2(2), 303–331", selected: true, url: "https://doi.org/10.1093/cjres/rsp007" },

  // Chapters and invited contributions
  { kind: "chapter", year: 2017, title: "Back to the future: Lösch, Isard, and the role of money and credit in the space-economy",
    venue: "In R. Jackson and P. Schaeffer (eds.), Regional Research Frontiers, vol. 1. Cham: Springer" },
  { kind: "chapter", year: 2017, title: "Conceptualizing financial resilience: the challenges for urban theory",
    venue: "In J. Bohland, D. Brosnan and J. Harrald (eds.), The Resilience Challenge. Springfield, IL: Charles C. Thomas",
    url: "https://ssrn.com/abstract=2709820" },
  { kind: "chapter", year: 2014, title: "Regional structure and economic development: growth empirics for U.S. metropolitan areas",
    venue: "In P. Schaeffer and E. Kouassi (eds.), Econometric Methods for Analyzing Economic Development. Hershey, PA: IGI Global" },
  { kind: "chapter", year: 2011, title: "The restless landscape of metroburbia", authors: "with Elisabeth Chaves and Paul Knox",
    venue: "In N. A. Phelps and F. Wu (eds.), International Perspectives on Suburbanization: A Post-Suburban World? Basingstoke: Palgrave Macmillan" },

  // Working papers
  { kind: "working", year: 2014, title: "Moonlights, sunspots and frontier finance: on the nexus between money, credit and urban form",
    venue: "Political Space Economy Lab working paper, 135 pp.", url: "https://ssrn.com/abstract=2392673" },
  { kind: "working", year: 2007, title: "The transformation problem: a tale of two interpretations",
    venue: "MPRA Paper 3895", url: "https://mpra.ub.uni-muenchen.de/3895/" },
  { kind: "working", year: 2006, title: "Picking a winner? Evidence from the non-manufacturing high-tech industry in the Blacksburg MSA",
    venue: "MPRA Paper", url: "https://econpapers.repec.org/RAS/pbi53.htm" },
  { kind: "working", year: 2004, title: "The Basel Process and financial stability",
    venue: "Macroeconomics 0412001, EconWPA", url: "https://econpapers.repec.org/RAS/pbi53.htm" },
  { kind: "working", year: 2004, title: "Riding the yield curve: diversification of strategies", authors: "with Ludwig B. Chincarini",
    venue: "Finance 0410002, EconWPA", url: "https://econpapers.repec.org/RAS/pbi53.htm" },

  // In progress
  { kind: "progress", year: 2026, title: "Regions, regulation, and the ‘carriers of history’: how financial lock-in transformed the American South twice",
    venue: "Revise and resubmit, Cambridge Journal of Regions, Economy and Society" },
  { kind: "progress", year: 2026, title: "The GSE reform trilemma: architectural power, institutional complementarities and the temporal trap",
    venue: "Manuscript with agent-based simulations, prepared for Socio-Economic Review" },
  { kind: "progress", year: 2026, title: "The Credibility of Place: Causal Inference and Spatial Econometrics",
    venue: "Graduate methods textbook in preparation; bilingual R/Python, open-access companion at circular-flows.org" },
  { kind: "progress", year: 2026, title: "From the New South to the New Europe: German Konjunkturforschung and the making of American regionalism",
    venue: "Sabbatical book project, 2026–27" }
];
window.KIND_LABELS = { book: "Books", article: "Peer-reviewed articles", chapter: "Book chapters", working: "Working papers", progress: "In progress" };
