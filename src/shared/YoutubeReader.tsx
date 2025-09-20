const YouTubeEmbed: React.FC<{ src: string }> = ({ src }) => (
  <div className="w-full h-full">
    <iframe
      key={src}
      src={src}
      className="w-full h-full rounded-lg"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  </div>
);

export default YouTubeEmbed;
