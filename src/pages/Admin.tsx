import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { LogOut, Save, ArrowLeft, User, Briefcase, GraduationCap, Trophy, Code, Plus, Trash2, Edit2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePageMeta } from '@/hooks/use-page-meta';

const ADMIN_EMAIL = 'mohammedmubashirali658@gmail.com';

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  usePageMeta({
    title: 'Admin Dashboard | Mohammed Mubashir Ali',
    description: 'Private admin dashboard to manage portfolio content for Mohammed Mubashir Ali.',
    canonical: 'https://mohammeali.lovable.app/admin',
  });

  // Form states
  const [skillForm, setSkillForm] = useState({ name: '', category: '', icon: '' });
  const [projectForm, setProjectForm] = useState({ title: '', description: '', tech_stack: '', github_url: '', live_url: '', image_url: '', featured: false });
  const [educationForm, setEducationForm] = useState({ institution: '', degree: '', field: '', start_year: '', end_year: '', grade: '', description: '' });
  const [achievementForm, setAchievementForm] = useState({ title: '', description: '', event_name: '', date: '', certificate_url: '' });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session || session.user.email !== ADMIN_EMAIL) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.email !== ADMIN_EMAIL) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    const [profileRes, skillsRes, projectsRes, educationRes, achievementsRes] = await Promise.all([
      supabase.from('profile').select('*').limit(1).single(),
      supabase.from('skills').select('*').order('category'),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('education').select('*').order('start_year', { ascending: false }),
      supabase.from('achievements').select('*').order('date', { ascending: false }),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (skillsRes.data) setSkills(skillsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    if (educationRes.data) setEducation(educationRes.data);
    if (achievementsRes.data) setAchievements(achievementsRes.data);
  };

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

  // SKILLS CRUD
  const handleAddSkill = async () => {
    try {
      const { error } = await supabase.from('skills').insert({ ...skillForm });
      if (error) throw error;
      toast({ title: 'Skill added!' });
      setSkillForm({ name: '', category: '', icon: '' });
      setDialogOpen(null);
      fetchAllData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateSkill = async (id: string) => {
    try {
      const { error } = await supabase.from('skills').update(skillForm).eq('id', id);
      if (error) throw error;
      toast({ title: 'Skill updated!' });
      setEditingId(null);
      setSkillForm({ name: '', category: '', icon: '' });
      fetchAllData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Skill deleted!' });
      fetchAllData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // PROJECTS CRUD
  const handleAddProject = async () => {
    try {
      const techStack = projectForm.tech_stack.split(',').map(t => t.trim()).filter(Boolean);
      const { error } = await supabase.from('projects').insert({ 
        ...projectForm, 
        tech_stack: techStack 
      });
      if (error) throw error;
      toast({ title: 'Project added!' });
      setProjectForm({ title: '', description: '', tech_stack: '', github_url: '', live_url: '', image_url: '', featured: false });
      setDialogOpen(null);
      fetchAllData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateProject = async (id: string) => {
    try {
      const techStack = projectForm.tech_stack.split(',').map(t => t.trim()).filter(Boolean);
      const { error } = await supabase.from('projects').update({ 
        ...projectForm, 
        tech_stack: techStack 
      }).eq('id', id);
      if (error) throw error;
      toast({ title: 'Project updated!' });
      setEditingId(null);
      setProjectForm({ title: '', description: '', tech_stack: '', github_url: '', live_url: '', image_url: '', featured: false });
      fetchAllData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Project deleted!' });
      fetchAllData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // EDUCATION CRUD
  const handleAddEducation = async () => {
    try {
      const { error } = await supabase.from('education').insert({
        ...educationForm,
        start_year: parseInt(educationForm.start_year),
        end_year: educationForm.end_year ? parseInt(educationForm.end_year) : null,
      });
      if (error) throw error;
      toast({ title: 'Education added!' });
      setEducationForm({ institution: '', degree: '', field: '', start_year: '', end_year: '', grade: '', description: '' });
      setDialogOpen(null);
      fetchAllData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateEducation = async (id: string) => {
    try {
      const { error } = await supabase.from('education').update({
        ...educationForm,
        start_year: parseInt(educationForm.start_year),
        end_year: educationForm.end_year ? parseInt(educationForm.end_year) : null,
      }).eq('id', id);
      if (error) throw error;
      toast({ title: 'Education updated!' });
      setEditingId(null);
      setEducationForm({ institution: '', degree: '', field: '', start_year: '', end_year: '', grade: '', description: '' });
      fetchAllData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Delete this education?')) return;
    try {
      const { error } = await supabase.from('education').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Education deleted!' });
      fetchAllData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // ACHIEVEMENTS CRUD
  const handleAddAchievement = async () => {
    try {
      const { error } = await supabase.from('achievements').insert(achievementForm);
      if (error) throw error;
      toast({ title: 'Achievement added!' });
      setAchievementForm({ title: '', description: '', event_name: '', date: '', certificate_url: '' });
      setDialogOpen(null);
      fetchAllData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateAchievement = async (id: string) => {
    try {
      const { error } = await supabase.from('achievements').update(achievementForm).eq('id', id);
      if (error) throw error;
      toast({ title: 'Achievement updated!' });
      setEditingId(null);
      setAchievementForm({ title: '', description: '', event_name: '', date: '', certificate_url: '' });
      fetchAllData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm('Delete this achievement?')) return;
    try {
      const { error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Achievement deleted!' });
      fetchAllData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const startEditing = (type: string, item: any) => {
    setEditingId(item.id);
    if (type === 'skill') {
      setSkillForm({ name: item.name, category: item.category, icon: item.icon || '' });
    } else if (type === 'project') {
      setProjectForm({
        title: item.title,
        description: item.description,
        tech_stack: item.tech_stack?.join(', ') || '',
        github_url: item.github_url || '',
        live_url: item.live_url || '',
        image_url: item.image_url || '',
        featured: item.featured || false,
      });
    } else if (type === 'education') {
      setEducationForm({
        institution: item.institution,
        degree: item.degree,
        field: item.field || '',
        start_year: item.start_year.toString(),
        end_year: item.end_year?.toString() || '',
        grade: item.grade || '',
        description: item.description || '',
      });
    } else if (type === 'achievement') {
      setAchievementForm({
        title: item.title,
        description: item.description,
        event_name: item.event_name || '',
        date: item.date || '',
        certificate_url: item.certificate_url || '',
      });
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setSkillForm({ name: '', category: '', icon: '' });
    setProjectForm({ title: '', description: '', tech_stack: '', github_url: '', live_url: '', image_url: '', featured: false });
    setEducationForm({ institution: '', degree: '', field: '', start_year: '', end_year: '', grade: '', description: '' });
    setAchievementForm({ title: '', description: '', event_name: '', date: '', certificate_url: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const groupedSkills = skills.reduce((acc: any, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
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
            <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4 hidden sm:block" /> Profile</TabsTrigger>
            <TabsTrigger value="skills" className="gap-2"><Code className="w-4 h-4 hidden sm:block" /> Skills</TabsTrigger>
            <TabsTrigger value="projects" className="gap-2"><Briefcase className="w-4 h-4 hidden sm:block" /> Projects</TabsTrigger>
            <TabsTrigger value="education" className="gap-2"><GraduationCap className="w-4 h-4 hidden sm:block" /> Education</TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2"><Trophy className="w-4 h-4 hidden sm:block" /> Events</TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
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

          {/* SKILLS TAB */}
          <TabsContent value="skills">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-xl">Manage Skills</h2>
                <Dialog open={dialogOpen === 'skill'} onOpenChange={(open) => setDialogOpen(open ? 'skill' : null)}>
                  <DialogTrigger asChild>
                    <Button className="gap-2"><Plus className="w-4 h-4" /> Add Skill</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Skill</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Skill Name" value={skillForm.name} onChange={(e) => setSkillForm({...skillForm, name: e.target.value})} />
                      <Input placeholder="Category (e.g., Languages, Frameworks)" value={skillForm.category} onChange={(e) => setSkillForm({...skillForm, category: e.target.value})} />
                      <Input placeholder="Icon (optional)" value={skillForm.icon} onChange={(e) => setSkillForm({...skillForm, icon: e.target.value})} />
                      <Button onClick={handleAddSkill} className="w-full">Add Skill</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {Object.keys(groupedSkills).map((category) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-primary mb-3">{category}</h3>
                  <div className="grid gap-2">
                    {groupedSkills[category].map((skill: any) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        {editingId === skill.id ? (
                          <div className="flex-1 flex gap-2 mr-2">
                            <Input placeholder="Name" value={skillForm.name} onChange={(e) => setSkillForm({...skillForm, name: e.target.value})} className="flex-1" />
                            <Input placeholder="Category" value={skillForm.category} onChange={(e) => setSkillForm({...skillForm, category: e.target.value})} className="flex-1" />
                            <Button size="sm" onClick={() => handleUpdateSkill(skill.id)}><Save className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={cancelEditing}><X className="w-4 h-4" /></Button>
                          </div>
                        ) : (
                          <>
                            <span>{skill.name}</span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => startEditing('skill', skill)}><Edit2 className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteSkill(skill.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-xl">Manage Projects</h2>
                <Dialog open={dialogOpen === 'project'} onOpenChange={(open) => setDialogOpen(open ? 'project' : null)}>
                  <DialogTrigger asChild>
                    <Button className="gap-2"><Plus className="w-4 h-4" /> Add Project</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add New Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      <Input placeholder="Title" value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})} />
                      <Textarea placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} />
                      <Input placeholder="Tech Stack (comma separated)" value={projectForm.tech_stack} onChange={(e) => setProjectForm({...projectForm, tech_stack: e.target.value})} />
                      <Input placeholder="GitHub URL" value={projectForm.github_url} onChange={(e) => setProjectForm({...projectForm, github_url: e.target.value})} />
                      <Input placeholder="Live URL" value={projectForm.live_url} onChange={(e) => setProjectForm({...projectForm, live_url: e.target.value})} />
                      <Input placeholder="Image URL" value={projectForm.image_url} onChange={(e) => setProjectForm({...projectForm, image_url: e.target.value})} />
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})} />
                        Featured Project
                      </label>
                      <Button onClick={handleAddProject} className="w-full">Add Project</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 bg-secondary/30 rounded-lg">
                    {editingId === project.id ? (
                      <div className="space-y-3">
                        <Input placeholder="Title" value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})} />
                        <Textarea placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} />
                        <Input placeholder="Tech Stack (comma separated)" value={projectForm.tech_stack} onChange={(e) => setProjectForm({...projectForm, tech_stack: e.target.value})} />
                        <Input placeholder="GitHub URL" value={projectForm.github_url} onChange={(e) => setProjectForm({...projectForm, github_url: e.target.value})} />
                        <Input placeholder="Live URL" value={projectForm.live_url} onChange={(e) => setProjectForm({...projectForm, live_url: e.target.value})} />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleUpdateProject(project.id)}><Save className="w-4 h-4 mr-2" /> Save</Button>
                          <Button size="sm" variant="ghost" onClick={cancelEditing}><X className="w-4 h-4 mr-2" /> Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{project.title} {project.featured && <span className="text-xs bg-primary/20 px-2 py-1 rounded ml-2">Featured</span>}</h3>
                          <p className="text-sm text-muted-foreground">{project.description.substring(0, 100)}...</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.tech_stack?.map((tech: string, i: number) => (
                              <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">{tech}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => startEditing('project', project)}><Edit2 className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteProject(project.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* EDUCATION TAB */}
          <TabsContent value="education">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-xl">Manage Education</h2>
                <Dialog open={dialogOpen === 'education'} onOpenChange={(open) => setDialogOpen(open ? 'education' : null)}>
                  <DialogTrigger asChild>
                    <Button className="gap-2"><Plus className="w-4 h-4" /> Add Education</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Education</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Institution" value={educationForm.institution} onChange={(e) => setEducationForm({...educationForm, institution: e.target.value})} />
                      <Input placeholder="Degree" value={educationForm.degree} onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})} />
                      <Input placeholder="Field of Study" value={educationForm.field} onChange={(e) => setEducationForm({...educationForm, field: e.target.value})} />
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Start Year" type="number" value={educationForm.start_year} onChange={(e) => setEducationForm({...educationForm, start_year: e.target.value})} />
                        <Input placeholder="End Year" type="number" value={educationForm.end_year} onChange={(e) => setEducationForm({...educationForm, end_year: e.target.value})} />
                      </div>
                      <Input placeholder="Grade/CGPA" value={educationForm.grade} onChange={(e) => setEducationForm({...educationForm, grade: e.target.value})} />
                      <Textarea placeholder="Description" value={educationForm.description} onChange={(e) => setEducationForm({...educationForm, description: e.target.value})} />
                      <Button onClick={handleAddEducation} className="w-full">Add Education</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 bg-secondary/30 rounded-lg">
                    {editingId === edu.id ? (
                      <div className="space-y-3">
                        <Input placeholder="Institution" value={educationForm.institution} onChange={(e) => setEducationForm({...educationForm, institution: e.target.value})} />
                        <Input placeholder="Degree" value={educationForm.degree} onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})} />
                        <Input placeholder="Field" value={educationForm.field} onChange={(e) => setEducationForm({...educationForm, field: e.target.value})} />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Start Year" type="number" value={educationForm.start_year} onChange={(e) => setEducationForm({...educationForm, start_year: e.target.value})} />
                          <Input placeholder="End Year" type="number" value={educationForm.end_year} onChange={(e) => setEducationForm({...educationForm, end_year: e.target.value})} />
                        </div>
                        <Input placeholder="Grade" value={educationForm.grade} onChange={(e) => setEducationForm({...educationForm, grade: e.target.value})} />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleUpdateEducation(edu.id)}><Save className="w-4 h-4 mr-2" /> Save</Button>
                          <Button size="sm" variant="ghost" onClick={cancelEditing}><X className="w-4 h-4 mr-2" /> Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                          <p className="text-primary">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground">{edu.start_year} - {edu.end_year || 'Present'} {edu.grade && `• ${edu.grade}`}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => startEditing('education', edu)}><Edit2 className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteEducation(edu.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ACHIEVEMENTS TAB */}
          <TabsContent value="achievements">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-xl">Manage Events & Achievements</h2>
                <Dialog open={dialogOpen === 'achievement'} onOpenChange={(open) => setDialogOpen(open ? 'achievement' : null)}>
                  <DialogTrigger asChild>
                    <Button className="gap-2"><Plus className="w-4 h-4" /> Add Achievement</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Achievement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Title" value={achievementForm.title} onChange={(e) => setAchievementForm({...achievementForm, title: e.target.value})} />
                      <Textarea placeholder="Description" value={achievementForm.description} onChange={(e) => setAchievementForm({...achievementForm, description: e.target.value})} />
                      <Input placeholder="Event Name" value={achievementForm.event_name} onChange={(e) => setAchievementForm({...achievementForm, event_name: e.target.value})} />
                      <Input placeholder="Date" type="date" value={achievementForm.date} onChange={(e) => setAchievementForm({...achievementForm, date: e.target.value})} />
                      <Input placeholder="Certificate URL" value={achievementForm.certificate_url} onChange={(e) => setAchievementForm({...achievementForm, certificate_url: e.target.value})} />
                      <Button onClick={handleAddAchievement} className="w-full">Add Achievement</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 bg-secondary/30 rounded-lg">
                    {editingId === achievement.id ? (
                      <div className="space-y-3">
                        <Input placeholder="Title" value={achievementForm.title} onChange={(e) => setAchievementForm({...achievementForm, title: e.target.value})} />
                        <Textarea placeholder="Description" value={achievementForm.description} onChange={(e) => setAchievementForm({...achievementForm, description: e.target.value})} />
                        <Input placeholder="Event Name" value={achievementForm.event_name} onChange={(e) => setAchievementForm({...achievementForm, event_name: e.target.value})} />
                        <Input placeholder="Date" type="date" value={achievementForm.date} onChange={(e) => setAchievementForm({...achievementForm, date: e.target.value})} />
                        <Input placeholder="Certificate URL" value={achievementForm.certificate_url} onChange={(e) => setAchievementForm({...achievementForm, certificate_url: e.target.value})} />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleUpdateAchievement(achievement.id)}><Save className="w-4 h-4 mr-2" /> Save</Button>
                          <Button size="sm" variant="ghost" onClick={cancelEditing}><X className="w-4 h-4 mr-2" /> Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          {achievement.event_name && <p className="text-primary text-sm">{achievement.event_name}</p>}
                          <p className="text-sm text-muted-foreground">{achievement.description.substring(0, 100)}...</p>
                          {achievement.date && <p className="text-xs text-muted-foreground mt-1">{new Date(achievement.date).toLocaleDateString()}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => startEditing('achievement', achievement)}><Edit2 className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteAchievement(achievement.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
