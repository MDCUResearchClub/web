export default function Nav() {
  return (
      <nav className="w-full bg-gray-800 text-white py-2">
        <div className="flex items-center">
          <a href="/" rel="home" className="pr-2">
          <img src="/logo.svg" alt="{{ site_name }} {{ 'Logo'|t }}" className="w-8" />
          </a>

          <a href="/" title="Home" rel="home">MDCU Research Club</a>
            </div>
      </nav>
  );
}
