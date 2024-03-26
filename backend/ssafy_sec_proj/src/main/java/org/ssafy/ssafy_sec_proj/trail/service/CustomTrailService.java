package org.ssafy.ssafy_sec_proj.trail.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.ssafy_sec_proj._common.exception.CustomException;
import org.ssafy.ssafy_sec_proj._common.exception.ErrorType;
import org.ssafy.ssafy_sec_proj._common.service.S3Uploader;
import org.ssafy.ssafy_sec_proj.trail.dto.response.*;
import org.ssafy.ssafy_sec_proj.trail.dto.request.*;
import org.ssafy.ssafy_sec_proj.trail.entity.CustomTrails;
import org.ssafy.ssafy_sec_proj.trail.entity.SpotLists;
import org.ssafy.ssafy_sec_proj.trail.repository.CustomTrailsRepository;
import org.ssafy.ssafy_sec_proj.trail.repository.SpotListsRepository;
import org.ssafy.ssafy_sec_proj.users.dto.request.UserAddLikeListRequestDto;
import org.ssafy.ssafy_sec_proj.users.entity.TrailsMidLikes;
import org.ssafy.ssafy_sec_proj.users.entity.User;
import org.ssafy.ssafy_sec_proj.users.repository.TrailsMidLikesRepository;
import org.ssafy.ssafy_sec_proj.users.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Collections;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomTrailService {
    private final CustomTrailsRepository customTrailsRepository;
    private final UserRepository userRepository;
    private final TrailsMidLikesRepository trailsMidLikesRepository;
    private final SpotListsRepository spotListsRepository;
    private final S3Uploader s3Uploader;

    // 산책 기록 상세
    public CustomTrailDetailResponseDto readCustomTrailDetail(User user, Long trailsId) {
        CustomTrails customTrails = customTrailsRepository.findByIdAndUserIdAndDeletedAtIsNull(trailsId, user).orElseThrow(
                () -> new CustomException(ErrorType.NOT_FOUND_TRAIL)
        );


        CustomTrailDetailResponseDto responseDto = CustomTrailDetailResponseDto.of(customTrails.getTrailsName(), customTrails.getCreatedAt(),
                customTrails.isPublic(), customTrails.getTrailsImg(), customTrails.getRuntime(), customTrails.getDistance(),
                customTrails.getSiDo() + " "  + customTrails.getSiGunGo() + " " + customTrails.getEupMyeonDong(),
                customTrails.getStarRanking(), customTrails.getMemo());
        return responseDto;
    }

    // 캘린더 기록
    public RecordListResponseDto readCalenderRecords(User user, int year, int month){
        List<CustomTrails> calenderList = customTrailsRepository.findCustomTrails(year, month, user).orElse(null);
        RecordListResponseDto responseDto = RecordListResponseDto.from(
                calenderList
                        .stream()
                        .map(c -> CalenderRecordResponseDto.of(
                                c.getId(),
                                c.getCreatedAt(),
                                c.getTrailsName(),
                                c.getRuntime(),
                                c.getDistance()
                        ))
                        .toList());
        return responseDto;

    }

    // 산책 기록
    public RecordListResponseDto readRecords(User user){
        List<CustomTrails> recordList = customTrailsRepository.findAllByUserIdAndDeletedAtIsNull(user).orElse(null);
        RecordListResponseDto responseDto = RecordListResponseDto.from(
                recordList
                        .stream()
                        .map(r -> RecordResponseDto.of(
                                r.getId(),
                                r.getTrailsImg(),
                                transferRuntime(r.getRuntime()),
                                r.getDistance(),
                                r.getLikeNum(),
                                r.getSiGunGo() + " " + r.getEupMyeonDong(),
                                checkIsLike(r.getUserId(), r)
                        ))
                        .toList());
        return responseDto;
    }

    // 정적 이미지 클릭
    public CoordinateListResponseDto readCorrdinateList(User user, Long trailsId){
        CustomTrails customTrails = customTrailsRepository.findByIdAndDeletedAtIsNull(trailsId).orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_TRAIL));
        if (!customTrails.getUserId().getId().equals(user.getId())) {
            throw new CustomException(ErrorType.NOT_MATCHING_USER);
        }
        List<SpotLists> coordList = spotListsRepository.findAllByCustomTrailsIdAndDeletedAtIsNull(customTrails)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_SPOT_LIST));
        CoordinateListResponseDto responseDto = CoordinateListResponseDto.from(
                coordList
                        .stream()
                        .map(c -> CoordResponseDto.of(
                                c.getLa(),
                                c.getLo()
                        ))
                        .toList());
        return responseDto;
    }

    // runtime 분 단위로 변환하는 메서드
    public int transferRuntime(String runtime) {
        String[] times = runtime.split(":");
        return Integer.parseInt(times[0]) * 60 + Integer.parseInt(times[1]);
    }

    // 좋아요 여부 판단 : id와 user로 midlikes에 있는지 체크
    public boolean checkIsLike(User user, CustomTrails customTrails) {
        TrailsMidLikes trailsMidLikes = trailsMidLikesRepository.findByUserIdAndTrailsIdAndDeletedAtIsNull(user, customTrails);
        if (trailsMidLikes == null){
            return false;
        } else {
            return true;
        }
    }

    // 커스텀 산책로 만들기
    public CustomTrailsCreateResponseDto createCustomTrail(CustomTrailsCreateRequestDto dto, User user) {
        if (userRepository.findByKakaoEmailAndDeletedAtIsNull(user.getKakaoEmail()).isEmpty()) {
            throw new CustomException(ErrorType.NOT_FOUND_USER);
        }
        CustomTrails customTrails = CustomTrails.of(user.getNickName(), null, 0, dto.getRuntime(), dto.getDistance(), dto.getCalorie(), null, false, 0, "구미시", "", "진평동", user);
        CustomTrails savedCustomTrails = customTrailsRepository.save(customTrails);
        return CustomTrailsCreateResponseDto.of(savedCustomTrails.getId());
    }

    // 산책 종료 후 공개 편집
    public CustomTrailsPublicResponseDto editPublic(User user, Long trailsId, CustomTrailsPublicRequestDto dto){
        CustomTrails customTrails = customTrailsRepository.findByIdAndUserIdAndDeletedAtIsNull(trailsId, user)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_TRAIL));
        // 동일한 값인지 체크
        if (dto.isPublic() != customTrails.isPublic()) {
            throw new CustomException(ErrorType.ALREADY_EXIST_CUSTOM_TRAILS_PUBLIC);
        }
        customTrails.updatePublic(!dto.isPublic());
        customTrailsRepository.save(customTrails);
        CustomTrailsPublicResponseDto responseDto = CustomTrailsPublicResponseDto.of(!dto.isPublic());
        return responseDto;
    }

    // 산책 기록 상세 편집
    public CustomTrailsEditResponseDto editCustomTrailRecord(User user, Long trailsId, CustomTrailsEditRequestDto dto) {
        CustomTrails customTrails = customTrailsRepository.findByIdAndUserIdAndDeletedAtIsNull(trailsId, user)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_TRAIL));

        // imgURL을 만들어서 S3에 저장 시작
        String imgUrl = "";
        System.out.println(dto.getTrailsImg());
        if (dto.getTrailsImg() == null) {
            imgUrl = customTrails.getTrailsImg();
        } else {
            try {
                imgUrl = s3Uploader.upload(dto.getTrailsImg());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        // imgURL을 만들어서 S3에 저장 끝

        customTrails.updateRecord(dto.getMemo(), dto.getStarRanking(), imgUrl, dto.getTrailsName());
        customTrailsRepository.save(customTrails);
        CustomTrailsEditResponseDto responseDto = CustomTrailsEditResponseDto.of(dto.getTrailsName(), customTrails.getCreatedAt(),
                customTrails.isPublic(), imgUrl, customTrails.getRuntime(), customTrails.getDistance(),
                customTrails.getSiDo() + " "  + customTrails.getSiGunGo() + " " + customTrails.getEupMyeonDong(),
                dto.getStarRanking(), dto.getMemo());
        return responseDto;
    }


    public void receiveData(User user, Long trailsId, CustomTrailsReceiveDataRequestDto dto){
        CustomTrails customTrails = customTrailsRepository.findByIdAndUserIdAndDeletedAtIsNull(trailsId, user)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_TRAIL));

        List<SpotLists> existingSpots = spotListsRepository.findByCustomTrailsIdAndDeletedAtIsNull(customTrails)
                .orElse(Collections.emptyList());

        Set<String> existingCoordinates = existingSpots.stream()
                .map(spot -> String.format("%.5f", spot.getLa()) + ":" + String.format("%.5f", spot.getLo()))
                .collect(Collectors.toSet());

        boolean isNewSpotAdded = false;
        String address = "임시 데이터 입니다";
        String[] parts = address.split(" ");
        String siDo = parts[0];
        String siGunGu = parts.length > 1 ? parts[1] : "";
        String eupMyeonDong = parts.length > 2 ? parts[2] : "";

        for (CustomTrailsReceiveDataRequestDto.SpotDto spotDto : dto.getSpotLists()) {
            String currentCoordinates = spotDto.getLa() + ":" + spotDto.getLo();

            if(!existingCoordinates.contains(currentCoordinates)) {
                LocalDateTime duration = LocalDateTime.now();

                SpotLists newSpot = SpotLists.of(
                        spotDto.getLa(),
                        spotDto.getLo(),
                        duration,
                        siDo,
                        siGunGu,
                        eupMyeonDong,
                        customTrails
                );
                spotListsRepository.save(newSpot);
                isNewSpotAdded = true;
            }
        }

        if (!isNewSpotAdded) {
            throw new CustomException(ErrorType.ALREADY_EXIST_SPOT);
        }
    }

}
