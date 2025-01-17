package org.ssafy.ssafy_sec_proj.users.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class LikedTrailDto {

    Long likedTrailsId;
    String trailsImgUrl;
    int likedNum;
    double distance;
    int runtime;
    String address;
    boolean isLiked;

    @Builder
    private LikedTrailDto(Long likedTrailsId , String trailsImgUrl, int likedNum, double distance, int runtime, String address, boolean isLiked) {
        this.likedTrailsId = likedTrailsId;
        this.trailsImgUrl = trailsImgUrl;
        this.likedNum = likedNum;
        this.distance = distance;
        this.runtime = runtime;
        this.address = address;
        this.isLiked = isLiked;
    }

    public static LikedTrailDto of(Long likedTrailsId , String trailsImgUrl, int likedNum, double distance, int runtime, String address, boolean isLiked) {
        return builder()
                .likedTrailsId(likedTrailsId)
                .trailsImgUrl(trailsImgUrl)
                .likedNum(likedNum)
                .distance(distance)
                .runtime(runtime)
                .address(address)
                .isLiked(isLiked)
                .build();
    }
}