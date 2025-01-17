import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useTokenStore } from "@/store/useTokenStore";
// Material UI에서 필요한 컴포넌트를 가져옵니다.
import { MobileStepper, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 가입 페이지 컴포넌트들을 가져옵니다.
import SignupPage1 from "./SignupPage1";
import SignupPage2 from "./SignupPage2";
import SignupPage3 from "./SignupPage3";

// 스텝퍼 단계에 따라 보여줄 컨텐츠를 반환하는 함수입니다.
const getContentForStep = (step: number): JSX.Element => {
  switch (step) {
    case 0:
      return <SignupPage3 />;
    case 1:
      return <SignupPage2 />;
    case 2:
      return <SignupPage1 />;
    default:
      // 정의되지 않은 단계일 경우 에러를 던집니다.
      throw new Error("Unknown step");
  }
};

export default function SignupStepper() {
  // 현재 활성화된 단계를 관리하는 상태입니다.
  const [activeStep, setActiveStep] = useState<number>(0);
  const nickname = useUserStore((state: any) => state.nickname); // Zustand 스토어에서 닉네임 가져오기
  const areaName = useUserStore((state: any) => state.areaName); // Zustand 스토어에서 지역 가져오기
  const walkStartTime = useUserStore((state: any) => state.walkStartTime); // Zustand 스토어에서 시간 가져오기
  const walkEndTime = useUserStore((state: any) => state.walkEndTime);
  const navigate = useNavigate();
  // useStore1에서 토큰 상태를 가져옵니다.
  const token = useTokenStore((state: any) => state.token);
  const [areaList, setAreaList] = useState<string[]>([]);

  // 총 단계의 수입니다.
  const maxSteps = 3;

  // 컴포넌트가 마운트될 때 API 요청을 보내고 데이터를 가져옵니다.
  useEffect(() => {
    // 토큰이 유효한 경우에만 API 요청을 보냅니다.
    if (token) {
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/find-full-dong-list`,
            config
          );
          setAreaList(response.data.data); // API 응답에서 데이터를 추출하여 상태를 업데이트합니다.
        } catch (error) {
          console.error("Error fetching dong list:", error);
        }
      };

      fetchData(); // 함수 호출
    }
  }, [token]); // 토큰이 변경될 때마다 useEffect가 다시 실행됩니다.

  // 산책 시간을 올바른 형식의 문자열로 변환하는 함수
  const formatWalkTime = (timeValue: number): string => {
    const hours = Math.floor(timeValue / 2);
    const minutes = (timeValue % 2) * 30;
    return `${hours > 0 ? `${hours}시간` : ""}${
      minutes > 0 ? ` ${minutes}분` : ""
    }`.trim();
  };

  const handleNext = () => {
    if (activeStep === 1) {
      // 주소 리스트에 해당 주소가 있는지 확인합니다.
      if (areaList.indexOf(areaName) === -1) {
        alert("입력하신 주소가 존재하지 않습니다. 다시 확인해주세요.");
        return; // 주소가 없으면 함수 실행을 중단하고 다음 스텝으로 넘어가지 않습니다.
      }
    }

    if (activeStep === 0) {
      // 시작시간과 끝시간이 같은지 확인합니다.
      if (walkStartTime === walkEndTime) {
        alert("산책시간을 범위로 주시길 바랍니다. 다시 확인해주세요.");
        return; // 시작시간과 끝시간이 같은지 확인하고 같으면 다음 스텝으로 넘어가지 않습니다.
      }
    }

    // 마지막 스텝에서 완료 버튼 클릭 처리
    if (activeStep === maxSteps - 1) {
      // 서버로 보낼 데이터 객체를 생성합니다.
      const userData = {
        nickName: nickname,
        address: areaName,
        requiredTimeStart: walkStartTime,
        requiredTimeEnd: walkEndTime,
      };
      if (activeStep === 2) {
        // 닉네임 길이 검사와 특수 문자 검사
        if (
          nickname.length < 2 ||
          nickname.length > 10 ||
          !/^[a-zA-Z0-9가-힣]+$/.test(nickname)
        ) {
          alert("닉네임이 올바른 형식이 아닙니다. (특수문자 없이 2~10자 이내)");
          return; // 조건이 맞지 않으면 여기서 함수 실행을 중단합니다.
        }
      }

      const config = {
        headers: {
          Authorization: token,
        },
      };
      // Axios를 사용하여 put 요청을 보냅니다.
      axios
        .put(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/remain-info`,
          userData,
          config
        )
        .then((_response) => {
          // 요청이 성공적으로 완료되면 실행됩니다.
          alert(
            `회원가입이 완료되었습니다 \n닉네임 : ${nickname} \n지역 : ${areaName} \n산책시간: ${formatWalkTime(
              walkStartTime
            )} ~ ${formatWalkTime(walkEndTime)}`
          );
          navigate("/"); // 사용자를 원하는 경로로 리디렉션할 수 있습니다.
        })
        .catch((error) => {
          if (error.response && error.response.data.error.status === 401) {
            if (
              error.response.data.error.msg == "이미 존재하는 닉네임입니다."
            ) {
              // 백엔드에서 401 에러와 함께 메시지를 보낸 경우
              const errorMessage = error.response.data.error.msg;
              alert(`회원가입 실패: ${errorMessage}`);
            }
          } else {
            // 그 외의 경우에는 기본 에러 메시지를 보여줍니다.
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
          }
        });
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  // 이전 단계로 이동하는 함수
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // 컴포넌트의 렌더링
  return (
    <Box sx={{ width: "100%", flexGrow: 1, flexDirection: "column" }}>
      <MobileStepper
        // 점 형태의 스테퍼를 나타냅니다.
        variant="dots"
        // 총 단계의 수입니다.
        steps={maxSteps}
        // 스테퍼의 위치 설정입니다.
        position="static"
        // 현재 활성화된 단계입니다.
        activeStep={activeStep}
        sx={{
          // 중앙 정렬합니다.
          justifyContent: "center",
          // 비활성화된 점의 스타일을 정의
          "& .MuiMobileStepper-dot": {
            width: 8, // 기본 dot 크기 설정
            height: 8,
            borderRadius: "50%",
            margin: "0 4px", // 좌우 여백 설정
            backgroundColor: "rgba(0, 0, 0, 0.26)", // 비활성 dot 색상 설정
          },
          "& .MuiMobileStepper-dotActive": {
            width: 17, // 활성 dot 길게 설정
            height: 8,
            borderRadius: 4, // 모서리를 약간 둥글게
            margin: "0 4px",
            backgroundColor: "#4acf9a", // 메인색깔로 설정
          },
        }}
        nextButton={<></>}
        backButton={<></>}
      />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", padding: 1 }}
      >
        <Button
          size="small"
          onClick={handleBack}
          disabled={activeStep === 0}
          sx={{
            fontSize: "17px",
            color: activeStep === 0 ? "lightgray" : "black", // 비활성화 시 lightgray, 활성화 시 black
            "&:hover": {
              color: "black", // 호버 상태일 때의 텍스트 색상
              fontWeight: "bold", // 호버 상태일 때 텍스트를 볼드처리
            },
            ...(activeStep === 0 && {
              color: "gray", // 비활성화 상태일 때의 텍스트 색상을 명시적으로 설정
            }),
          }}
        >
          뒤로
        </Button>

        <Button
          size="small"
          onClick={handleNext}
          // 마지막 스텝에서는 "완료" 버튼을 비활성화하지 않습니다.
          disabled={false}
          sx={{
            fontSize: "17px",
            color: activeStep === maxSteps - 1 ? "lightgray" : "black", // 비활성화 시 lightgray, 활성화 시 black
            "&:hover": {
              color: "black", // 호버 상태일 때의 텍스트 색상
              fontWeight: "bold", // 호버 상태일 때 텍스트를 볼드처리
            },
            ...(activeStep === maxSteps - 1 && {
              color: "gray", // 비활성화 상태일 때의 텍스트 색상을 명시적으로 설정
            }),
          }}
        >
          {activeStep === maxSteps - 1 ? "완료" : "다음"}
        </Button>
      </Box>
      {getContentForStep(activeStep)}
    </Box>
  );
}
