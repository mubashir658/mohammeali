import { motion } from 'framer-motion';
import { Brain, Code, Lightbulb } from 'lucide-react';

interface AboutSectionProps {
  profile: {
    about_text?: string;
    name?: string;
  } | null;
}

const highlights = [
  {
    icon: Brain,
    title: 'AI/ML Expertise',
    description: 'Building intelligent solutions with TensorFlow, Keras, and modern ML frameworks',
  },
  {
    icon: Lightbulb,
    title: 'Problem Solving',
    description: 'Strong foundation in Data Structures & Algorithms for efficient solutions',
  },
  {
    icon: Code,
    title: 'Full-Stack Development',
    description: 'Creating end-to-end web applications with React, Node.js, and modern tools',
  },
];

const AboutSection = ({ profile }: AboutSectionProps) => {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">Get to know me better</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <p className="text-muted-foreground text-lg leading-relaxed">
              {profile?.about_text || 
                `A passionate software engineering student at Keshav Memorial Institute of Technology, Hyderabad. 
                I specialize in AI/ML and full-stack development, with a strong foundation in problem-solving 
                and algorithmic thinking. I love transforming complex problems into elegant, efficient solutions 
                that make a real impact.`
              }
            </p>
          </motion.div>

          {/* Highlight Cards */}
          <div className="space-y-4">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 flex items-start gap-4 group hover:border-primary/50 transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold font-display text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;