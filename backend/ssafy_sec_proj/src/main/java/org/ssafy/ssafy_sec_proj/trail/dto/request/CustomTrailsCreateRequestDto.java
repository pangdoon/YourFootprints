package org.ssafy.ssafy_sec_proj.trail.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

import java.util.List;

@Getter
@Setter
public class CustomTrailsCreateRequestDto {

    private String runtime;
    private double distance;
    private int calorie;
    private double lat;
    private double lng;
    // private address;
//    private List<Point> spotLists;
    // private spotAddress
    // 시작 주소, 해당 지점 주소는 따로 구할경우(나중에 api 명세서 수정하기, front에서 받아오는걸로 되어있음).
}
