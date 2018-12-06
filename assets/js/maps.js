var $ = jQuery.noConflict();

(function($) {
    "use strict";

    /*-------------------------------------------------*/
    /* =  Contact Map
    /*-------------------------------------------------*/

    var contact = {"lat":"114.031929", "lon":"22.665807"}; //Change a map coordinate here!

        var map; 
        function initialize() {  
            var mapOptions = {
                resizeEnable: true, //是否监控地图容器尺寸变化
                zoom:15, //初始化地图层级
                center: [contact.lat,contact.lon] //初始化地图中心点
            }
            map = new AMap.Map('map', mapOptions);

            AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
                //缩放控件
                map.addControl(new BasicControl.Zoom({
                    position: 'lt'
                }));
            });

            var marker = new AMap.Marker({
                icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: [contact.lat,contact.lon]
            });
            map.add(marker);
        }
        AMap.event.addDomListener(window, 'load', initialize);
    
})(jQuery);