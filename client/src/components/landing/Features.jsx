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
      description: 'Comprehensive tracking of student records, attendance histories, and academic performance metrics in one secure place.',
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      color: 'bg-indigo-100'
    },
    {
      name: 'Teacher Portal',
      description: 'Dedicated workspace for educators to manage classes, grade assignments, and communicate with students effectively.',
      icon: <GraduationCap className="h-6 w-6 text-violet-600" />,
      color: 'bg-violet-100'
    },
    {
      name: 'Admin Dashboard',
      description: 'Powerful analytical tools and administrative controls to oversee institution operations and make data-driven decisions.',
      icon: <LayoutDashboard className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      name: 'Advanced Analytics',
      description: 'visualize performance trends and operational metrics with real-time charts.',
      icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
      color: 'bg-emerald-100'
    },
    {
      name: 'Secure Data',
      description: 'Enterprise-grade security measures to protect sensitive student and institutional data.',
      icon: <ShieldCheck className="h-6 w-6 text-rose-600" />,
      color: 'bg-rose-100'
    },
    {
      name: 'Communication',
      description: 'Integrated messaging system for seamless interaction between administration, teachers, and students.',
      icon: <MessagesSquare className="h-6 w-6 text-amber-600" />,
      color: 'bg-amber-100'
    },
    {
      name: 'Scheduling',
      description: 'Smart calendar and timetable management for classes, exams, and events.',
      icon: <Calendar className="h-6 w-6 text-cyan-600" />,
      color: 'bg-cyan-100'
    },
    {
      name: 'Customizable Settings',
      description: 'Tailor the system to your specific institutional needs with flexible configuration options.',
      icon: <Settings className="h-6 w-6 text-slate-600" />,
      color: 'bg-slate-100'
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="py-24 bg-gray-50 relative overflow-hidden" id="features">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
        <div className="absolute top-[20%] right-[5%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-indigo-100 to-transparent blur-3xl" />
        <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-gradient-to-tr from-purple-100 to-transparent blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:text-center mb-16">
          <p className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Core Features</p>
          <h2 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to run your institution
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            A complete ecosystem of tools designed to modernize educational management.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className={`flex items-center justify-center h-14 w-14 rounded-xl ${feature.color} transition-transform group-hover:scale-110 duration-300 mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {feature.name}
              </h3>
              <p className="mt-2 text-base text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}