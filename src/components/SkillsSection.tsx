import { motion } from 'framer-motion';

interface Skill {
  id: string;
  category: string;
  name: string;
}

interface SkillsSectionProps {
  skills: Skill[];
}

const categoryColors: Record<string, string> = {
  'Programming Languages': 'from-violet-500 to-purple-600',
  'Web Development': 'from-cyan-500 to-blue-600',
  'AI/ML & Data Science': 'from-emerald-500 to-teal-600',
  'Core Computer Science': 'from-amber-500 to-orange-600',
  'Tools & Technologies': 'from-pink-500 to-rose-600',
};

const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = Object.keys(groupedSkills);

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">Technologies I work with</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="glass-card p-6 group hover:border-primary/50 transition-all duration-300"
            >
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 bg-gradient-to-r ${categoryColors[category] || 'from-primary to-accent'} text-white`}>
                {category}
              </div>
              <div className="flex flex-wrap gap-2">
                {groupedSkills[category].map((skill) => (
                  <span
                    key={skill.id}
                    className="skill-badge"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;