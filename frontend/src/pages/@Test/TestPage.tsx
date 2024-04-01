import MainHeader from "@/components/@common/MainHeader";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import PublicToggle from "@/components/Record/PublicToggle";

import Trail from "@/components/@common/Trail"
import ComponetsTest from "./ComponetsTest";
import { recordState } from "@/store/Record/Records";

export default function TestPage() {
  interface BtnProps {
    path: string;
    name: string;
  }


  const Btn: React.FC<BtnProps> = ({ path, name }) => {
    const style = css({
      width: "100%",
      height: "40px",
    })
    return (
      <button css={style} onClick={()=>navigate(`/testdetail/${path}`)}>
        {name}
      </button>
    );
  }

  // [API]
  // lat: 위도, lon: 경도
  // const [lat, lon] = [37.506320759000715, 127.05368251210247];
  const navigate = useNavigate();

  // emotion
  const pageSetting = css({
    // height: "100%"
  })

  const trails = css({
    margin: "6vw 0",
    display: "inline-flex",
    flexDirection: "column",
    gap: "3.5vw",
    '@media(min-width: 430px)': {
      margin: "26px 0",
      gap: "16px",
    }
  })

  const btnArea = css({
    display: "inline-flex",
    margin: "0 6%",
    gap: "3%"
  })

  return (
    <div css={pageSetting}>
      <MainHeader title={"테스트 페이지"} />
      <PublicToggle isPublic={false} />
      <div css={trails}>
        <div style={{transform: "scale(0.5)",}}>
          <Trail 
            url={`/record/${1}`} 
            record={recordState}
          />
        </div>

        <div css={btnArea}>
          <Btn path={"text"} name={"상세테스트(text)"}></Btn>
          <Btn path={"img"} name={"상세테스트(image)"}></Btn>
          <Btn path={"none"} name={"상세테스트(none)"}></Btn>
        </div>
      </div>
      <ComponetsTest />
    </div>
  )
}