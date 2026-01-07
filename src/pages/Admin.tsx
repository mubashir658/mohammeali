import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { LogOut, Save, ArrowLeft, User, Briefcase, GraduationCap, Trophy, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate('/auth');
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) navigate('/auth');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      supabase.from('profile').select('*').limit(1).single().then(({ data }) => {
        if (data) setProfile(data);
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('profile').update(profile).eq('id', profile.id);
      if (error) throw error;
      toast({ title: 'Profile saved!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
          <Button onClick={handleSignOut} variant="ghost" className="gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <h1 className="text-3xl font-display font-bold gradient-text mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8 bg-secondary/30">
            <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> Profile</TabsTrigger>
            <TabsTrigger value="skills" className="gap-2"><Code className="w-4 h-4" /> Skills</TabsTrigger>
            <TabsTrigger value="projects" className="gap-2"><Briefcase className="w-4 h-4" /> Projects</TabsTrigger>
            <TabsTrigger value="education" className="gap-2"><GraduationCap className="w-4 h-4" /> Education</TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2"><Trophy className="w-4 h-4" /> Events</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-display font-semibold text-xl mb-4">Edit Profile</h2>
              {profile && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Name" value={profile.name || ''} onChange={(e) => setProfile({...profile, name: e.target.value})} className="bg-secondary/30" />
                    <Input placeholder="Location" value={profile.location || ''} onChange={(e) => setProfile({...profile, location: e.target.value})} className="bg-secondary/30" />
                    <Input placeholder="Email" value={profile.email || ''} onChange={(e) => setProfile({...profile, email: e.target.value})} className="bg-secondary/30" />
                    <Input placeholder="Headline" value={profile.headline || ''} onChange={(e) => setProfile({...profile, headline: e.target.value})} className="bg-secondary/30" />
                  </div>
                  <Input placeholder="Subheadline" value={profile.subheadline || ''} onChange={(e) => setProfile({...profile, subheadline: e.target.value})} className="bg-secondary/30" />
                  <Textarea placeholder="About Text" value={profile.about_text || ''} onChange={(e) => setProfile({...profile, about_text: e.target.value})} className="bg-secondary/30" rows={4} />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="GitHub URL" value={profile.github_url || ''} onChange={(e) => setProfile({...profile, github_url: e.target.value})} className="bg-secondary/30" />
                    <Input placeholder="LinkedIn URL" value={profile.linkedin_url || ''} onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})} className="bg-secondary/30" />
                    <Input placeholder="LeetCode URL" value={profile.leetcode_url || ''} onChange={(e) => setProfile({...profile, leetcode_url: e.target.value})} className="bg-secondary/30" />
                    <Input placeholder="Resume URL" value={profile.resume_url || ''} onChange={(e) => setProfile({...profile, resume_url: e.target.value})} className="bg-secondary/30" />
                  </div>
                  <Button onClick={handleSaveProfile} disabled={saving} className="btn-hero-primary">
                    <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-xl mb-4">Manage Skills</h2>
              <p className="text-muted-foreground">Skills management coming soon. Update skills directly in the database.</p>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-xl mb-4">Manage Projects</h2>
              <p className="text-muted-foreground">Project management coming soon. Update projects directly in the database.</p>
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-xl mb-4">Manage Education</h2>
              <p className="text-muted-foreground">Education management coming soon. Update education directly in the database.</p>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-xl mb-4">Manage Events & Achievements</h2>
              <p className="text-muted-foreground">Achievement management coming soon. Update achievements directly in the database.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;