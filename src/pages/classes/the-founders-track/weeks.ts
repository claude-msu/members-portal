/**
 * A single line of education history on the persona's profile.
 */
export interface Education {
    school: string;
    degree: string;
    years: string;
}

/**
 * A single role in the persona's work history.
 */
export interface Experience {
    company: string;
    role: string;
    years: string;
    description: string;
}

/**
 * A notable investment, acquisition, or deal the persona has been involved with.
 */
export interface PortfolioEntry {
    company: string;
    stage: string;
    note: string;
}

/**
 * A single LinkedIn-style stat card — clean numbers, no interpretation.
 */
export interface Stat {
    label: string;
    value: string;
}

/**
 * A fully simulated LinkedIn-style investor profile.
 *
 * There are no explicit "thesis", "red flags", or "questions" fields.
 * Everything a student needs to understand this person is embedded in
 * the about section, experience descriptions, and portfolio notes.
 * Students are expected to read carefully, pick up on characteristics,
 * and adapt — that is the point of the exercise.
 */
export interface Persona {
    name: string;
    title: string;
    company: string;
    location: string;
    /** Rich bio paragraph. Nickname, investing philosophy, and personality all live here — unlabeled. */
    about: string;
    education: Education[];
    experience: Experience[];
    portfolio: PortfolioEntry[];
    stats: Stat[];
}

/**
 * Full week configuration for The Founder's Track.
 *
 * CURRENT is the active persona live this week.
 * QUEUED is the next persona — shown in preview mode before the swap.
 * Swap manually every Thursday before coworking.
 */
export interface WeekConfig {
    number: number;
    title: string;
    persona: Persona;
}

// ─── Week 1 ───────────────────────────────────────────────────────────────────

const WEEK1: WeekConfig = {
    number: 1,
    title: 'Week 1',
    persona: {
        name: 'Orion Voss',
        title: 'General Partner',
        company: 'Apex Horizon Capital',
        location: 'San Francisco, CA',
        about: `Orion Voss — known in early VC circles as "Orbital Orion" for his habit of zooming so far out of a conversation that founders forget what product they were pitching — left a philosophy PhD at Oxford in 2007 to join a seed fund and has never looked back. He has backed three companies that are now household names and a dozen more that most people have never heard of, because they were simply too early for the world they were building toward. He does not consider this a failure. His office has a single quote on the wall, from Buckminster Fuller, and he genuinely means it.

Orion does not invest in products. He has said this so many times it has become something of a catchphrase among his portfolio founders. What he invests in is harder to define — he once described it in an interview as "the specific gravity of someone's conviction," which his colleagues found either profound or insufferable depending on who you ask. He has passed on companies that went on to massive outcomes and he is at peace with every single one of those decisions, because in each case he did not feel what he was looking for in the room.

He reads every application himself. He does not use analysts. He will know your background before you say a word.`,
        education: [
            {
                school: 'University of Oxford',
                degree: 'DPhil Philosophy (incomplete)',
                years: '2005 – 2007',
            },
            {
                school: 'Yale University',
                degree: 'BA Philosophy & Mathematics',
                years: '2001 – 2005',
            },
        ],
        experience: [
            {
                company: 'Apex Horizon Capital',
                role: 'General Partner',
                years: '2014 – Present',
                description:
                    'Leads pre-seed and seed investments across Apex Horizon\'s $340M third fund. Sole decision-maker on all investments under $3M. Known for writing the longest partner memos in the firm and the shortest term sheets.',
            },
            {
                company: 'Threshold Ventures',
                role: 'Principal',
                years: '2010 – 2014',
                description:
                    'Sourced and led 11 investments over four years. Three went on to unicorn valuations. Left after a disagreement with the managing partner about whether a company\'s TAM justified the check size — Orion thought the TAM question was the wrong question entirely.',
            },
            {
                company: 'Kleiner Perkins',
                role: 'Analyst',
                years: '2008 – 2010',
                description:
                    'Entry-level role during the early mobile era. Spent two years watching partners make decisions and became convinced that the best investments had nothing to do with the spreadsheet in the room.',
            },
            {
                company: 'Independent Writing & Research',
                role: 'Self-directed Study',
                years: '2007 – 2008',
                description:
                    'Spent a year deliberately outside any institution after leaving Oxford. Wrote a paper on the philosophical conditions under which a technology becomes culturally irreversible. Applied to Kleiner Perkins on a Tuesday. He has described this period as something he cannot fully explain to anyone with a conventional career arc, which is most people.',
            },
        ],
        portfolio: [
            {
                company: 'Aether Labs',
                stage: 'Pre-seed, 2015',
                note: 'Backed when the founder had a whiteboard and a conviction that ambient computing would replace the smartphone. Most people in the room thought it was too early. It was.',
            },
            {
                company: 'Commonground',
                stage: 'Seed, 2017',
                note: 'Community infrastructure for distributed organizations. Orion wrote the first check the week after a 45-minute conversation in which the founder never once mentioned a feature — only the world she was trying to create.',
            },
            {
                company: 'Solace Health',
                stage: 'Seed, 2019',
                note: 'Mental health infrastructure for underserved communities. Passed on three better-capitalized competitors in the same space the same year. His notes from the decision read: "wrong missionaries."',
            },
            {
                company: 'Fieldwork AI',
                stage: 'Pre-seed, 2022',
                note: 'Agricultural intelligence platform. The founder came in having never pitched before. Orion made the decision before the meeting ended.',
            },
            {
                company: 'Common Room',
                stage: 'Seed, 2024',
                note: 'Creative collaboration platform for working artists and independent studios. The founder had no technical background. She arrived with a hand-drawn diagram of every way a creative project typically dies before it is finished. Orion asked if she had considered making it a poster.',
            },
        ],
        stats: [
            { label: 'Fund Size (Fund III)', value: '$340M' },
            { label: 'Portfolio Companies', value: '47' },
            { label: 'Unicorn Exits', value: '3' },
            { label: 'Median First Check', value: '$1.2M' },
            { label: 'Avg. Entry Valuation', value: '$8M' },
            { label: 'Years Investing', value: '17' },
        ],
    },
};

// ─── Week 2 ───────────────────────────────────────────────────────────────────

const WEEK2: WeekConfig = {
    number: 2,
    title: 'Week 2',
    persona: {
        name: 'Hector Payne',
        title: 'Operating Partner',
        company: 'Groundwork Ventures',
        location: 'Chicago, IL',
        about: `People who have sat across from Hector Payne in a pitch meeting tend to describe the experience the same way: they walked in thinking they were prepared, and walked out with a list of things they had never thought about. His portfolio founders call him "Hardboiled Hector" — a nickname he neither encourages nor disputes — because he has a way of asking questions that sound simple until you realize you do not have the answer.

Hector spent 11 years building a logistics company from three people in a garage to 400 across six cities before selling it for $190M. He has hired people who did not work out, managed a payroll crisis in year six, lost a warehouse to a fire in year four, and rebuilt each time. He now runs the operating partner practice at Groundwork Ventures, where the fund's stated policy is that at least one founder must have shipped something real before they will write a check. This was Hector's idea.

He is not interested in your vision. He has said publicly that he leaves the vision conversations to his partners. What he wants to know is whether the scaffolding underneath the vision can hold any weight — and he will find out within the first ten minutes whether it can.`,
        education: [
            {
                school: 'Purdue University',
                degree: 'BS Industrial Engineering',
                years: '1998 – 2002',
            },
        ],
        experience: [
            {
                company: 'Groundwork Ventures',
                role: 'Operating Partner',
                years: '2019 – Present',
                description:
                    'Works directly with portfolio companies on hiring plans, operational infrastructure, and crisis response. Has a personal rule he applies to every first meeting: no more than two slides before he asks to see the actual product or talk to someone who has used it.',
            },
            {
                company: 'MoveGrid Logistics',
                role: 'CEO & Co-founder',
                years: '2008 – 2019',
                description:
                    'Built from zero to $38M ARR across six cities. Managed 400 employees at peak. Survived a payroll crisis (year 6), a warehouse fire (year 4), and two near-acquisitions that fell through at term sheet. Sold in 2019. Has a handwritten list on his desk of every operational mistake he made and what it cost.',
            },
            {
                company: 'UPS Supply Chain Solutions',
                role: 'Operations Manager, Midwest Region',
                years: '2003 – 2008',
                description:
                    'Managed regional logistics infrastructure for the Midwest. Left after five years when he realized he was getting very good at optimizing a broken system instead of building a better one.',
            },
            {
                company: 'Kellner Industries',
                role: 'Plant Operations Analyst',
                years: '2002 – 2003',
                description:
                    'First job out of Purdue. Worked on the floor of a mid-sized manufacturing plant tracking assembly throughput and defect rates by hand. A supervisor told him after six months that he asked too many questions about why the system was built the way it was instead of just running it better. He considered this accurate and left for UPS the following year.',
            },
        ],
        portfolio: [
            {
                company: 'Stackform',
                stage: 'Seed, 2020',
                note: 'Construction project management software. Hector backed it after the founder walked him through exactly what breaks in their system at 3x load. He later said it was the most honest answer he had heard in a pitch meeting in years.',
            },
            {
                company: 'Relay Ops',
                stage: 'Series A, 2021',
                note: 'Workforce scheduling for distributed teams. First meeting lasted three hours. Hector spent two of them asking about the hiring plan for the first ten employees.',
            },
            {
                company: 'Coldchain Co.',
                stage: 'Seed, 2022',
                note: 'Temperature-controlled logistics for pharmaceuticals. Passed on two better-funded competitors. His note: "they know what breaks first."',
            },
            {
                company: 'ShiftBridge',
                stage: 'Seed, 2023',
                note: 'Labor scheduling for food service and hospitality operators. The founder had spent fifteen years managing restaurant groups before writing a line of code. Hector asked him to describe the worst shift he ever had to cover on short notice. The founder answered for eleven minutes without stopping.',
            },
        ],
        stats: [
            { label: 'Companies Built & Exited', value: '1 ($190M)' },
            { label: 'Portfolio Boards', value: '9' },
            { label: 'Peak Team Size Led', value: '400' },
            { label: 'Years Operating Before Investing', value: '17' },
            { label: 'Check Size Range', value: '$500K – $2M' },
            { label: 'Avg. Hold Period', value: '4.2 years' },
        ],
    },
};

// ─── Week 3 ───────────────────────────────────────────────────────────────────

const WEEK3: WeekConfig = {
    number: 3,
    title: 'Week 3',
    persona: {
        name: 'Pythia Stone',
        title: 'Managing Director',
        company: 'Axiom Capital Partners',
        location: 'New York, NY',
        about: `Pythia Stone studied applied mathematics at MIT, spent six years running volatility models at a quantitative hedge fund, and then joined Axiom Capital Partners, where she now leads their data-driven early-stage practice with $600M under management. Her colleagues at Axiom call her "Precise Pythia" — always behind her back, never to her face — because she has a reputation for finding the number inside a pitch that does not survive contact with a spreadsheet, and then asking about that number specifically.

She has passed on four companies that her partners wanted to fund. Two of them later failed for exactly the reasons she flagged in her diligence notes. She does not bring this up herself, but she does not discourage others from bringing it up either.

Pythia is not cold. She will tell you this herself if you ask. There is a difference, she says, between being cold and being precise — and she has found that founders who cannot tell the difference tend to also have difficulty with their unit economics. She has described exactly two things in her career as exciting: a particularly elegant market sizing methodology she encountered in 2018, and her daughter's first sentence.`,
        education: [
            {
                school: 'MIT',
                degree: 'BS Applied Mathematics',
                years: '1999 – 2003',
            },
            {
                school: 'University of Chicago',
                degree: 'MS Financial Mathematics',
                years: '2003 – 2004',
            },
        ],
        experience: [
            {
                company: 'Axiom Capital Partners',
                role: 'Managing Director',
                years: '2016 – Present',
                description:
                    'Leads quantitative diligence and portfolio modeling across $600M AUM. Built the proprietary financial scoring model now used across all of Axiom\'s investments. Has final approval authority on any check where the unit economics do not meet the firm\'s threshold — a threshold she wrote.',
            },
            {
                company: 'Meridian Quant Fund',
                role: 'Senior Analyst',
                years: '2010 – 2016',
                description:
                    'Built volatility and correlation models for emerging market fixed income. Developed a framework for detecting narrative-driven overvaluations that she later adapted — almost unchanged — for evaluating startup pitches.',
            },
            {
                company: 'Goldman Sachs',
                role: 'Analyst, Structured Products',
                years: '2004 – 2010',
                description:
                    'Six years pricing instruments that most people in the building could not explain. Left because she wanted to work on things that did not yet exist. Still thinks about the counterparty risk frameworks she built there more often than she expected to.',
            },
        ],
        portfolio: [
            {
                company: 'Clausewright',
                stage: 'Seed, 2017',
                note: 'Contract intelligence platform using NLP to extract, flag, and compare clause-level risk across legal documents at scale. The founder produced a bottom-up TAM from memory in the meeting. Pythia asked to see the model\'s error rate distribution before the second meeting.',
            },
            {
                company: 'Aleph Systems',
                stage: 'Series A, 2019',
                note: 'Probabilistic demand forecasting for mid-market manufacturers, using ensemble models trained on proprietary supply chain signals. Passed on four similar companies the same year. Her diligence notes on each end with the same line: "no model validation framework, top-down TAM only."',
            },
            {
                company: 'Vanta ML',
                stage: 'Seed, 2021',
                note: 'Model evaluation and regression testing infrastructure for teams running ML in production. The founder had a live dashboard showing drift metrics across six enterprise customers during the pitch, updated in real time. Pythia asked to see it a second time before leaving the room.',
            },
            {
                company: 'Keystone Data',
                stage: 'Pre-seed, 2023',
                note: 'Data lineage and observability tooling for enterprise pipelines, built by a team with backgrounds in quantitative risk management. Pythia had read the founding CTO\'s two published papers on data quality measurement before the first call.',
            },
        ],
        stats: [
            { label: 'AUM', value: '$600M' },
            { label: 'Portfolio Companies', value: '31' },
            { label: 'Average Net IRR', value: '34%' },
            { label: 'Deals Killed on Unit Economics', value: '4' },
            { label: 'Check Size Range', value: '$2M – $8M' },
            { label: 'Years in Quantitative Finance', value: '12' },
        ],
    },
};

// ─── Week 4 ───────────────────────────────────────────────────────────────────

const WEEK4: WeekConfig = {
    number: 4,
    title: 'Week 4',
    persona: {
        name: 'Agatha Rowe',
        title: 'Founding Partner',
        company: 'Human First Fund',
        location: 'Austin, TX',
        about: `Before anyone called it UX research, Agatha Rowe was sitting in people's kitchens watching them struggle with technology and writing down everything they said. She spent a decade at IDEO and Nielsen Norman as an ethnographic researcher before founding Human First Fund in 2015 on a premise she has never wavered from: every startup that has ever failed did so because somebody, at some point, stopped listening to a real person.

Her portfolio founders know her as "Attentive Agatha" — a nickname that sounds like a compliment and is also a warning. She listens to everything. She notices the moment a founder switches from describing a specific person they spoke with to describing a demographic. She has conducted over 3,000 user interviews in her career and she can hear the difference in about thirty seconds.

Human First Fund requires a minimum of twenty documented user conversations before Agatha will consider writing a check. Not surveys. Not analytics dashboards. Conversations, with names attached. She has been asked whether this is an unusually high bar. She says it is the lowest bar she could justify.`,
        education: [
            {
                school: 'University of Michigan',
                degree: 'BA Anthropology & Sociology',
                years: '1995 – 1999',
            },
            {
                school: 'Stanford University',
                degree: 'MA Human-Computer Interaction',
                years: '2000 – 2002',
            },
        ],
        experience: [
            {
                company: 'Human First Fund',
                role: 'Founding Partner',
                years: '2015 – Present',
                description:
                    'Leads a $120M early-stage fund with a single constraint: founders must demonstrate genuine, documented user insight before a term sheet is issued. Has personally conducted follow-up user interviews on behalf of portfolio companies after investment. Three of her portfolio companies have cited her post-investment research as the insight that changed their product direction.',
            },
            {
                company: 'IDEO',
                role: 'Senior Design Researcher',
                years: '2008 – 2015',
                description:
                    'Led ethnographic research for Fortune 500 clients across healthcare, financial services, and consumer products. Pioneered a "day-in-the-life" research method that required researchers to spend a full working day with subjects before conducting a single formal interview. The method is still used across the firm.',
            },
            {
                company: 'Nielsen Norman Group',
                role: 'UX Researcher',
                years: '2002 – 2008',
                description:
                    'Conducted usability studies and field research for enterprise software clients. Developed a personal conviction during this period that the most valuable product insights come from watching someone fail to use something, not succeed — a belief that has shaped every investment she has made since.',
            },
        ],
        portfolio: [
            {
                company: 'Caretaker',
                stage: 'Pre-seed, 2016',
                note: 'Home care coordination for aging parents. Agatha backed the founder after she described a specific woman named Carol, 71, from Lansing, and what happened when Carol tried to use the app for the first time. Agatha later met Carol.',
            },
            {
                company: 'Loopback',
                stage: 'Seed, 2018',
                note: 'Customer feedback infrastructure for SMBs. The founder had spoken with 47 customers before the first pitch meeting. Agatha asked for the notes from all 47 conversations. She read all of them.',
            },
            {
                company: 'Nearground',
                stage: 'Seed, 2021',
                note: 'Hyperlocal community platform. Passed on two similar companies in the same year. Her notes: "no named users in either pitch — personas only."',
            },
            {
                company: 'Anchor',
                stage: 'Seed, 2022',
                note: 'Peer support communities for people navigating major life transitions — job loss, illness, relocation, divorce. Agatha had conducted field interviews with 19 members before the round closed. The founder was not aware she had done this until the term sheet arrived.',
            },
            {
                company: 'Tender Table',
                stage: 'Pre-seed, 2023',
                note: 'Community-led meal sharing for isolated older adults in mid-sized cities. The founder had no technical background and had been running a neighborhood dinner program for three years before building any software around it. Agatha required no additional user evidence.',
            },
        ],
        stats: [
            { label: 'Fund Size', value: '$120M' },
            { label: 'User Interviews Conducted', value: '3,000+' },
            { label: 'Portfolio Companies', value: '22' },
            { label: 'Min. User Conversations to Invest', value: '20 documented' },
            { label: 'Avg. First Check', value: '$800K' },
            { label: 'Post-Investment Research Projects', value: '3' },
        ],
    },
};

// ─── Week 5 ───────────────────────────────────────────────────────────────────

const WEEK5: WeekConfig = {
    number: 5,
    title: 'Week 5',
    persona: {
        name: 'Eris Kane',
        title: 'Managing Partner',
        company: 'Dissonance Ventures',
        location: 'New York, NY',
        about: `Eris Kane has built her reputation by doing two things that most investors avoid: passing on companies everyone else was fighting over, and funding companies everyone else thought were stupid, too early, or already dead. She runs Dissonance Ventures on a thesis that she summarizes in a single question she asks herself before every investment decision — a question she has never published and does not share with founders, though many of her portfolio companies have tried to guess it.

Her partners and founders refer to her as "Electric Eris," a nickname that emerged from her habit of staying completely still and completely silent in a room while asking questions that feel like they have a current running through them. She does not raise her voice. She does not show frustration. She simply waits for the answer and, if the answer does not satisfy her, asks again from a different angle.

She is not contrarian for sport. She has said this in every profile ever written about her. What she believes — and has believed since her years at Andreessen Horowitz, where she was known internally as the partner who asked the questions nobody else wanted to ask — is that the most durable companies are the ones that have already survived the hardest version of every question about them. She considers it a service to founders to deliver those questions before the market does.`,
        education: [
            {
                school: 'Columbia University',
                degree: 'BA Economics & Philosophy',
                years: '1997 – 2001',
            },
            {
                school: 'London School of Economics',
                degree: 'MSc Behavioural Economics',
                years: '2001 – 2002',
            },
        ],
        experience: [
            {
                company: 'Dissonance Ventures',
                role: 'Managing Partner',
                years: '2013 – Present',
                description:
                    'Runs a $280M growth fund with a thesis built around consensus-bucking investments. Has made 6 major investments in companies that every other firm passed on in the same round. Four of the six have outperformed the fund average. Keeps the two that did not on a printed sheet in her top drawer.',
            },
            {
                company: 'Andreessen Horowitz',
                role: 'Partner',
                years: '2008 – 2013',
                description:
                    'Led investments in B2B SaaS and infrastructure. Known internally for being the last voice in any investment committee discussion — not because she was least important, but because she preferred to hear everyone else\'s conviction before testing it. Left to start her own fund when she realized the questions she wanted to ask required her own capital.',
            },
            {
                company: 'Morgan Stanley',
                role: 'Associate, Technology Investment Banking',
                years: '2002 – 2008',
                description:
                    'Covered enterprise software and internet infrastructure. Resigned after advising on a deal she had publicly characterized as overvalued by 40%. She was asked to leave six months later. The company in question filed for bankruptcy protection in 2011.',
            },
        ],
        portfolio: [
            {
                company: 'Bastion',
                stage: 'Seed, 2014',
                note: 'Zero-trust network access infrastructure for enterprise teams. Every major firm in the round passed. Eris\'s investment memo was one paragraph on why the consensus was wrong and three pages on why the founder would not stop.',
            },
            {
                company: 'Driftwood',
                stage: 'Series A, 2017',
                note: 'Cloud cost observability and rightsizing for engineering organizations. Dismissed as too niche and too unsexy by every firm that passed. Eris led the round on the argument that within three years every engineering team would have this problem and almost none of them would know how to solve it.',
            },
            {
                company: 'Pulsar',
                stage: 'Seed, 2020',
                note: 'Event streaming infrastructure for regulated industries. Three investors cited incumbent lock-in. Eris backed it after the founder spent twenty minutes explaining, without defensiveness, exactly why the incumbents would win in the short term and lose in the long one.',
            },
            {
                company: 'Gatekeeper',
                stage: 'Pre-seed, 2021',
                note: 'Secrets management and automated credential rotation for engineering teams. The category had three well-funded incumbents. Her internal note: "none of them are run by someone who has been paged at 2am about a rotated secret breaking production."',
            },
            {
                company: 'Logframe',
                stage: 'Seed, 2023',
                note: 'Distributed tracing and observability for microservice architectures. The founding team had a combined forty years at infrastructure companies most people outside engineering departments had never heard of. Consensus said the market was too crowded. Eris said it was insufficiently solved.',
            },
        ],
        stats: [
            { label: 'Fund Size', value: '$280M' },
            { label: 'Consensus-Bucking Investments', value: '6 major' },
            { label: 'Outperformers vs. Fund Average', value: '4 of 6' },
            { label: 'Average Check Size', value: '$4M' },
            { label: 'Years Investing', value: '17' },
            { label: 'Investment Committees Dissented In', value: 'Won\'t say' },
        ],
    },
};

// ─── Week 6 ───────────────────────────────────────────────────────────────────

const WEEK6: WeekConfig = {
    number: 6,
    title: 'Week 6',
    persona: {
        name: 'Dorian Foss',
        title: 'VP Corporate Development',
        company: 'Meridian Systems',
        location: 'Seattle, WA',
        about: `Dorian Foss is not a venture investor. This is the first thing he will tell you, and also the thing most founders forget halfway through a conversation with him. He runs Corporate Development at Meridian Systems, a $44B enterprise software company, and he has closed 14 acquisitions in eight years — ranging from $8M acqui-hires to a $1.2B platform deal in 2022. He has been called "Deal-Making Dorian" by colleagues and counterparties for long enough that he has stopped reacting to it.

He approaches founder conversations with a warmth and curiosity that can take a while to recognize for what it is: a very organized form of intelligence gathering. He is genuinely interested in what you are building. He is also, simultaneously, evaluating whether you are worth buying, worth partnering with, or worth watching until you grow large enough to become a problem. He will not tell you which of the three he is doing. Sometimes it is all three at once.

He has a habit — noted by several founders who have dealt with him — of mentioning, casually and without apparent malice, that Meridian could probably build what you are building internally in a quarter. He then watches what happens to the room.`,
        education: [
            {
                school: 'Georgetown University',
                degree: 'BA International Business',
                years: '1996 – 2000',
            },
            {
                school: 'Harvard Business School',
                degree: 'MBA',
                years: '2004 – 2006',
            },
        ],
        experience: [
            {
                company: 'Meridian Systems',
                role: 'VP Corporate Development',
                years: '2016 – Present',
                description:
                    'Leads all M&A and strategic partnership activity for a $44B enterprise software company. Manages a team of 12 across strategy, diligence, and integration. Responsible for the build-vs-buy framework now used across all of Meridian\'s product lines. Closed the largest acquisition in company history in 2022.',
            },
            {
                company: 'Salesforce',
                role: 'Director, Corporate Development',
                years: '2010 – 2016',
                description:
                    'Worked on 7 acquisitions, two of which became core Salesforce product lines still in use today. Built a proprietary framework for evaluating whether a startup\'s value lives in the product, the data, the team, or the customer relationships — a distinction he considers the most important question in any acquisition.',
            },
            {
                company: 'McKinsey & Company',
                role: 'Associate, Technology Practice',
                years: '2006 – 2010',
                description:
                    'Advised Fortune 100 technology companies on M&A strategy and competitive positioning. Left after four years because he wanted to close deals, not advise on them. Has not regretted it.',
            },
        ],
        portfolio: [
            {
                company: 'Threadline (acquired)',
                stage: 'Acqui-hire, 2018 — $22M',
                note: 'Workflow automation tooling. Dorian identified the team as the asset eighteen months before the acquisition. Maintained a quarterly check-in with the founder for the entire period.',
            },
            {
                company: 'Axon Data (acquired)',
                stage: 'Strategic acquisition, 2020 — $180M',
                note: 'Enterprise data lineage platform. The founder had a clear answer to why their data moat could not be replicated. Dorian later said it was the best answer to that question he had ever heard.',
            },
            {
                company: 'Cartograph (strategic partnership)',
                stage: 'Partnership, 2023',
                note: 'Geospatial analytics for enterprise logistics. Not acquired — yet. Dorian has a standing quarterly call with the CEO.',
            },
        ],
        stats: [
            { label: 'Acquisitions Closed', value: '14' },
            { label: 'Largest Deal', value: '$1.2B' },
            { label: 'Smallest Deal', value: '$8M' },
            { label: 'Parent Company Valuation', value: '$44B' },
            { label: 'Avg. Integration Timeline', value: '9 months' },
            { label: 'Active Strategic Partnerships', value: '31' },
        ],
    },
};

// ─── Week 7 ───────────────────────────────────────────────────────────────────

const WEEK7: WeekConfig = {
    number: 7,
    title: 'Week 7',
    persona: {
        name: 'Cass Morin',
        title: 'General Partner',
        company: 'Watchdog Partners',
        location: 'Washington, D.C.',
        about: `Before she was an investor, Cass Morin was the person founders feared. She spent twelve years as an investigative technology journalist — first at ProPublica, then at The Atlantic and Wired — writing about the gap between what technology companies said they were doing and what they were actually doing. She won two National Magazine Awards. Three of her major investigative pieces preceded the collapse of the companies they covered. She does not consider this a coincidence.

She pivoted to Watchdog Partners in 2018, a fund that specializes in companies operating in regulated, controversial, or ethically complex spaces — fintech, health, AI, data infrastructure. Her portfolio founders refer to her as "Cynical Cass," a nickname she finds slightly inaccurate. She would describe herself not as cynical but as prepared. Every company she backs goes through what she calls a red team session before the term sheet is signed: a conversation in which she brings the three strongest arguments against the company's existence and asks the founders to defeat them. Founders who have been through it describe the experience as either the most useful meeting they have ever had or the most uncomfortable one.

She reads the trades in your industry every morning. She will know things about your space that you did not expect her to know.`,
        education: [
            {
                school: 'Northwestern University',
                degree: 'BA Journalism & Political Science',
                years: '1999 – 2003',
            },
            {
                school: 'Columbia University',
                degree: 'MS Investigative Journalism',
                years: '2003 – 2004',
            },
        ],
        experience: [
            {
                company: 'Watchdog Partners',
                role: 'General Partner',
                years: '2018 – Present',
                description:
                    'Leads a $95M fund investing in companies operating in regulated and ethically complex spaces. Requires a red team session with every founder before issuing a term sheet. Nine of eighteen portfolio companies have navigated a major regulatory or public scrutiny event without material damage to the business.',
            },
            {
                company: 'The Atlantic / Wired',
                role: 'Senior Investigative Correspondent',
                years: '2010 – 2018',
                description:
                    'Covered technology, surveillance, and corporate accountability. Wrote three major investigative pieces that preceded startup failures. Won two National Magazine Awards. Left journalism when she concluded she was more useful helping companies avoid the problems she had spent a decade reporting on.',
            },
            {
                company: 'ProPublica',
                role: 'Staff Reporter',
                years: '2004 – 2010',
                description:
                    'Early career in data journalism and public records work. Developed a research methodology built around finding the document, person, or number that a subject hoped would not be found. Uses a version of this methodology in diligence to this day.',
            },
        ],
        portfolio: [
            {
                company: 'Meridian Health AI',
                stage: 'Seed, 2019',
                note: 'Clinical decision support for emergency departments. The founders arrived at the red team session with a 12-page document they had written themselves, anticipating every regulatory and ethical risk Cass raised before she raised it. She signed the term sheet the same day.',
            },
            {
                company: 'Veritas ID',
                stage: 'Series A, 2021',
                note: 'Digital identity verification for financial services. Passed on two similar companies that year. Her notes on both: "founders had not considered the misuse case."',
            },
            {
                company: 'Solace Data',
                stage: 'Seed, 2022',
                note: 'Patient data infrastructure for clinical trials. The founder opened the meeting by describing the three things that could go wrong with their product and what they had already built to prevent each one. Cass later said it was the best first five minutes she had experienced in a pitch meeting.',
            },
        ],
        stats: [
            { label: 'Fund Size', value: '$95M' },
            { label: 'Portfolio Companies', value: '18' },
            { label: 'Regulatory Events Navigated (Portfolio)', value: '9 of 18' },
            { label: 'National Magazine Awards', value: '2' },
            { label: 'Investigative Pieces Published', value: '200+' },
            { label: 'Red Team Sessions Conducted', value: '18 (every investment)' },
        ],
    },
};

// ─── Week 8 ───────────────────────────────────────────────────────────────────

const WEEK8: WeekConfig = {
    number: 8,
    title: 'Week 8',
    persona: {
        name: 'Chiron Blake',
        title: 'Founding Partner',
        company: 'Pedigree Capital',
        location: 'Boston, MA',
        about: `Chiron Blake has been investing for twenty-two years. He has backed forty-seven companies. He keeps a handwritten list of every founder he has passed on who went on to build something significant — there are currently eleven names on it — and he reviews the list every quarter. He does not do this as punishment. He does it because he believes his only job is to identify people, not ideas, and the list is evidence of how hard that job actually is.

His fund, Pedigree Capital, operates on a thesis simple enough to fit on the back of a business card, which is where Chiron has been known to write it when meeting founders for the first time. His portfolio founders call him "Champion Chiron" — not because he is easy on them, but because the founders he backs tend to describe him as the person who believed in them before anyone else did, including sometimes themselves.

He is the quietest person in most rooms he enters. He listens in a way that most people find either deeply comfortable or slightly unnerving, sometimes both. He does not interrupt. He does not fill silences. He asks questions that sound simple — the kind a curious stranger might ask — and the answers tend to reveal more than the person answering expected to give. Several of his portfolio founders have described leaving their first meeting with Chiron feeling like he understood them better than people who had known them for years. They are not sure whether to be grateful or unsettled by this, and Chiron does not help them decide.`,
        education: [
            {
                school: 'Harvard University',
                degree: 'BA Psychology & Economics',
                years: '1993 – 1997',
            },
            {
                school: 'MIT Sloan',
                degree: 'MBA',
                years: '2000 – 2002',
            },
        ],
        experience: [
            {
                company: 'Pedigree Capital',
                role: 'Founding Partner',
                years: '2010 – Present',
                description:
                    'Runs a $220M fund with a single investment thesis he writes on the back of business cards and does not otherwise publish. Has backed 47 companies. Keeps the list of the ones he passed on who succeeded, reviews it quarterly, and has never removed a name from it.',
            },
            {
                company: 'Sequoia Capital',
                role: 'Partner',
                years: '2004 – 2010',
                description:
                    'Led early-stage investments in enterprise and consumer. Known for the longest partner meeting prep notes and the most personal due diligence process in the firm. Once spent six hours with a founder in a single conversation that covered their childhood, their first failure, and their theory of how people make decisions under pressure. Made the investment the next morning.',
            },
            {
                company: 'Matrix Partners',
                role: 'Associate',
                years: '2002 – 2004',
                description:
                    'First role after Sloan. Sourced deals, supported partners, and spent two years watching investment decisions get made. Concluded very quickly that the most interesting variable in any investment was never the idea.',
            },
            {
                company: 'Cambridge Associates',
                role: 'Research Analyst, Endowments Practice',
                years: '1997 – 2000',
                description:
                    'Three years studying investment manager selection and endowment portfolio construction. Found the work itself less interesting than the founders of investment firms he sometimes observed during due diligence — people who had chosen to build something rather than join something. Applied to MIT Sloan on the advice of one of them.',
            },
        ],
        portfolio: [
            {
                company: 'Ironframe',
                stage: 'Pre-seed, 2011',
                note: 'Construction technology. The founder had never pitched before. Chiron asked him one question at the end of the meeting: "What are you afraid of?" The founder answered honestly. Chiron called him that evening.',
            },
            {
                company: 'Lantern',
                stage: 'Seed, 2015',
                note: 'Grief support platform. Passed on four companies with better metrics in the same category. His note on each: "right market, wrong person."',
            },
            {
                company: 'Foundry',
                stage: 'Seed, 2019',
                note: 'Team operating system for early-stage startups. The co-founders came in having already worked through a serious disagreement about company direction — and could describe exactly how they resolved it, what each of them had been wrong about, and what they had learned. Chiron backed them the same week.',
            },
            {
                company: 'Meridian Studio',
                stage: 'Seed, 2021',
                note: 'Creative production tools for independent filmmakers. The founder\'s only credential was fifteen years making films almost nobody watched, which she described without embarrassment. Chiron asked what she had learned during those years that she could not have learned any other way. The answer took the rest of the meeting.',
            },
            {
                company: 'Passage',
                stage: 'Pre-seed, 2023',
                note: 'Grief and loss navigation platform. The founding team described the shutdown of their previous company in the pitch — not as a failure to get past, but as the event that made the current company necessary. Chiron called the lead founder the following morning.',
            },
        ],
        stats: [
            { label: 'Fund Size', value: '$220M' },
            { label: 'Total Investments', value: '47' },
            { label: 'Years Investing', value: '22' },
            { label: 'Passed-On Founders (Later Successful)', value: '11 (the list)' },
            { label: 'Average First Check', value: '$1.8M' },
            { label: 'Avg. Founder Relationship Length', value: '7.3 years' },
        ],
    },
};

// ─── Week 9 ───────────────────────────────────────────────────────────────────

const WEEK9: WeekConfig = {
    number: 9,
    title: 'Week 9',
    persona: {
        name: 'Maya Chen',
        title: 'Partner',
        company: 'Runway Capital',
        location: 'Austin, TX',
        about: `Maya Chen spent twelve years as a COO and then CEO before writing a single check. She has scaled two companies from single-digit to triple-digit headcount and sold one of them. She does not believe you can separate "the idea" from "the team" — and she is far more interested in how you run the place than what the deck says.

At Runway Capital she leads investments in B2B and vertical SaaS. Her reputation is built on a single question she asks in every first meeting: "Walk me through the last decision you made that half your team disagreed with." She has passed on founders who could not answer it concretely. She has backed founders who described a decision that blew up in their face and what they did next.

She does not care about your TAM slide. She cares whether you have shipped something, talked to users, and can tell her what you would do with eighteen months of runway and no new funding. Portfolio founders call her "the operator's operator" because she asks the questions their own boards often skip.`,
        education: [
            { school: 'Stanford University', degree: 'BS Management Science & Engineering', years: '2002 – 2006' },
            { school: 'Stanford GSB', degree: 'MBA', years: '2010 – 2012' },
        ],
        experience: [
            {
                company: 'Runway Capital',
                role: 'Partner',
                years: '2020 – Present',
                description:
                    'Leads B2B and vertical SaaS investments for a $180M fund. Brings operator lens to every diligence call: unit economics, hiring plan, and "what would you do if we said no?"',
            },
            {
                company: 'ScalePath',
                role: 'CEO',
                years: '2015 – 2020',
                description:
                    'Took over as CEO after co-founder departure. Grew ARR 3x and led acquisition by strategic buyer. Left with a permanent bias toward teams that have already survived a crisis — and moved directly into investing.',
            },
        ],
        portfolio: [
            { company: 'Stackline', stage: 'Seed, 2020', note: 'Vertical SaaS for inventory. Maya asked for a single spreadsheet: cohort retention by month. The founder had it in the room. She led the round.' },
            { company: 'CrewLogic', stage: 'Series A, 2022', note: 'Workforce scheduling. Passed on the same company at seed when the founder could not explain why churn had spiked in Q3. Came back a year later with a clear narrative and a new head of customer success. She invested.' },
        ],
        stats: [
            { label: 'Fund Size', value: '$180M' },
            { label: 'Portfolio Companies', value: '8' },
            { label: 'Years Investing', value: '5' },
            { label: 'Years as Operator (pre-VC)', value: '8' },
            { label: 'Median First Check', value: '$1.5M' },
        ],
    },
};

// ─── Week 10 ──────────────────────────────────────────────────────────────────

const WEEK10: WeekConfig = {
    number: 10,
    title: 'Week 10',
    persona: {
        name: 'Vikram Rao',
        title: 'Managing Partner',
        company: 'Monsoon Ventures',
        location: 'London, UK',
        about: `Vikram Rao runs a pan-European fund that has made forty-two investments across twelve countries. He does not have a sector thesis — he has a geography thesis. He believes the best companies in the next decade will be built by founders who understand multiple markets from day one, and he is willing to be wrong about the product if he is right about the team's ability to learn.

He asks every founder: "Who is your first non-domestic customer and why?" If the answer is "we haven't thought about it," the meeting is effectively over. He has backed companies that pivoted twice before product-market fit and passed on companies that had perfect metrics but a single-market mindset. His portfolio includes a Berlin-based fintech, a Lisbon-based climate tech company, and a Warsaw-based devtools startup — and he has never asked any of them to move to London.

He is known for long, unstructured conversations that feel like brainstorming sessions. Founders often leave not sure whether they were being interviewed or coached. Both are true.`,
        education: [
            { school: 'London School of Economics', degree: 'BSc Economics', years: '1998 – 2001' },
            { school: 'INSEAD', degree: 'MBA', years: '2005 – 2006' },
        ],
        experience: [
            {
                company: 'Monsoon Ventures',
                role: 'Managing Partner',
                years: '2015 – Present',
                description:
                    'Runs $140M pan-European fund. Leads investments in 12 countries. No sector mandate — thesis is cross-border execution and founder adaptability.',
            },
            {
                company: 'Index Ventures',
                role: 'Principal',
                years: '2010 – 2015',
                description:
                    'Focused on European early-stage. Led investments in 8 companies across UK, Germany, France. Left to start Monsoon with a thesis that "European" was too broad to be useful.',
            },
            {
                company: 'McKinsey & Company',
                role: 'Consultant',
                years: '2006 – 2010',
                description:
                    'Strategy and operations across Europe and India. Built a habit of asking "what happens when you scale this to another country?" that has defined his investing ever since.',
            },
        ],
        portfolio: [
            { company: 'CrossPay', stage: 'Seed, 2019', note: 'Berlin fintech. First customer was in Poland. Vikram asked how they would support a customer in a country where no one on the team had ever lived. The founder had a plan. He wrote the check.' },
            { company: 'TerraNode', stage: 'Pre-seed, 2021', note: 'Lisbon climate tech. No revenue. Vikram backed the team and their willingness to run pilots in three countries in the first year.' },
            { company: 'DevStream', stage: 'Seed, 2022', note: 'Warsaw devtools. The founder had sold a previous company to a US acquirer. Vikram cared more about that experience than the current deck.' },
            { company: 'Pipedeck', stage: 'Pre-seed, 2023', note: 'Amsterdam-based CI/CD pipeline visibility tooling for engineering teams operating across multi-cloud environments. The founding team shipped their first enterprise integration across four countries before raising. Vikram asked how many time zones their on-call rotation spanned.' },
        ],
        stats: [
            { label: 'Fund Size', value: '$140M' },
            { label: 'Portfolio Companies', value: '42' },
            { label: 'Countries Invested In', value: '12' },
            { label: 'Median First Check', value: '€1.2M' },
            { label: 'Avg. Time to First Non-Domestic Customer', value: '4 months' },
            { label: 'Years Investing', value: '15' },
        ],
    },
};

// ─── Week 11 ──────────────────────────────────────────────────────────────────

const WEEK11: WeekConfig = {
    number: 11,
    title: 'Week 11',
    persona: {
        name: 'Nadia Ferreira',
        title: 'Managing Partner',
        company: 'Semente Capital',
        location: 'Miami, FL',
        about: `The nickname "Baseline Nadia" came from a World Bank colleague who noticed she would never let a conversation proceed without establishing what conditions currently looked like for the people being discussed. She carried this habit into venture capital when she founded Semente Capital in 2017, after nine years at the World Bank and USAID watching billions of dollars of intervention money chase the same well-measured problems while a far larger set of unmeasured ones grew quietly worse.

Her thesis is not complicated: the people running most VC-backed companies are not building for people who look like their median user. She is. Semente focuses on health access, financial inclusion, and workforce tools for non-professional labor — and her checks have gone to companies in six countries. She grew up in São Paulo, studied public health there, and left for a Kennedy School MPP on the conviction that the problems she cared about would not be solved by government policy alone. She was right.

She will ask you one question before any other: "What is the GDP per capita of your median user?" If you don't know, she will tell you that you don't know your business. If the answer is above a certain threshold, she will ask why you are sitting across from her and not someone else. She is not hostile when she asks this. She is just efficient.`,
        education: [
            {
                school: 'University of São Paulo',
                degree: 'BSc Public Health',
                years: '2001 – 2005',
            },
            {
                school: 'Harvard Kennedy School',
                degree: 'MPP (Master of Public Policy)',
                years: '2006 – 2008',
            },
        ],
        experience: [
            {
                company: 'Semente Capital',
                role: 'Managing Partner',
                years: '2017 – Present',
                description:
                    'Leads a $75M fund investing in health access, financial inclusion, and workforce technology for non-professional labor — primarily in the US and Latin America. Has a standing rule: before any term sheet, she must be able to describe the median user\'s daily financial life in specific, non-demographic terms. Has turned down three companies with better metrics than funded companies because the founder could not answer that question.',
            },
            {
                company: 'USAID',
                role: 'Director, Health Innovation Program',
                years: '2014 – 2017',
                description:
                    'Oversaw a $40M annual grant program funding market-based health solutions in Latin America and sub-Saharan Africa. Became convinced during this period that the most effective interventions looked more like companies than like programs — and that the field needed investors, not more program officers. Left to become one.',
            },
            {
                company: 'World Bank',
                role: 'Senior Health Economist, Latin America & Caribbean',
                years: '2008 – 2014',
                description:
                    'Designed and evaluated health financing programs across Brazil, Colombia, Mexico, and Peru. Published research on informal-sector health coverage gaps that was cited in four subsequent national policy debates. Left after six years when she concluded that the people she was most interested in helping were moving faster than the institutions designed to help them.',
            },
        ],
        portfolio: [
            {
                company: 'Cora Health',
                stage: 'Pre-seed, 2018',
                note: 'Diagnostics infrastructure for rural clinics in Brazil and Colombia. The founder had spent ten years as a community health worker before building the company. Nadia asked what he had seen in 2013 specifically. He talked for fifteen minutes without stopping. She asked when she could see the prototype.',
            },
            {
                company: 'EmpréstaFácil',
                stage: 'Seed, 2020',
                note: 'Mobile lending for informal workers in Mexico. The founder presented a single data point at the start of the meeting: 72% of their active users had never held a formal bank account before their first loan. Nadia later said it was the only TAM slide she had ever believed on first sight.',
            },
            {
                company: 'BuilderPath',
                stage: 'Seed, 2022',
                note: 'Workforce credentialing for US construction and trades workers. Passed on two US-based competitors the same year. Her notes on both: "median user household income above $80K — wrong market for this fund."',
            },
            {
                company: 'Rede Saúde',
                stage: 'Pre-seed, 2023',
                note: 'Community health worker coordination platform for rural Brazil and Mexico. No US VC had seen it. Nadia found it through a World Bank contact in Guadalajara. The founder had never met a US investor before. The product had 8,000 monthly active health workers before the first conversation with her.',
            },
        ],
        stats: [
            { label: 'Fund Size', value: '$75M' },
            { label: 'Portfolio Companies', value: '21' },
            { label: 'Countries Invested In', value: '6' },
            { label: 'Avg First Check', value: '$1.2M' },
            { label: 'Companies Serving Users Below $40K Income', value: '14 of 21' },
            { label: 'Years in Public Sector Before Investing', value: '9' },
        ],
    },
};

// ─── Week 12 ──────────────────────────────────────────────────────────────────

const WEEK12: WeekConfig = {
    number: 12,
    title: 'Week 12',
    persona: {
        name: 'Declan Marsh',
        title: 'Founding Partner',
        company: 'Second Scar Fund',
        location: 'Dublin, Ireland',
        about: `There are three startups on Declan Marsh's desk — he keeps the original founding materials from each one in three separate folders, in order. The first folder is the thinnest. HiveLink shut down in 2007, two years after founding, having burned through €2.3M of other people's money on a social platform that solved a problem nobody had. He does not hide this. He brings it up himself, usually within the first few minutes, before a founder has had the chance to form the impression that he has never failed. That impression, he says, is the most dangerous kind.

The second and third folders are thicker. GridSync was acquired for €28M in 2010. Peregrine Freight hit a €400M market cap on the Euronext Dublin exchange in 2016. He started Second Scar Fund in 2020 on the premise he had been operating on for years without formalizing: the founders who survive failure are the only ones he trusts. Not because failure guarantees success, but because the knowledge you carry out of a company you watched collapse — and the specific decision to build again anyway — is the only thing he has found that reliably predicts what a founder will do when the next crisis arrives. The next crisis always arrives.

He has no MBA. He studied history at UCD on the grounds that it was the only subject he was told had no commercial application, which he found interesting. He does not recommend the career path. He does not not recommend it either.`,
        education: [
            {
                school: 'University College Dublin',
                degree: 'BA History',
                years: '2001 – 2004',
            },
        ],
        experience: [
            {
                company: 'Second Scar Fund',
                role: 'Founding Partner',
                years: '2020 – Present',
                description:
                    'Runs a €50M fund with a single hard constraint: every founder backed has had at least one meaningful prior failure. Not a setback. A failure — something that ended, cost other people money, and required an account of what went wrong. Has backed 11 companies. Nine of those founders have a specific story they can tell about the worst three months of a company they ran before this one. The other two have a story about the worst week.',
            },
            {
                company: 'Peregrine Freight',
                role: 'CEO & Co-founder',
                years: '2012 – 2019',
                description:
                    'Built a pan-European freight coordination platform from a two-person operation in Dublin to a publicly listed company on Euronext Dublin at a €400M market cap. Did not enjoy the IPO process. Has described the eighteen months of preparation for it as the period he learned the most about things he did not want to spend his career on.',
            },
            {
                company: 'GridSync',
                role: 'CEO & Co-founder',
                years: '2008 – 2012',
                description:
                    'Energy management software for commercial buildings. Built and sold to a German utility for €28M. The first company he built after HiveLink shut down. Has said publicly that HiveLink taught him everything GridSync needed and that he could not have run GridSync without having run HiveLink first. Has also said he would not recommend HiveLink to anyone.',
            },
            {
                company: 'HiveLink',
                role: 'Co-founder',
                years: '2005 – 2007',
                description:
                    'Social platform for professional communities. Shut down after 26 months. Burned €2.3M. Declan has given at least fifteen talks about this company and has declined to remove any of them from the internet.',
            },
        ],
        portfolio: [
            {
                company: 'Patchwork',
                stage: 'Seed, 2021',
                note: 'Async communication tooling for distributed teams. The founder had previously taken a company from 40 employees down to 4 in eight months before shutting it down. Declan spent most of the first meeting asking about that company, not this one. He called with a term sheet two days later.',
            },
            {
                company: 'Haulhub',
                stage: 'Seed, 2022',
                note: 'Freight matching for SMB shippers. All three founders had worked at the same logistics startup that failed in 2018. Declan confirmed this before the meeting. He was the only investor in the room who did not ask about the current product in the first twenty minutes.',
            },
            {
                company: 'Ridgeline Data',
                stage: 'Pre-seed, 2023',
                note: 'Infrastructure monitoring for cloud-native systems. The founder\'s previous company sold in a distressed deal for almost nothing in 2020. She called it a "zombie exit" in the pitch without being prompted. Declan backed her by the end of that week.',
            },
            {
                company: 'Outpost',
                stage: 'Seed, 2024',
                note: 'Remote team operations tooling for distributed workforces. Both founders had previously co-founded a company together that failed publicly and messily in 2021, with press coverage Declan had read in full before the meeting. He asked what they had each told their families at the time.',
            },
        ],
        stats: [
            { label: 'Fund Size', value: '€50M' },
            { label: 'Portfolio Companies', value: '11' },
            { label: 'Founders with Prior Failure', value: '11 of 11' },
            { label: 'Own Companies Built', value: '3 (1 failed, 2 exited)' },
            { label: 'Avg First Check', value: '€1.5M' },
            { label: 'Years Without an MBA', value: 'All of them' },
        ],
    },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const WEEKS: WeekConfig[] = [WEEK1, WEEK2, WEEK3, WEEK4, WEEK5, WEEK6, WEEK7, WEEK8, WEEK9, WEEK10, WEEK11, WEEK12];

/** Current week is derived from semester via getCurrent() in index. */
export async function getCurrent(): Promise<number> {
    const week = await import('@/lib/semester').then((m) => m.getCurrent());
    return Math.min(Math.max(week, 1), WEEKS.length);
}