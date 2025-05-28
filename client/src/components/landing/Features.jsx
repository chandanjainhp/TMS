export default function Features() {
    const features = [
      {
        name: 'Student Management',
        description: 'Easily track and manage student records, attendance, and performance.',
        icon: '📊'
      },
      {
        name: 'Teacher Portal',
        description: 'Dedicated portal for teachers to manage classes and assignments.',
        icon: '👩‍🏫'
      },
      {
        name: 'Admin Dashboard',
        description: 'Powerful admin tools to oversee institution operations.',
        icon: '⚙️'
      },
      {
        name: 'Customizable',
        description: 'Tailor the system to your specific needs.',
        icon: '🛠️'
      }
    ];
  
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to manage your institution
            </p>
          </div>
  
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 mx-auto rounded-md bg-indigo-500 text-white text-xl">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }