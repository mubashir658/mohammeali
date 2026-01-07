-- Profile table for personal information
CREATE TABLE public.profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Mohammed Mubashir Ali',
  headline TEXT DEFAULT 'Software Engineer | AI Enthusiast | Full-Stack Developer',
  subheadline TEXT DEFAULT 'Transforming ideas into intelligent solutions with AI & Modern Web Technologies',
  location TEXT DEFAULT 'Hyderabad, India',
  email TEXT DEFAULT 'mohammedmubashiralai658@gmail.com',
  about_text TEXT DEFAULT 'A passionate software engineering student at Keshav Memorial Institute of Technology, Hyderabad, with a strong foundation in AI/ML, full-stack development, and problem-solving.',
  linkedin_url TEXT,
  github_url TEXT,
  leetcode_url TEXT,
  leetcode_rank TEXT,
  resume_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  tech_stack TEXT[],
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT,
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  grade TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_name TEXT,
  date DATE,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read policies for portfolio content
CREATE POLICY "Anyone can view profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Anyone can view education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- Anyone can submit contact messages
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Authenticated users can manage all content
CREATE POLICY "Authenticated users can update profile" ON public.profile FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert profile" ON public.profile FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage skills" ON public.skills FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage projects" ON public.projects FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage education" ON public.education FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage achievements" ON public.achievements FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view messages" ON public.contact_messages FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update messages" ON public.contact_messages FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete messages" ON public.contact_messages FOR DELETE USING (auth.uid() IS NOT NULL);

-- Insert default profile
INSERT INTO public.profile (name, headline, subheadline, location, email, about_text)
VALUES (
  'Mohammed Mubashir Ali',
  'Software Engineer | AI Enthusiast | Full-Stack Developer',
  'Transforming ideas into intelligent solutions with AI & Modern Web Technologies',
  'Hyderabad, India',
  'mohammedmubashiralai658@gmail.com',
  'A passionate software engineering student at Keshav Memorial Institute of Technology, Hyderabad. I specialize in AI/ML, full-stack development, and love solving complex problems through code.'
);

-- Insert default skills
INSERT INTO public.skills (category, name) VALUES
('Programming Languages', 'Python'),
('Programming Languages', 'C'),
('Programming Languages', 'C++'),
('Programming Languages', 'Java'),
('Web Development', 'HTML'),
('Web Development', 'CSS'),
('Web Development', 'React'),
('Web Development', 'Tailwind CSS'),
('Web Development', 'Bootstrap'),
('Web Development', 'Node.js'),
('Web Development', 'Express.js'),
('AI/ML & Data Science', 'TensorFlow'),
('AI/ML & Data Science', 'Keras'),
('AI/ML & Data Science', 'Scikit-learn'),
('AI/ML & Data Science', 'Pandas'),
('AI/ML & Data Science', 'NumPy'),
('AI/ML & Data Science', 'Matplotlib'),
('Core Computer Science', 'Data Structures'),
('Core Computer Science', 'Algorithms'),
('Core Computer Science', 'OOP'),
('Core Computer Science', 'DBMS'),
('Tools & Technologies', 'Git'),
('Tools & Technologies', 'GitHub');

-- Insert default projects
INSERT INTO public.projects (title, description, tech_stack, featured) VALUES
('AI-Driven Insurance Behavior Analysis', 'An AI-powered application that analyzes customer behavior patterns to optimize insurance policy recommendations and risk assessment.', ARRAY['Python', 'TensorFlow', 'Pandas', 'React'], true),
('IoT-Based Home Automation System', 'A comprehensive smart home solution enabling remote control and automation of household devices through IoT sensors and connectivity.', ARRAY['Python', 'IoT', 'Node.js', 'React'], true),
('College Club Management Website', 'A full-stack web application designed to streamline college club operations, event management, and member coordination.', ARRAY['React', 'Node.js', 'Express.js', 'MongoDB'], true),
('Automated Exam Seating Arrangement', 'An intelligent AI-based system that optimizes exam seating arrangements to prevent malpractice while maximizing space efficiency.', ARRAY['Python', 'AI/ML', 'React', 'Flask'], true);

-- Insert default education
INSERT INTO public.education (institution, degree, field, start_year, end_year, grade, description) VALUES
('TMRIS Hayathnagar', '10th Standard', NULL, 2018, 2020, '10/10 GPA', 'Completed secondary education with perfect GPA'),
('TMRJC College', 'Intermediate', 'MPC', 2020, 2022, '960/1000', 'Completed higher secondary education with distinction'),
('KMIT Hyderabad', 'B.Tech', 'AI & ML', 2023, 2027, 'In Progress', 'Currently pursuing Bachelor of Technology in Artificial Intelligence and Machine Learning');

-- Insert default achievements
INSERT INTO public.achievements (title, description, event_name, date) VALUES
('Hackathon Participation', 'Participated in developing a real-world problem-solving application, gaining hands-on experience in rapid prototyping and teamwork.', 'Hackathon at Mukhafamja College', '2024-01-15'),
('AI-Based Exam Seating Project', 'Developed an AI-based automated seating arrangement system for exams, showcasing practical problem-solving skills and innovation.', 'Hackathon at CBIT College', '2024-03-20');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profile updates
CREATE TRIGGER update_profile_updated_at
BEFORE UPDATE ON public.profile
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();