export default function Footer() {
  return (
    <footer className="bg-[#0C0C0C] text-white py-6 z-10">
      <div className="container mx-auto text-center">
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-4">
          <a href="#about" className="hover:underline">
            عنّا
          </a>
          <a href="#help" className="hover:underline">
            المساعدة
          </a>
          <a href="#terms" className="hover:underline">
            الشروط
          </a>
          <a href="#privacy" className="hover:underline">
            الخصوصية
          </a>
        </div>
        <p className="text-sm text-[#6B737D]">جميع الحقوق محفوظة © 2024</p>
      </div>
    </footer>
  );
}
