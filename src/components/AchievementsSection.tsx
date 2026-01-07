import { motion } from 'framer-motion';
import { Trophy, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Achievement {
  id: string;
  title: string;
  description: string;
  event_name?: string;
  date?: string;
  certificate_url?: string;
}

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const AchievementsSection = ({ achievements }: AchievementsSectionProps) => {
  return (
    <section id="events" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Events & Achievements</h2>
          <p className="section-subtitle">Hackathons, competitions, and more</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-6 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                  <Trophy className="w-6 h-6 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg mb-1">{achievement.title}</h3>
                  {achievement.event_name && (
                    <p className="text-primary text-sm mb-2">{achievement.event_name}</p>
                  )}
                  <p className="text-muted-foreground text-sm mb-3">{achievement.description}</p>
                  
                  <div className="flex items-center justify-between">
                    {achievement.date && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(achievement.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    )}
                    {achievement.certificate_url && (
                      <Button asChild size="sm" variant="ghost" className="gap-2">
                        <a href={achievement.certificate_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                          Certificate
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;