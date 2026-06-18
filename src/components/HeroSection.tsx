import { motion } from 'framer-motion';
import { Mail, Download, Github, Linkedin, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import profilePhoto from '@/assets/profile-photo.png';

interface HeroSectionProps {
  profile: {
    name: string;
    headline: string;
    subheadline: string;
    location: string;
    github_url?: string;
    linkedin_url?: string;
    email?: string;
    resume_url?: string;
    avatar_url?: string;
  } | null;
}

const HeroSection = ({ profile }: HeroSectionProps) => {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getResumeDownloadUrl = (url: string) => {
    const match = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
    if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    return url;
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 justify-center md:justify-start mb-4"
            >
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground text-sm">{profile?.location || 'Hyderabad, India'}</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-4">
              {profile?.name || 'Mohammed Mubashir Ali'}
            </h1>

            <h2 className="text-xl md:text-2xl lg:text-3xl font-display gradient-text mb-4">
              {profile?.headline || 'Software Engineer | AI Enthusiast'}
            </h2>

            <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto md:mx-0">
              {profile?.subheadline || 'Transforming ideas into intelligent solutions with AI & Modern Web Technologies'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
              <Button onClick={scrollToContact} className="btn-hero-primary">
                <Mail className="w-4 h-4 mr-2" />
                Hire Me
              </Button>
              {profile?.resume_url && (
                <Button asChild variant="outline" className="btn-hero-secondary">
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </a>
                </Button>
              )}
              {!profile?.resume_url && (
                <Button variant="outline" className="btn-hero-secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center md:justify-start">
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 glass-card hover:bg-primary/20 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 glass-card hover:bg-primary/20 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-3 glass-card hover:bg-primary/20 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
              {!profile?.github_url && !profile?.linkedin_url && (
                <>
                  <div className="p-3 glass-card"><Github className="w-5 h-5" /></div>
                  <div className="p-3 glass-card"><Linkedin className="w-5 h-5" /></div>
                  <div className="p-3 glass-card"><Mail className="w-5 h-5" /></div>
                </>
              )}
            </div>
          </motion.div>

          {/* Avatar/Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden glass-card p-1">
                <img
                  src={profilePhoto}
                  alt={profile?.name || 'Mohammed Mubashir Ali'}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse-glow" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse-glow" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;