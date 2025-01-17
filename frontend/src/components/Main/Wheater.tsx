import { useQuery } from "@tanstack/react-query";
import { fetchWheater } from "@/services/UserService";
import ClearIcon from "@/assets/Weather/ClearIcon.svg";
import CloudsIcon from "@/assets/Weather/CloudsIcon.svg";
import RainIcon from "@/assets/Weather/RainIcon.svg";
import { css } from "@emotion/react";
import { useEffect } from "react";

const WheaterIcon = [
  {
    name: "Clear",
    icon: ClearIcon,
  },
  {
    name: "Clouds",
    icon: CloudsIcon,
  },
  {
    name: "Rain",
    icon: RainIcon,
  },
];

const wheaterCss = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "3px",
});
interface props {
  lat: number;
  lon: number;
  handleChangeCurrentWeather: (value: string) => void;
}
export default function Wheater({
  lat,
  lon,
  handleChangeCurrentWeather,
}: props) {
  const { data, isLoading } = useQuery({
    queryKey: ["wheater"],
    queryFn: () => fetchWheater(lat, lon),
    staleTime: 20 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (data && data.data.weather[0]) {
      handleChangeCurrentWeather(data.data.weather[0].main);
    }
  }, [data, handleChangeCurrentWeather]);

  if (isLoading) {
    return <div></div>;
  }
  let imgurl: string = "";
  WheaterIcon.forEach((icon) => {
    if (data?.data.weather[0].main.includes(icon.name)) {
      imgurl = icon.icon;
    }
  });
  const tmp = (data?.data.main.temp - 273.15).toFixed(1);

  return (
    <div css={[wheaterCss]}>
      <img
        src={imgurl}
        css={[{ filter: "drop-shadow(1px 1px 4px var(--black))" }]}
      />
      <div
        css={[
          {
            fontSize: "1.125rem",
            fontFamily: "exBold",
            color: "var(--white)",
            textShadow: "1px 1px 7px var(--black)",
          },
        ]}
      >
        {tmp}˚
      </div>
    </div>
  );
}
