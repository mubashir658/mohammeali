import { useEffect, useState } from 'react';
import { supabase } from '@/services/integrations/supabase/client';
import { usePageMeta } from '@/hooks/use-page-meta';
import NetworkBackground from '@/components/NetworkBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import EducationSection from '@/components/EducationSection';
import AchievementsSection from '@/components/AchievementsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: 'Mohammed Mubashir Ali | Software Engineer & AI Enthusiast',
    description: 'Portfolio of Mohammed Mubashir Ali — Software Engineer and AI/ML Enthusiast in Hyderabad. Explore projects, skills, and achievements.',
    canonical: 'https://mohammeali.lovable.app/',
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes, projectsRes, educationRes, achievementsRes] = await Promise.all([
          supabase.from('profile').select('*').limit(1).single(),
          supabase.from('skills').select('*'),
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('education').select('*'),
          supabase.from('achievements').select('*').order('date', { ascending: false }),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (skillsRes.data) setSkills(skillsRes.data);
        if (projectsRes.data) setProjects(projectsRes.data);
        if (educationRes.data) setEducation(educationRes.data);
        if (achievementsRes.data) setAchievements(achievementsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <NetworkBackground />
      <Navbar />
      <main className="relative z-10">
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <EducationSection education={education} />
        <AchievementsSection achievements={achievements} />
        <ContactSection profile={profile} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;