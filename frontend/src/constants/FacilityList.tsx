import CafeIcon from "@/assets/Trail/CafeIcon.svg?react"
import CCTVIcon from "@/assets/Trail/CCTVIcon.svg?react"
import ConveniencestoreIcon from "@/assets/Trail/ConveniencestoreIcon.svg?react"
import PoliceIcon from "@/assets/Trail/PoliceIcon.svg?react"
import RestaurantIcon from "@/assets/Trail/RestaurantIcon.svg?react"
import ToiletIcon from "@/assets/Trail/ToiletIcon.svg?react"

export const FacilityList = [
  {
    name: "카페",
    key: 'cafe',
    icon: <CafeIcon />,
    bgColor: '#EAE33C'
  },
  {
    name: "음식점",
    key: 'restaurant',
    icon: <RestaurantIcon />,
    bgColor: '#FD8A37'
  },
  {
    name: "편의점",
    key: 'convenience',
    icon: <ConveniencestoreIcon />,
    bgColor: '#27D7A2'
  },
  {
    name: "화장실",
    key: 'toilet',
    icon: <ToiletIcon />,
    bgColor: '#8000FF'
  },
]

export const safetyFacilityList = [
  {
    name: "CCTV",
    key: 'cctv',
    icon: <CCTVIcon />,
    bgColor: '#505050'
  },
  {
    name: "치안",
    key: 'police',
    icon: <PoliceIcon />,
    bgColor: '#1285EF'
  },
]