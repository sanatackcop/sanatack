const Courses = () => {
  const courses = [
    { title: 'تصميم النظام', subtitle: 'System Design' },
    { title: 'هندسة الذكاء الاصطناعي', subtitle: 'AI Engineering' },
    { title: 'هندسة البرمجيات', subtitle: 'Software Engineering' },
    { title: 'هندسة البيانات', subtitle: 'Data Engineering' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.title}
            className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <h3 className="text-white text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-400">{course.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;