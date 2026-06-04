import RouteCard from "./RouteCard";
import { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

import calgaryImg from "../../assets/calgary.jpg";
import edmontonImg from "../../assets/edmonton.jpg";
import ottawaImg from "../../assets/ottawa.jpg";
import torontoImg from "../../assets/toronto.jpg";
import banffImg from "../../assets/banff.jpg";

const RoutesSection = ({ openSchedules }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.en;

  const routes = [
    { from: "Calgary", to: "Edmonton", price: 90, trips: ["07:00 AM", "09:00 AM", "03:00 PM", "05:00 PM"], duration: "3h", image: calgaryImg, disabled: false },
    { from: "Edmonton", to: "Calgary", price: 90, trips: ["11:00 AM", "01:00 PM", "07:00 PM", "09:00 AM"], duration: "3h", image: edmontonImg, disabled: false },
    { from: "Ottawa", to: "Toronto", price: 90, trips: [t.comingSoon], duration: "3h", image: ottawaImg, disabled: true },
    { from: "Toronto", to: "Ottawa", price: 90, trips: [t.comingSoon], duration: "3h", image: torontoImg, disabled: true },
    { from: "Calgary", to: "Banff", price: 90, trips: [t.comingSoon], duration: "1h 30min", image: banffImg, disabled: true },
  ];

  return (
    <section className="routes-section">
      <div className="routes-grid">
        {routes.map((route, index) => (
          <RouteCard
            key={index}
            from={route.from}
            to={route.to}
            price={route.price}
            trips={route.trips}
            duration={route.duration}
            image={route.image}
            disabled={route.disabled}
            openSchedules={openSchedules}
          />
        ))}
      </div>
    </section>
  );
};

export default RoutesSection;