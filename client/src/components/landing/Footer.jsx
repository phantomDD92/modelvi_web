const Footer = () => {
  return (
    <footer>
      <div className="py-4">
        <div className="container flex h-full flex-wrap items-center justify-around text-center md:justify-between md:text-start">
          <span className="text-base text-default-900">
            {new Date().getFullYear()} © Modelvi
          </span>
          <span className="text-base text-default-900">
            Created by Gigant
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
