import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  start_year: number;
  end_year?: number;
  grade?: string;
  description?: string;
}

interface EducationSectionProps {
  education: Education[];
}

const EducationSection = ({ education }: EducationSectionProps) => {
  // Sort by end_year descending (current first)
  const sortedEducation = [...education].sort((a, b) => {
    const yearA = a.end_year || 9999;
    const yearB = b.end_year || 9999;
    return yearB - yearA;
  });

  return (
    <section id="education" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">My academic journey</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20" />

            {sortedEducation.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-start gap-8 mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                  <div className="timeline-dot" />
                </div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="glass-card p-6 hover:border-primary/50 transition-all duration-300">
                    <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="p-2 rounded-lg bg-primary/10">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {edu.start_year} - {edu.end_year || 'Present'}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-lg mb-1">{edu.degree}</h3>
                    {edu.field && (
                      <p className="text-primary text-sm mb-2">{edu.field}</p>
                    )}
                    <p className="text-muted-foreground text-sm mb-2">{edu.institution}</p>
                    {edu.grade && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {edu.grade}
                      </span>
                    )}
                    {edu.description && (
                      <p className="text-muted-foreground text-sm mt-3">{edu.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;