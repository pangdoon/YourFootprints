import DetailHeader from "@/components/@common/DetailHeader";
import { css } from "@emotion/react";
import "@/index.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'
import KebabIcon from "@/components/Record/KebabIcon";
import KebabMenu from "@/components/Record/KebabMenu";
import { TrailHeader } from "@/components/Record/TrailHeader";
import ShareModal from "@components/Record/ShareModal";
import RecordFootInfos from "@/components/Record/RecordFootInfos";
import GrayBar from "@/components/@common/GrayBar";
import Reviews from "@/components/Record/Reviews";
import { getRecordDetail } from "@/services/Record";
import { recordState, RecordDetailType, RecordContext } from "@/store/Record/RecordDetail";
import { KebabContext } from "@/store/Record/Kebab";

// 기록 상세 페이지
export default function RecordTrailDetailPage() {
  const {id: recordId} = useParams();
  const navigate = useNavigate();
  const [openKebabMenu, setOpenKebabMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [record, setRecord] = useState<RecordDetailType>(recordState);

  async function fetchRecordDetail() {
    try {
      const recordData = await getRecordDetail(recordId);
      setRecord(recordData);
      console.log(recordData)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(()=>{
    fetchRecordDetail();
  },[])


  return(
    <div css={page}>
      <KebabContext.Provider value={{openKebabMenu, setOpenKebabMenu, showModal, setShowModal}}>
        <DetailHeader title={"내 발자취"} backURL={"/record"} content={<KebabIcon />} />
        {openKebabMenu?<KebabMenu />:<></>}
        {showModal?<ShareModal />:<></>}
      </KebabContext.Provider>

      <RecordContext.Provider value={{record, setRecord}}>
        <TrailHeader title={record.trailsName} date={record.createdAt} isPublic={record.public} />
        <div>  {/* 내용 */}
          <div css={map.wrap}>
            {/* FIXME navigate 주소 추가 */}
            <img css={map.img} src={record.trailsImg} onClick={()=>{ navigate("") }} />  {/* 지도이미지 */}
          </div>
          <RecordFootInfos />
          <GrayBar />
          <Reviews />
        </div>
      </RecordContext.Provider>
    </div>
  )
}


/* emotion */
const page = css({
  paddingBottom: "84px",
})

const map = {
  // 지도 이미지
  wrap: css({
    width: "100%",
    height: "80vw",
    '@media(min-width: 430px)': {
      height: "350px",
    }
  }),
  img: css({
    width: "100%",
    height: "100%",
    objectFit: "cover",
  })
}