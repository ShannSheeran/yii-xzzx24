define(function(require,exports,module){
	var $ = window.$ || require('jQuery');
	/**
	 * 判断是否是空
	 * @param value
	*/
	function isEmpty(value){
		if(value == null || value == "" || value == "undefined" || value == undefined || value == "null"){
			return true;
		}else{
			value = value.replace(/\s/g,"");
			if(value == ""){
				return true;
			}
			return false;
		}
	}
	function loadAreaDetail(area) {
		var param = "area=" + area;
		var actionUrl = "/Systems/Community/loadAllAreas.action";
		jQuery.ajax({
			type: "POST",
			dataType: "text",
			url: actionUrl,
			data:param,
			async: true,
			cache: false,
			success: function(dataResult, textStatus) {
				$("#span_area").html(dataResult);
			},
			error: function(XMLHttpResponse) {
				return false;
			}
		});
	}
	
	/**
	 * 获取省份列表
	 */
	function loadProvinces() {
		var actionUrl = "/Systems/Community/getProvinces.action";
		jQuery.ajax({
			type : "POST",
			dataType : "text",
			url : actionUrl,
			data : null,
			cache : false,
			success : function(dataResult, textStatus) {
				$("#span_province").html(dataResult);
			},
			error : function(XMLHttpResponse) {
				//parent.showMessageWarn("系统繁忙，请稍后再试！");
				return false;
			}
		});
	}
	
	/**
	 * 获取城市列表
	 */
	function loadCitys() {
		var provinceId = $("#consignee_province").find("option:selected").val();
		var provinceName = isEmpty(provinceId) ? "" : $("#consignee_province").find("option:selected").text().replace("*", "");
		$("#areaNameTxt").html(provinceName);
		if (provinceId == null || provinceId == "") {
			$("#span_city").html("<select class='selt' id=\"consignee_city\" name=\"city\"><option selected=\"\" value=\"\">请选择：</option></select>");
			$("#span_county").html("<select class='selt' id=\"consignee_county\" name=\"countyId\"><option selected=\"\" value=\"\">请选择：</option></select>");
			$("#span_town").html("");
			return;
		}
		var param = "provinceId=" + provinceId;
		var actionUrl = "/Systems/Community/getCitys.action";
		jQuery.ajax({
			type : "POST",
			dataType : "text",
			url : actionUrl,
			data : param,
			cache : false,
			success : function(dataResult, textStatus) {
				$("#span_city").html(dataResult);
				$("#span_county").html("<select class='selt' id=\"consignee_county\" name=\"countyId\"><option selected=\"\" value=\"\">请选择：</option></select>");
				$("#span_town").html("");
				$("#consignee_city").focus();
			},
			error : function(XMLHttpResponse) {
				//parent.showMessageWarn("系统繁忙，请稍后再试！");
				return false;
			}
		});
	}
	
	/**
	 * 获取县级列表
	 */
	function loadCountys() {
		var cityId = $("#consignee_city").find("option:selected").val();
		var provinceName = $("#consignee_province").find("option:selected").text().replace("*", "");
		var cityName = isEmpty(cityId) ? "" : $("#consignee_city").find("option:selected").text().replace("*", "");
		$("#areaNameTxt").text(provinceName + cityName);
		var param = "cityId=" + cityId;
		var actionUrl = "/Systems/Community/getCountys.action";
		jQuery.ajax({
			type : "POST",
			dataType : "text",
			url : actionUrl,
			data : param,
			cache : false,
			success : function(dataResult, textStatus) {
				
					if (dataResult != null) {
						$("#span_county").html(dataResult);
						$("#span_town").html("");
					}
				$("#consignee_county").focus();
			},
			error : function(XMLHttpResponse) {
				//parent.showMessageWarn("系统繁忙，请稍后再试！");
				return false;
			}
		});
	}
	
	/**
	 * 获取乡镇街道列表
	 */
	function loadTowns() {
		var countyId = $("#consignee_county").find("option:selected").val();
		var provinceName = $("#consignee_province").find("option:selected").text().replace("*", "");
		var cityName = $("#consignee_city").find("option:selected").text().replace("*", "");
		var countyName = isEmpty(countyId) ? "" : $("#consignee_county").find("option:selected").text().replace("*", "");
		$("#areaNameTxt").text(provinceName + cityName + countyName);
	
		var param = "countyId=" + countyId;
		var actionUrl = "/Systems/Community/getTowns.action";
		jQuery.ajax({
			type : "POST",
			dataType : "text",
			url : actionUrl,
			data : param,
			cache : false,
			success : function(dataResult, textStatus) {
				
					if (dataResult != null && dataResult != "area_empty") {
						$("#span_town").html(dataResult);
						$("#span_town").show();
					} else {
						$("#span_town").html("");
						$("#span_town").hide();
					}
				$("#consignee_town").focus();
			},
			error : function(XMLHttpResponse) {
				return false;
			}
		});
	}
	function district(f) {
        this.params = f;
        f.prov&&(this.provEl = $(f.prov));
        f.city&&(this.cityEl = $(f.city));
        f.dist&&(this.distEl = $(f.dist));
		f.street&&(this.streetEl = $(f.street));
        this._initEvents();
        this._fillOption(this.provEl.get(0), e.children("1"))
    };
	district.prototype._initEvents=  function() {
		var f = this;
		f.provEl&&f.provEl.on("change",
		function(e){
			f._linkage(e.target);
		});
		f.cityEl&&f.cityEl.on("change",
		function(e){
			f._linkage(e.target);
		});
		f.distEl&&f.distEl.on("change",
		function(e){
			f._linkage(e.target);
		});
		f.street&&f.street.on("change",
		function(e){
			f._linkage(e.target);
		});
    };
	district.create = function(f, h, g) {
        return new district({
            prov: f,
            city: h,
            dist: g
        })
    };
	return district;
});