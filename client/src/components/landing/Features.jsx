import { motion } from 'framer-motion';
import {
  BarChart3,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
  Calendar,
  ShieldCheck,
  MessagesSquare
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      name: 'Student Management',
      description: 'Comprehensive tracking of student records, attendance histories, and academic performance metrics.',
      icon: <Users className="h-8 w-8 text-indigo-400" />,
      color: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      name: 'Teacher Portal',
      description: 'Dedicated workspace for educators to manage classes, grade assignments, and communicate effectively.',
      icon: <GraduationCap className="h-8 w-8 text-violet-400" />,
      color: 'bg-violet-500/10 border-violet-500/20'
    },
    {
      name: 'Admin Dashboard',
      description: 'Powerful analytical tools and controls to oversee institution operations and make data-driven decisions.',
      icon: <LayoutDashboard className="h-8 w-8 text-blue-400" />,
      color: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      name: 'Advanced Analytics',
      description: 'Visualize performance trends and operational metrics with real-time interactive charts.',
      icon: <BarChart3 className="h-8 w-8 text-emerald-400" />,
      color: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      name: 'Secure Data',
      description: 'Enterprise-grade security measures including encryption to protect sensitive student data.',
      icon: <ShieldCheck className="h-8 w-8 text-rose-400" />,
      color: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      name: 'Communication',
      description: 'Integrated messaging system for seamless interaction between administration, teachers, and students.',
      icon: <MessagesSquare className="h-8 w-8 text-amber-400" />,
      color: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      name: 'Scheduling',
      description: 'Smart automatic calendar and timetable management for classes, exams, and events.',
      icon: <Calendar className="h-8 w-8 text-cyan-400" />,
      color: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      name: 'Customizable Settings',
      description: 'Tailor the system to your specific institutional needs with flexible configuration options.',
      icon: <Settings className="h-8 w-8 text-slate-400" />,
      color: 'bg-slate-500/10 border-slate-500/20'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="py-32 bg-slate-900 relative overflow-hidden" id="features">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[5%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-purple-900/20 blur-[100px]" />
      </div>

      <div className="w-full px-6 sm:px-12 lg:px-16 mx-auto relative z-10">
        <div className="mb-24 md:text-center max-w-3xl mx-auto">
          <p className="text-indigo-400 font-semibold tracking-wider uppercase mb-3">Core Capabilities</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Everything you need to run your institution
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            A complete ecosystem of tools designed to modernize educational management and streamline your daily operations.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-2xl ${feature.color} mb-6 transition-transform group-hover:scale-110 duration-500`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                {feature.name}
              </h3>
              <p className="text-slate-400 leading-relaxed text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}