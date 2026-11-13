/*
 * Fallback testimonials = the exact content of the original static site.
 * Used until Supabase is configured / while loading, so the site never renders empty.
 *
 * Shape (also what DB rows are mapped into, see hooks/useTestimonials.js):
 *  name, credentials (newline = <br>), paragraphs[], photo, alt, featured,
 *  optional home* overrides used by the homepage cards.
 */
export const FALLBACK_TESTIMONIALS = [
  {
    id: 'fb-1',
    name: 'Abraham Eliuorior',
    credentials: 'LLB, LLM, APHEA, FRSA, Lecturer in Law, Birmingham City University,\nUK PhD Researcher, Durham University',
    photo: '/assets/images/test1.jpeg',
    alt: 'Abraham Eliuorior',
    featured: true,
    paragraphs: [
      'These Coaching Sessions Have Been A Tremendous Influence In Helping Me Believe In My Abilities At Times When Self-Doubt Could Easily Have Taken Over. I Learned How To Navigate The Career Space With Discipline, Clarity, And Optimism, Understanding How Decisions, Positioning, And Timing Truly Matter.',
      'Her Support Has Given Me Structure, Confidence, And A Clearer Sense Of Direction Been Instrumental In Shaping Not Just My Career Progression, But How I Show Up Professionally Today.',
    ],
    homeCredentials: 'LLB, LLM, AFHEA, FRSA\nLecturer in Law, Birmingham City\n University, UK \nPhD Researcher, Durham University',
    homeParagraphs: [
      'These coaching sessions have been a tremendous influence in helping me believe in my abilities at times when self-doubt could easily have taken over. I learned how to navigate the career space with discipline, clarity, and optimism, understanding how decisions, positioning, and timing truly matter.',
      'Her support has given me structure, confidence, and a clearer sense of direction been instrumental in shaping not just my career progression, but how I show up professionally today.',
    ],
  },
  {
    id: 'fb-2',
    name: 'Dr. Oriasotie Moses Ujaddughe',
    credentials: 'PhD, MSc, MBBS',
    photo: '/assets/images/test2.jpeg',
    alt: 'Dr. Oriastle Moses Ujaddughe',
    featured: true,
    paragraphs: [
      'Navigating The Highly Technical Academic Recruitment Process In The UK Was Challenging Until I Engaged The Services Of Stryde Coaching. After My CV Was Professionally Refined, I Began Receiving Interview Invitations.',
      'The Expert Guidance, Mock Interviews, And Detailed Feedback Helped Me Communicate My Teaching Philosophy And Research Interests With Confidence And Clarity. I Would Highly Recommend.',
    ],
    homeCredentials: 'PHD, MSC, MBBS',
    homeParagraphs: [
      'Navigating the highly technical academic recruitment process in the UK was challenging until I engaged the services of Stryde Coaching. After my CV was professionally refined, I began receiving interview invitations.',
      'The expert guidance, mock interviews, and detailed feedback helped me communicate my teaching philosophy and research interests with confidence and clarity. I would highly recommend.',
    ],
  },
  {
    id: 'fb-3',
    name: 'Dr. Soibi Bob-Manuel',
    credentials: 'Lecturer, University of Birmingham, (Ph.D, LLM, LLB, BL)',
    photo: '/assets/images/test3.jpeg',
    alt: 'Dr. Soibi Bob-Manuel',
    featured: true,
    paragraphs: [
      'Working With Amaka Over A Three-Month Period Last Year Was A Truly Transformative Experience With Thorough Coaching For Interviews, Reflection Exercise On My Past And Present Experiences, Helping Me Highlight My Strengths And Professional Capabilities.',
      'She Researched Potential Areas For My Professional Development, Explored Opportunities For Research, And Presentation Engagements Aligned With My Career Goals.',
      'I Highly Recommend.',
    ],
    homeName: 'Dr. Soibi Bob-Manual',
    homeAlt: 'Dr. Saibi Bob-Manual',
    homeCredentials: 'LECTURER, UNIVERSITY OF BIRMINGHAM, (PH.D, LLB, B.L, Msc.)',
    homeParagraphs: [
      'Working with Amaka over a three-month period last year was a truly transformative experience with thorough coaching for interviews, reflection exercise on my past and present experiences, helping me highlight my strengths and professional capabilities. ',
      'She researched potential areas for my professional development, explored opportunities for research, and presentation engagements aligned with my career goals. I highly recommend.',
    ],
  },
  {
    id: 'fb-4',
    name: 'Ehimwenman Edemakhiota',
    credentials: 'Software Engineer (Fintech)',
    photo: '/assets/images/test4.jpeg',
    alt: 'Ehimwenman Edemakhiota',
    featured: false,
    paragraphs: [
      'I struggled in a role where my efforts were misunderstood, my performance suffered, and I felt stuck and unfulfilled as an engineer.',
      'Reaching out to Chiamaka was a turning point. She understood my situation and guided me toward the decision to resign.',
      'Today, I’m in a better role and genuinely enjoy the work I do.',
    ],
  },
  {
    id: 'fb-5',
    name: 'Thelma',
    credentials: 'Social Worker',
    photo: '/assets/images/test5.jpeg',
    alt: 'Thelma',
    featured: false,
    paragraphs: [
      'Even A coach needs a coach...',
      "My head was banging and I had done all I knew to do. I hopped into the discovery call and the session blew my mind. It's not easy to walk into a virtual room with a banging headache and walk out headache free.",
      'Her level of wisdom is to be experienced, and her expertise is blended with a great undertone of spirituality. Thank you for birthing Strydes!',
    ],
  },
  {
    id: 'fb-6',
    name: 'Aderonke Adeyemi',
    credentials: 'Early Childhood Assistant (Childcare)',
    photo: '/assets/images/test6.jpeg',
    alt: 'Thelma',
    featured: false,
    paragraphs: [
      'The life-coaching sessions were all I needed to remind me that I was strong in a season when I experienced self-doubt.',
      'Amaka was always there to listen without judgement, especially when I lacked confidence in myself. She made me realize things I didn’t know about myself and helped me work on areas that needed improvement. The assessments and book recommendations were great supportive resources for journaling and self-awarenes',
      'Additionally, the post sessions check up were helpful with tracking improvement.',
      'Cheers to a more confident me, personally and professionally!',
    ],
  },
  {
    id: 'fb-7',
    name: 'Fortune Obeahon',
    credentials: 'Media Consulting, Broadcasting/Presenting, Hosting, Screen & Scriptwriting, Content Creation, Video Directing & Editing, Music Composition, Songwriting, Music Production & Diction Coach',
    photo: '/assets/images/test7.jpg',
    alt: 'Fortune Obaeahon',
    featured: false,
    paragraphs: [
      'The session helped me with a process of discovery and, in many ways, rediscovery. It gave me a more focused and intentional approach to understanding what I bring to the table, recognising the work and experience I already have, and identifying the areas where I still need to grow.',
      'More importantly, it helped me look at the kind of roles I want to step into and honestly ask myself what it takes to become the right person for those opportunities. I left the session with greater clarity about my strengths, my value, and the work I need to put in to position myself properly.',
    ],
  },
];
