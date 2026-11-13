-- Seed: the testimonials that are currently on the site.
-- Photos point at the images shipped in /public/assets/images.
insert into public.testimonials (name, credentials, body, excerpt, photo_url, featured, sort_order) values
(
  'Abraham Eliuorior',
  E'LLB, LLM, AFHEA, FRSA, Lecturer in Law, Birmingham City University,\nUK PhD Researcher, Durham University',
  E'These Coaching Sessions Have Been A Tremendous Influence In Helping Me Believe In My Abilities At Times When Self-Doubt Could Easily Have Taken Over. I Learned How To Navigate The Career Space With Discipline, Clarity, And Optimism, Understanding How Decisions, Positioning, And Timing Truly Matter.\n\nHer Support Has Given Me Structure, Confidence, And A Clearer Sense Of Direction Been Instrumental In Shaping Not Just My Career Progression, But How I Show Up Professionally Today.',
  E'These coaching sessions have been a tremendous influence in helping me believe in my abilities at times when self-doubt could easily have taken over. I learned how to navigate the career space with discipline, clarity, and optimism, understanding how decisions, positioning, and timing truly matter.\n\nHer support has given me structure, confidence, and a clearer sense of direction been instrumental in shaping not just my career progression, but how I show up professionally today.', '/assets/images/test1.jpeg', true, 1
),
(
  'Dr. Oriasotie Moses Ujaddughe',
  'PhD, MSc, MBBS',
  E'Navigating The Highly Technical Academic Recruitment Process In The UK Was Challenging Until I Engaged The Services Of Stryde Coaching. After My CV Was Professionally Refined, I Began Receiving Interview Invitations.\n\nThe Expert Guidance, Mock Interviews, And Detailed Feedback Helped Me Communicate My Teaching Philosophy And Research Interests With Confidence And Clarity. I Would Highly Recommend.',
  E'Navigating the highly technical academic recruitment process in the UK was challenging until I engaged the services of Stryde Coaching. After my CV was professionally refined, I began receiving interview invitations.\n\nThe expert guidance, mock interviews, and detailed feedback helped me communicate my teaching philosophy and research interests with confidence and clarity. I would highly recommend.', '/assets/images/test2.jpeg', true, 2
),
(
  'Dr. Soibi Bob-Manuel',
  'Lecturer, University of Birmingham, (Ph.D, LLM, LLB, BL)',
  E'Working With Amaka Over A Three-Month Period Last Year Was A Truly Transformative Experience With Thorough Coaching For Interviews, Reflection Exercise On My Past And Present Experiences, Helping Me Highlight My Strengths And Professional Capabilities.\n\nShe Researched Potential Areas For My Professional Development, Explored Opportunities For Research, And Presentation Engagements Aligned With My Career Goals.\n\nI Highly Recommend.',
  E'Working with Amaka over a three-month period last year was a truly transformative experience with thorough coaching for interviews, reflection exercise on my past and present experiences, helping me highlight my strengths and professional capabilities.\n\nShe researched potential areas for my professional development, explored opportunities for research, and presentation engagements aligned with my career goals. I highly recommend.',
  '/assets/images/test3.jpeg', true, 3
),
(
  'Ehimwenman Edemakhiota',
  'Software Engineer (Fintech)',
  E'I struggled in a role where my efforts were misunderstood, my performance suffered, and I felt stuck and unfulfilled as an engineer.\n\nReaching out to Chiamaka was a turning point. She understood my situation and guided me toward the decision to resign.\n\nToday, I’m in a better role and genuinely enjoy the work I do.',
  null, '/assets/images/test4.jpeg', false, 4
),
(
  'Thelma',
  'Social Worker',
  E'Even A coach needs a coach...\n\nMy head was banging and I had done all I knew to do. I hopped into the discovery call and the session blew my mind. It''s not easy to walk into a virtual room with a banging headache and walk out headache free.\n\nHer level of wisdom is to be experienced, and her expertise is blended with a great undertone of spirituality. Thank you for birthing Strydes!',
  null, '/assets/images/test5.jpeg', false, 5
),
(
  'Aderonke Adeyemi',
  'Early Childhood Assistant (Childcare)',
  E'The life-coaching sessions were all I needed to remind me that I was strong in a season when I experienced self-doubt.\n\nAmaka was always there to listen without judgement, especially when I lacked confidence in myself. She made me realize things I didn’t know about myself and helped me work on areas that needed improvement. The assessments and book recommendations were great supportive resources for journaling and self-awareness.\n\nAdditionally, the post sessions check up were helpful with tracking improvement.\n\nCheers to a more confident me, personally and professionally!',
  null, '/assets/images/test6.jpeg', false, 6
),
(
  'Fortune Obeahon',
  'Media Consulting, Broadcasting/Presenting, Hosting, Screen & Scriptwriting, Content Creation, Video Directing & Editing, Music Composition, Songwriting, Music Production & Diction Coach',
  E'The session helped me with a process of discovery and, in many ways, rediscovery. It gave me a more focused and intentional approach to understanding what I bring to the table, recognising the work and experience I already have, and identifying the areas where I still need to grow.\n\nMore importantly, it helped me look at the kind of roles I want to step into and honestly ask myself what it takes to become the right person for those opportunities. I left the session with greater clarity about my strengths, my value, and the work I need to put in to position myself properly.',
  null, '/assets/images/test7.jpg', false, 7
);

-- After creating your admin user in Authentication -> Users, grant access:
-- insert into public.admins (user_id)
--   select id from auth.users where email = 'hello@strydecoachings.com';
