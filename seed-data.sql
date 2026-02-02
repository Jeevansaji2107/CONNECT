-- Connect Professional Demo Data Seed
-- 100 Users, 200+ Posts, and Cross-Follow relationships

-- 1. CLEANUP (Optional - Uncomment if you want a clean slate)
-- DELETE FROM follows;
-- DELETE FROM likes;
-- DELETE FROM comments;
-- DELETE FROM posts;
-- DELETE FROM users WHERE email != 'maddy@connect.social';

-- 2. BULK USERS (Tech & Creative Professionals)
INSERT INTO users (id, name, email, image, bio)
VALUES
    (uuid_generate_v4(), 'Liam Chen', 'liam@tech.node', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam', 'AI Research Lead @ NeuralDynamics. Exploring the boundaries of LLMs.'),
    (uuid_generate_v4(), 'Sofia Rodriguez', 'sofia@design.io', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', 'Senior Product Designer. Minimalist. Typography enthusiast.'),
    (uuid_generate_v4(), 'Marcus Thorne', 'marcus@arch.web', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', 'Distributed Systems Architect. Rust & Go lover.'),
    (uuid_generate_v4(), 'Elena Petrov', 'elena@creative.net', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', 'Digital Artist and 3D Modeler. Visualizing the metaverse.'),
    (uuid_generate_v4(), 'Jordan Smith', 'jordan@dev.flow', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan', 'Full Stack Developer | Typescript | Next.js | Tailwind.'),
    (uuid_generate_v4(), 'Aria Varma', 'aria@quant.finance', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria', 'Quantitative Analyst. Data-driven decisions. Pythonista.'),
    (uuid_generate_v4(), 'David Kim', 'david@startup.hub', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', 'Serial Entrepreneur. Building the next 10x social engine.'),
    (uuid_generate_v4(), 'Zoe Blackwell', 'zoe@cyber.sec', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe', 'Security Researcher. Pentesting the future.'),
    (uuid_generate_v4(), 'Nathaniel Drake', 'nathan@explorer.co', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nathan', 'Adventure Photographer. Capturing the unseen corners of earth.'),
    (uuid_generate_v4(), 'Isabella Rossi', 'isabella@fashion.tech', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella', 'Fashion Tech Innovator. Sustainable fabrics & smart wearables.'),
    -- ... and so on ...
    (uuid_generate_v4(), 'Alex Rivera', 'alex@cloud.sync', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', 'Cloud Infrastructure Maven. Kubernetes at edge.'),
    (uuid_generate_v4(), 'Maya Lin', 'maya@green.earth', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya', 'Climate Tech Advocate. Carbon capture optimization.'),
    (uuid_generate_v4(), 'Viktor Volkov', 'viktor@crypto.org', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viktor', 'Blockchain Engineer. DeFi researcher.'),
    (uuid_generate_v4(), 'Sarah Chen', 'sarah@bio.med', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen', 'Bioinformatics Scientist. Sequencing the future.'),
    (uuid_generate_v4(), 'Omar Hassan', 'omar@smart.city', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar', 'Urban Planner. Smart city infrastructure specialist.'),
    (uuid_generate_v4(), 'Grace Hopper', 'grace@legacy.dev', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace', 'Compiler Enthusiast. Keep debugging.'),
    (uuid_generate_v4(), 'Linus Torvalds', 'linus@kernel.mod', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linus', 'I follow instructions. (Maybe).'),
    (uuid_generate_v4(), 'Ada Lovelace', 'ada@algorithmic.art', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ada', 'The first algorithm specialist.'),
    (uuid_generate_v4(), 'Elon Musk', 'elon@mars.exp', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elon', 'Multi-planetary social sync.'),
    (uuid_generate_v4(), 'Jensen Huang', 'jensen@gpu.compute', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jensen', 'The more you buy, the more you save.'),
    (uuid_generate_v4(), 'Sam Altman', 'sam@agi.open', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam', 'Scaling to AGI.'),
    (uuid_generate_v4(), 'Vitalik Buterin', 'vitalik@eth.core', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vitalik', 'Proof of Stake enthusiast.'),
    (uuid_generate_v4(), 'Jeff Bezos', 'jeff@amazon.prime', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jeff', 'Customer obsession.'),
    (uuid_generate_v4(), 'Mark Zuckerberg', 'mark@meta.verse', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark', 'Building the social fabric of the metaverse.'),
    (uuid_generate_v4(), 'Satya Nadella', 'satya@azure.cloud', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Satya', 'Empowering every person on the planet.'),
    (uuid_generate_v4(), 'Sundar Pichai', 'sundar@search.go', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sundar', 'Organizing the world information.'),
    (uuid_generate_v4(), 'Tim Cook', 'tim@privacy.first', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tim', 'Privacy is a fundamental human right.'),
    (uuid_generate_v4(), 'Vercel User', 'v@vercel.app', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vercel', 'Zero-config deployment fan.'),
    (uuid_generate_v4(), 'Next.js Dev', 'n@nextjs.org', 'https://api.dicebear.com/7.x/avataaars/svg?seed=NextJS', 'App Router is the future.'),
    (uuid_generate_v4(), 'React Fan', 'r@react.dev', 'https://api.dicebear.com/7.x/avataaars/svg?seed=React', 'Component-driven world.'),
    (uuid_generate_v4(), 'Tailwind Expert', 't@tailwindcss.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tailwind', 'Utility-first CSS changes everything.'),
    (uuid_generate_v4(), 'Supabase Hero', 's@supabase.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Supabase', 'Open source Firebase alternative.'),
    (uuid_generate_v4(), 'Prisma God', 'p@prisma.io', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prisma', 'Type-safe queries for everyone.'),
    (uuid_generate_v4(), 'TRPC Admin', 'trpc@admin.io', 'https://api.dicebear.com/7.x/avataaars/svg?seed=TRPC', 'End-to-end typesafety.'),
    (uuid_generate_v4(), 'Zustand Master', 'z@zustand.org', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zustand', 'Small, fast state management.'),
    (uuid_generate_v4(), 'Framer Motion Enthusiast', 'f@framer.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Framer', 'Making the web feel alive.'),
    (uuid_generate_v4(), 'Lucide Iconographer', 'l@lucide.dev', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucide', 'Beautiful SVG icons for all.'),
    (uuid_generate_v4(), 'Shadcn UI', 'shad@cn.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadcn', 'Beautifully designed components.'),
    (uuid_generate_v4(), 'Postman Pro', 'post@man.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Postman', 'API development simplified.'),
    (uuid_generate_v4(), 'Docker Captain', 'dock@er.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Docker', 'Containerize the whole world.'),
    (uuid_generate_v4(), 'K8s SRE', 'k8s@cluster.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=K8s', 'Orchestrating complexity.'),
    (uuid_generate_v4(), 'Terraform Architect', 'tf@infra.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Terraform', 'Infrastructure as Code.'),
    (uuid_generate_v4(), 'AWS Cloud Practitioner', 'aws@cloud.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=AWS', 'Scalable computing power.'),
    (uuid_generate_v4(), 'GCP Data Scientist', 'gcp@data.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=GCP', 'BigQuery makes it easy.'),
    (uuid_generate_v4(), 'Azure Enterprise', 'az@corp.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Azure', 'Building for the enterprise.'),
    (uuid_generate_v4(), 'MongoDB Hero', 'mongo@db.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=MongoDB', 'Document-based flexibility.'),
    (uuid_generate_v4(), 'Redis Flash', 'redis@fast.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Redis', 'Blazing fast in-memory store.'),
    (uuid_generate_v4(), 'Postgres Guru', 'pg@sql.org', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Postgres', 'The best relational database.'),
    (uuid_generate_v4(), 'SQL Specialist', 'sql@data.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SQL', 'Selecting everything efficiently.'),
    (uuid_generate_v4(), 'NoSQL Innovator', 'nosql@future.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=NoSQL', 'Beyond relational limits.'),
    (uuid_generate_v4(), 'GraphQL Ninja', 'gql@ninja.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=GraphQL', 'Ask for what you need.'),
    (uuid_generate_v4(), 'Rest API Veteran', 'rest@classic.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=REST', 'Stateless and reliable.'),
    (uuid_generate_v4(), 'Websocket Wizard', 'ws@realtime.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=WS', 'Real-time bidirectional flow.'),
    (uuid_generate_v4(), 'GRPC Specialist', 'grpc@rpc.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=GRPC', 'High performance microservices.'),
    (uuid_generate_v4(), 'Auth0 Security', 'auth0@sec.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Auth0', 'Authentication at scale.'),
    (uuid_generate_v4(), 'Stripe Payment', 'stripe@pay.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stripe', 'The global standard for payments.'),
    (uuid_generate_v4(), 'SendGrid Mailer', 'mail@grid.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SendGrid', 'Email delivery that works.'),
    (uuid_generate_v4(), 'Twilio SMS', 'sms@twilio.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Twilio', 'Communicate with the world.'),
    (uuid_generate_v4(), 'Ably Realtime', 'ably@sync.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ably', 'Realtime features made easy.'),
    (uuid_generate_v4(), 'Sentry Error Tracker', 'sentry@debug.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sentry', 'Catch errors before they catch you.'),
    (uuid_generate_v4(), 'Datadog Monitor', 'dd@metrics.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Datadog', 'Observability for everyone.'),
    (uuid_generate_v4(), 'LogRocket Session', 'lr@replay.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LogRocket', 'See exactly what users do.'),
    (uuid_generate_v4(), 'Mixpanel Analyst', 'mix@panel.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mixpanel', 'Data-driven product growth.'),
    (uuid_generate_v4(), 'Amplitude Product', 'amp@litude.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amplitude', 'Powering product teams with data.'),
    (uuid_generate_v4(), 'Intercom Support', 'int@ercom.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Intercom', 'Customer connection platform.'),
    (uuid_generate_v4(), 'Zendesk Hero', 'zen@desk.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zendesk', 'Better customer experiences.'),
    (uuid_generate_v4(), 'HubSpot Marketer', 'hub@spot.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HubSpot', 'Inbound marketing magic.'),
    (uuid_generate_v4(), 'Salesforce Admin', 'sf@admin.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Salesforce', 'The CRM giant.'),
    (uuid_generate_v4(), 'Slack Integrator', 'slack@bot.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Slack', 'Where work happens.'),
    (uuid_generate_v4(), 'Discord Mod', 'discord@mod.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Discord', 'Building communities.'),
    (uuid_generate_v4(), 'Linear Product Manager', 'linear@flow.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linear', 'The magical project manager.'),
    (uuid_generate_v4(), 'Notion Expert', 'notion@doc.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Notion', 'The all-in-one workspace.'),
    (uuid_generate_v4(), 'Whimsical Wireframer', 'whim@sical.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Whimsical', 'Visual collaboration.'),
    (uuid_generate_v4(), 'Mirror Artist', 'mirr@or.xyz', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mirror', 'Web3 publishing.'),
    (uuid_generate_v4(), 'Substack Writer', 'sub@stack.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Substack', 'Newsletter revolution.'),
    (uuid_generate_v4(), 'Medium Columnist', 'med@ium.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Medium', 'A cleaner reading experience.'),
    (uuid_generate_v4(), 'Dev.to Blogger', 'dev@to.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevTo', 'Where developers share.'),
    (uuid_generate_v4(), 'Hashnode Hackers', 'hash@node.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hashnode', 'Blogging for developers.'),
    (uuid_generate_v4(), 'LeetCode Master', 'lc@master.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LeetCode', 'Hard problems made easy.'),
    (uuid_generate_v4(), 'HackerRank Solver', 'hr@solver.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HackerRank', 'Ready to be hired.'),
    (uuid_generate_v4(), 'Codewars Warrior', 'cw@warrior.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Codewars', 'Improving skills by kata.'),
    (uuid_generate_v4(), 'Coursera Learner', 'cour@sera.org', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coursera', 'Learning from the best universities.'),
    (uuid_generate_v4(), 'Udemy Student', 'ud@emy.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Udemy', 'Affordable learning for all.'),
    (uuid_generate_v4(), 'Pluralsight Expert', 'ps@expert.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pluralsight', 'Tech skills training at scale.'),
    (uuid_generate_v4(), 'Khan Academy', 'khan@academy.org', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khan', 'Free education for anyone, anywhere.'),
    (uuid_generate_v4(), 'TED Talker', 'ted@talk.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=TED', 'Ideas worth spreading.'),
    (uuid_generate_v4(), 'Masterclass Student', 'master@class.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Masterclass', 'Learn from the greats.'),
    (uuid_generate_v4(), 'Skillshare Creative', 'skill@share.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Skillshare', 'Creativity for everyone.'),
    (uuid_generate_v4(), 'Canva Designer', 'can@va.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Canva', 'Design for everyone.'),
    (uuid_generate_v4(), 'Adobe Creative Cloud', 'adobe@cc.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adobe', 'Pro tools for creators.'),
    (uuid_generate_v4(), 'Figma Collaborative', 'fig@ma.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Figma', 'The collaborative design tool.'),
    (uuid_generate_v4(), 'Sketch App', 'sketch@app.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sketch', 'Design with precision.'),
    (uuid_generate_v4(), 'InVision Proto', 'in@vision.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=InVision', 'Prototyping made simple.'),
    (uuid_generate_v4(), 'Zeplin Handoff', 'zep@lin.io', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zeplin', 'Handoff for designers and devs.'),
    (uuid_generate_v4(), 'Abstract Versioning', 'abs@tract.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abstract', 'Git for design.'),
    (uuid_generate_v4(), 'Webflow Hero', 'web@flow.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Webflow', 'No-code visual development.'),
    (uuid_generate_v4(), 'Bubble Builder', 'bubble@zero.code', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bubble', 'The full-stack no-code tool.'),
    (uuid_generate_v4(), 'Airtable Master', 'air@table.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Airtable', 'Spreadsheet meets database.'),
    (uuid_generate_v4(), 'Zapier Automater', 'zap@ier.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zapier', 'Connecting your apps.'),
    (uuid_generate_v4(), 'Make Integrator', 'make@integ.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Make', 'Visual automation at its best.')
ON CONFLICT (email) DO NOTHING;

-- 3. CROSS-FOLLOWS (Randomish distribution to trigger suggestions)
INSERT INTO follows (id, follower_id, following_id)
SELECT uuid_generate_v4(), f.id, t.id
FROM users f, users t
WHERE f.id != t.id 
AND f.email != 'maddy@connect.social'
AND random() < 0.05
ON CONFLICT DO NOTHING;

-- 4. BULK POSTS (Diverse content)
INSERT INTO posts (id, content, author_id, created_at)
SELECT 
    uuid_generate_v4(), 
    CASE (floor(random()*10)::int)
        WHEN 0 THEN 'Just completed a deep dive into Rust memory safety. Mind-blowing efficiency. #RustLang #Systems'
        WHEN 1 THEN 'Design is not just what it looks like. It is how it works. #ProductDesign #UIUX'
        WHEN 2 THEN 'Distributed systems are easy. They state just exists in multiple places at once. Right? #Backend #Architecture'
        WHEN 3 THEN 'Capturing the sunset over the Himalayas today. Nature is the ultimate architect. 🏔️☀️'
        WHEN 4 THEN 'Next.js 15 App Router is a game changer for server components. #NextJS #WebDev'
        WHEN 5 THEN 'Cybersecurity is a constant battle of wits. Always be learning. #Infosec #Hacking'
        WHEN 6 THEN 'The future of finance is decentralized and open. #Blockchain #Crypto'
        WHEN 7 THEN 'Artificial intelligence is not a replacement for human creativity, but a multiplier. #AI #Future'
        WHEN 8 THEN 'Data visualization is the art of making the invisible visible. #DataScience #Analytics'
        ELSE 'Connect is the social layer we needed for the high-frequency era. #Connect #SocialWeb'
    END,
    u.id,
    NOW() - (random() * INTERVAL '30 days')
FROM users u
CROSS JOIN generate_series(1, 3) -- 3 posts per user
WHERE u.email != 'maddy@connect.social'
ON CONFLICT DO NOTHING;
