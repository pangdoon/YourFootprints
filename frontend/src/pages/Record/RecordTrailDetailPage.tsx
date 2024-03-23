import DetailHeader from "@/components/@common/DetailHeader"
import { css } from "@emotion/react"
import "@/index.css"
import testImg from "@/assets/image/LoginPrint.png"
import { useParams, useNavigate } from "react-router-dom"
import * as React from 'react';
import { KebabMenu } from "@/components/Record/KebabMenu"
import { Review } from "@/components/Record/Review"
import { Stars } from "@/components/Record/Stars"
import { TrailHeader } from "@/components/Record/TrailHeader"

// 기록 상세 페이지
export default function RecordTrailDetailPage() {
  const navigate = useNavigate();
  
  const {id: recordId} = useParams();
  console.log(recordId)
  
  // const {id} = useParams();
  // const recordId = Number(id);

  const [value] = React.useState<number | null>(2 /* [API] 별점 */);

  return(
    <div css={page}>
      <DetailHeader title={"내 발자취"} content={<KebabMenu />} />
      <TrailHeader title={"산책로 이름"} date={"2024.03.06 20:46"} isPublic={false} />

      <div>  {/* 내용 */}
        {/* [API] */}
        {/* FIXME navigate 지도클릭 페이지(피그마 참고) */}
        <img css={style.map} src={testImg} onClick={()=>{ navigate("") }} />  {/* 지도이미지 */}

        {/* FIXME 공통컴포넌트에서 가져올 부분 */}
        <div css={style.recordInfo}>  {/* 시간, 거리, 동네 */}
          <div>시간</div>
          <div>거리</div>
          <div>동네</div>
          <div>(들어갈공간)</div>
        </div>

        <div css={style.bar}/>  {/* 회색 바 */}

        {/* [API] */}
        <div css={reviews.box}>  {/* 산책 리뷰 */}
          <Review title={"산책평가"} content={<Stars type={"read"} star={value}/>} />
          <Review title={"메모"} content={
          <div css={reviews.memo}>
            {"산책리뷰".repeat(30)}
          </div>} />
        </div>
      </div>
    </div>
  )
}


/* emotion */
const page = css({
  paddingBottom: "84px",
})

// 산책리뷰
const reviews = {
  box: css({
    padding: "0 3.5%",
    display: "flex",
    flexDirection: "column",
    gap: "8vw",
    '@media(min-width: 430px)': {
      gap: "36px",
    },
  }), 

  memo: css({
    width: "100%",
    minHeight: "25vw",
    maxHeight: "50vw",
    overflow: "scroll",
    border: "1px solid var(--gray-100)",
    borderRadius: "10px",
    padding: "3.5vw",
    boxSizing: "border-box",
    textAlign: "left",
    fontSize: "2.8vw",
    '@media(min-width: 430px)': {
      minHeight: "110px",
      maxHeight: "220px",
      padding: "15px",
      fontSize: "12px",
    },
  }),
}

const style = {
  // 지도 이미지
  map: css({
    width: "100%",
    height: "80vw",
    objectFit: "cover",
    '@media(min-width: 430px)': {
      height: "350px",
    }
  }),

  // 시간 거리 동네
  recordInfo: css({
    display: "flex",
    height: "20vw",
    justifyContent: "center",
    alignItems: "center",
    gap: "3.7vw",
    '@media(min-width: 430px)': {
      height: "96px",
      gap: "16px",
    },
  }),

  // 회색 바
  bar: css({
    width: "100%",
    height: "2.3vw",
    marginBottom: "5.8vw",
    // FIXME index.css에 있는 색으로 쓰기엔 너무 진함..
    // background: "var(--gray-100)",
    background: "#eeeeee",
    '@media(min-width: 430px)': {
      height: "10px",
      marginBottom: "25px",
    },
  }),
}