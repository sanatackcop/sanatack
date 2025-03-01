const Partners = () => {
  const partners = ['Brave', 'Circle', 'Discord', 'Google', 'Jump', 'Lollapalooza', 'Magic Eden'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center flex-wrap gap-8">
        {partners.map((partner) => (
          <div
            key={partner}
            className="text-gray-400 text-xl font-semibold hover:text-gray-300 transition-colors"
          >
            {partner}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;