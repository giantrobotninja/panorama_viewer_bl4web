"use strict"

// register the application module
b4w.register("Teorema_pano_1_main", function (exports, require) {

	// import modules used by the app
	var m_app = require("app");
	var m_cfg = require("config");
	var m_data = require("data");
	var m_preloader = require("preloader");
	var m_ver = require("version");
	var m_scenes = require("scenes");
	var m_cam = require("camera");
	//var m_cam_anim = require("camera_anim");
	var m_mouse = require("mouse"); //my
	var m_cont = require("container");
	var m_mat = b4w.material;
	var m_anchors = require("anchors");
	var m_time = require("time");

	var area_num = 0;
	var file_data = [];
	var angles_last = new Float32Array(2);
	var angles_orig = new Float32Array(2);

	var _is_camera_rotating = false;

	var _is_camera_stop_rotating = false;
		
	var DEFAULT_CAM_ANGLE_SPEED = 0.01;
	var DEFAULT_CAM_ROTATE_TIME = 2000;
	var fov_orig;
	
	m_cfg.set("quality", m_cfg.P_ULTRA);
	m_cfg.set("canvas_resolution_factor", 1);

	// detect application mode
	var DEBUG = (m_ver.type() == "DEBUG");

	// automatically detect assets path
	var APP_ASSETS_PATH = m_cfg.get_assets_path("Teorema_pano_1");

	/**
	 * export the method to initialize the app (called at the bottom of this file)
	 */
	exports.init = function () {
		m_app.init({
			canvas_container_id: "main_canvas_container",
			callback: init_cb,
			show_fps: DEBUG,
			console_verbose: DEBUG,
			autoresize: true
		});
	}

	/**
	 * callback executed when the app is initialized 
	 */
	function init_cb(canvas_elem, success) {

		if (!success) {
			console.log("b4w init failure");
			return;
		}

		m_preloader.create_preloader();

		// ignore right-click on the canvas element
		canvas_elem.oncontextmenu = function (e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		};


		canvas_elem.addEventListener("mousemove", mouse_move, false); // my

		load();
	}

	/**
	 * load the scene data
	 */
	function load() {
		
		var preloader_bg = document.getElementById ("preloader_bg")
		preloader_bg.style.display = 'block';
		
		m_data.load(APP_ASSETS_PATH + "Teorema_pano_1.json", load_cb, preloader_cb);
	};
	/**
	 * update the app's preloader
	 */
	function preloader_cb(percentage) {
		m_preloader.update_preloader(percentage);
		if (percentage == 100) {
		preloader_bg.classList.add('hidden');
       
		
		preloader_bg.style.display = 'none';
        return;
    }
		
	}

	/**
	 * callback executed when the scene data is loaded
	 */


/* var angle_phi = angles_orig[0];
var angle_theta = angles_orig[1]; */

function reset_cam() {
    var t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;  // catches touchscreen presses as well      
    window.ontouchstart = resetTimer; // catches touchscreen swipes as well 
    window.onclick = resetTimer;      // catches touchpad clicks as well
    window.onkeypress = resetTimer;   
    window.addEventListener('scroll', resetTimer, true); 

    function cam_anim_reset() {
		clearTimeout(t);
		var camera = m_scenes.get_active_camera();
		var angles = new Float32Array(2);
		m_cam.get_camera_angles(camera, angles);
		var fov_cur;
		//var phi = angles[0], theta = angles[1];
		fov_cur = m_cam.get_fov(camera);
		
		if (angles[0]!= angles_orig[0] || angles[1] != angles_orig[1] || fov_orig != fov_cur )
			
		{ 			
				/* 	var delta_phi = angles[0] - angles_orig[0];
					var delta_theta = angles[1] - angles_orig[1];
					//angles_o[0] = 0.5;
					//angles_o [1] = 0.5;
					//m_app.disable_camera_controls();
				m_cam_anim.rotate_camera(camera,delta_phi,delta_theta,5000); */
				
				
				var fov_temp = fov_cur - fov_orig;
				var fov = fov_temp;
				
				if (fov_orig != fov_cur ){
				
				var delta_fov  = fov_cur;
					var cur_animator_fov = m_time.animate(0, fov , 2000, function(e) {
						
						if ( e > Math.abs(fov)) {
							
							m_time.clear_animation(cur_animator_fov);
							//fin_cb();
							return;
						}
						
						m_cam.set_fov(camera, delta_fov - e);
						//delta_fov = e;
					});
				}
					var phi = angles[0] - angles_orig[0];
					var theta = angles[1] - angles_orig[1];
					// var theta = Math.abs(thetaV);
				
				   var time = DEFAULT_CAM_ROTATE_TIME;
					_is_camera_rotating = true;
					
					
				/* 	
					function fin_cb() {
						if (_is_camera_rotating) {
							_is_camera_rotating = false;
							//if (cb)
							//	cb();
						}
					} */
					if (phi < 3.14){
					var delta_phi   = 0;
					var cur_animator_phi = m_time.animate(0, phi , time, function(e) {
						if (_is_camera_stop_rotating || e >= phi ) {
							_is_camera_stop_rotating = false;
							m_time.clear_animation(cur_animator_phi);
							//fin_cb();
							return;
						}
						m_cam.rotate_camera(camera, delta_phi - e, 0);
						
						delta_phi = e;
					});
						
					var delta_theta = 0;
					var cur_animator_theta = m_time.animate(0, theta, time, function(e) {
						if (_is_camera_stop_rotating || e >= Math.abs(theta)) {
							_is_camera_stop_rotating = false;
							m_time.clear_animation(cur_animator_theta);
							//fin_cb();
							return;
						}
						m_cam.rotate_camera(camera, 0, delta_theta -e);
						delta_theta = e;
					});
					}
					else {
						var phi_short =  6.2831853071796- phi ;
								var delta_phi   = 0;
							var cur_animator_phi = m_time.animate(0, phi_short , time, function(e) {
							
								if (_is_camera_stop_rotating || e >= phi_short ) {
									_is_camera_stop_rotating = false;
									m_time.clear_animation(cur_animator_phi);
									//fin_cb();
									return;
								}
								
								m_cam.rotate_camera(camera,  e - delta_phi, 0);
								
								delta_phi = e;
							});
						var delta_theta = 0;
					var cur_animator_theta = m_time.animate(0, theta, time, function(e) {
						if (_is_camera_stop_rotating || e >= Math.abs(theta)) {
							_is_camera_stop_rotating = false;
							m_time.clear_animation(cur_animator_theta);
							//fin_cb();
							return;
						}
						m_cam.rotate_camera(camera, 0, delta_theta -e);
						delta_theta = e;
					});
						
					}
			
		}
		
		
		//alert("You are now logged out.");
    }

    function resetTimer() {
        clearTimeout(t);
        t = setTimeout(cam_anim_reset, 10000);  // time is in milliseconds
    }
}


	var selArea;
	
	
	var area_n = selArea;
	
	function mouse_move(e) {
		var x = m_mouse.get_coords_x(e, false, true);
		var y = m_mouse.get_coords_y(e, false, true);
		var obj = m_scenes.pick_object(x, y);




		if (obj && (!selArea || (selArea != m_scenes.get_object_name(obj)))) {
			var zxc = m_scenes.get_object_name(obj);
			
			/* if (zxc == "SkyBox3" && selArea == "SkyBox3" ) {
				return;				
				
			} */

			if (selArea && zxc != selArea) {

				var FAll = selArea + "e";

				var hideArea = m_scenes.get_object_by_name(FAll);
				
				
				if (hideArea) {
					var SelCol_F = m_scenes.get_object_by_name(selArea);
					//var material_list_F = m_mat.get_materials_names(SelCol_F);

					m_scenes.hide_object(hideArea);
					
					if (!file_data || file_data.length != 0) {
						var area_sel, fLen, i;
						fLen = file_data.length;

						for (i = 0; i < fLen; i++) {

							var temp_data = file_data[i];

							if (temp_data.area_id == selArea) {
								
								var cur_id = m_scenes.get_object_by_name(temp_data.area_id);
								if (temp_data.area_status == "3") {
									var obj_red = m_scenes.get_object_by_name("Cube_red");
									var col_red = m_mat.get_materials_names(obj_red);
									m_mat.inherit_material(obj_red, "Uch_Sold", SelCol_F, "Uch_Swap");
								} else if (temp_data.area_status == "2") {
									var obj_yell = m_scenes.get_object_by_name("Cube_yellow");
									var col_yell = m_mat.get_materials_names(obj_yell);
									m_mat.inherit_material(obj_yell, "Uch_Reserved", SelCol_F, "Uch_Swap");
								} else if (temp_data.area_status == "1") {
									var obj_white = m_scenes.get_object_by_name("Cube_white");
									var col_white = m_mat.get_materials_names(obj_white);
									m_mat.inherit_material(obj_white, "Uch_Free", SelCol_F, "Uch_Swap");


								}
								break;
							}
						}

					}


					/* if (material_list_F[0] == "Uch_Swap"){
						var sphere_w = m_scenes.get_object_by_name("Cube_green");
				
						m_mat.inherit_material(sphere_w, "Uch_Sel", SelCol_F, "Uch_Free");
					} */
					//m_mat.inherit_material(sphere_1, "Uch_Sel", sphere_2, "Uch_Free"); 

				}
			} else
				m_mouse.enable_mouse_hover_outline(true);
			selArea = m_scenes.get_object_name(obj);
			
			if (selArea == "SkyBox3"){
				return;
			}

			var sphere_1 = m_scenes.get_object_by_name("Cube_green");
			var sphere_2 = m_scenes.get_object_by_name(selArea);


			var material_list = m_mat.get_materials_names(sphere_2);

			if (material_list[0] == "Uch_Swap")
				m_mat.inherit_material(sphere_1, "Uch_Sel", sphere_2, "Uch_Swap");


			//console.log("selArea", selArea);

			var selEmpty = m_scenes.get_object_by_name(selArea + "e");
			m_scenes.show_object(selEmpty);
			//console.log("selEmpty", selEmpty);


		}

	}

	function main_canvas_click(e) {
		if (e.preventDefault)
			e.preventDefault();

		var x = m_mouse.get_coords_x(e, false, true);
		var y = m_mouse.get_coords_y(e, false, true);

		var obj = m_scenes.pick_object(x, y);

		if (obj) {
			selArea = m_scenes.get_object_name(obj);
			if (selArea == "SkyBox3"){
				return;
			}
			area_n = selArea;
			var area_sel, fLen, i;
			fLen = file_data.length;

			for (i = 1; i < fLen; i++) {
				var temp_data = file_data[i];
				if (temp_data.area_id == selArea) {
					area_sel = temp_data;
					break;
				}
			}
			if (temp_data.area_status != "3") {

				var tabl_text = "Участок № " + area_sel.area_number;

				document.getElementById("h_mob").innerHTML = tabl_text;
				tabl_text = area_sel.area_size + " сот.";
				document.getElementById("card_area_size").innerHTML = tabl_text;
				tabl_text = area_sel.full_price + " руб.";
				document.getElementById("card_full_price").innerHTML = tabl_text;
				tabl_text = area_sel.discount_price + " руб.";
				document.getElementById("card_discount_price").innerHTML = tabl_text;
				
				//var a = document.getElementById('text').value;
				var a = area_sel.area_spot;
				var c = "/uchastki-izhs/img/spots_kvp/" + a;

				document.getElementById('spot_img').src = c;
				var elem = document.getElementById("card");
				elem.style.display = "block";
				
				var shadow = document.getElementById("shadow");
				shadow.style.display = "block";
				
				
			}

		}
	}

	function load_cb(data_id, success) {

		if (!success) {
			console.log("b4w load failure");
			return;
		}

		m_app.enable_camera_controls();
		
		
		
		// place your code here
		var camera = m_scenes.get_active_camera();
		
		m_cam.get_camera_angles(camera, angles_orig);
	    fov_orig = m_cam.get_fov(camera);
		
		var phi = angles_orig[0], theta = angles_orig[1];
		//console.log ("camang",angles_orig);
		

		//parsing csv file

		file_data = [];
		//https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-bOX1OmvvuurMG6T4Yty84UjWHv9ct1b6mH1eOHxnLSEPOyvp2t3p0FmSrjM9tB8Eo2_8Dq1WS1_f/pub?gid=1465228504&single=true&output=csv
		//https://pointofart.ru/kvp_data_full.csv
		// https://docs.google.com/spreadsheets/d/19Eo1FMwqt9CFm6g-X_pCERRTFMu6-RI9MncvZot5sWk/edit?usp=sharing
		Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-bOX1OmvvuurMG6T4Yty84UjWHv9ct1b6mH1eOHxnLSEPOyvp2t3p0FmSrjM9tB8Eo2_8Dq1WS1_f/pub?gid=1465228504&single=true&output=csv", {
			// ("https://pointofart.ru/kvp_data.csv", { 
			download: true,
			//header: false,
			//skipEmptyLines: true,
			step: function (row) {
				var area_data = {
					area_id: row.data[0],
					area_number: row.data[1],
					area_size: row.data[2],
					full_price: row.data[3],
					discount_price: row.data[4],
					area_status: row.data[5],
					area_spot: row.data[6]

				};
				file_data.push(area_data);
				//console.log("area_data:", area_data);

			},
complete: function () {
            console.log("All done!");


            var fLen, i;
            fLen = file_data.length;

            for (i = 1; i < fLen; i++) {

                var temp_data = file_data[i];
                var a_status = temp_data.area_status;

                if (!temp_data.area_id || temp_data.area_id == "") {
                    // The == and != operators consider null equal to only null or undefined

                    break;
                }

                var selAnch = temp_data.area_id + "e";
                var eID = m_scenes.get_object_by_name(selAnch);

                if (eID && m_anchors.is_anchor(eID)) {

                    var anchor_text = document.createElement("div");

                    anchor_text.id = selAnch + "ID";
                    anchor_text.style.position = "absolute";
                    anchor_text.style.alignItems = "center";
					anchor_text.style.textAlign = "center";
                   // anchor_text.style.backgroundColor = "#F7F7F7";
					//anchor_text.style.background = "url('tabl.png')";
					//anchor_text.style.backgroundSize = "60px 120px";
					anchor_text.style.marginTop = "30px";
					anchor_text.style.marginBottom = "30px";
                    anchor_text.style.color = "#444";
                    anchor_text.style.padding = "5px";
                    /* anchor_text.style.border = "thin solid black";
                    anchor_text.style.borderTopLeftRadius = "10px";
                    anchor_text.style.borderTopRightRadius = "10px";
                    anchor_text.style.borderBottomRightRadius = "10px"; */
					anchor_text.style.whiteSpace = "nowrap";
					anchor_text.style.height = "60px"
					anchor_text.style.width = "155px";
					anchor_text.style.backgroundImage = "url('/uchastki-izhs/img/tabl_uni.svg')";
					anchor_text.style.backgroundSize = "100% 100%";

                    anchor_text.innerHTML = temp_data ? ("<b>Участок № </b>" + "<b>"+ temp_data.area_number +"</b>" + "<br>" + (temp_data.area_status[0] == "1" ? "<font color='#1dbcad'><b>Свободен</b></font>" : (temp_data.area_status == "2" ? "<font color='#1dbcad'><b>Забронирован</b></font>" : (temp_data.area_status == "3" ? "<font color='red'><b>Продан</b></font>" : "<font color='red'><b>Не задан</b></font>")))) : "<font color='red'><b>Нет данных</b></font>";

                    anchor_text.style.visibility = "hidden";

                    document.getElementById('main_canvas_container').appendChild(anchor_text);

                    
                    m_anchors.attach_move_cb(eID, function (x, y, appearance, obj, elem) {

                        var anchor_elem = document.getElementById(m_scenes.get_object_name (obj) + "ID");
                        anchor_elem.style.userSelect = "none";
                        anchor_elem.style.left = x + 5 + "px";
                        anchor_elem.style.top = y - 115 + "px";

                        if (appearance == "visible")
                            anchor_elem.style.visibility = "visible";
                        else
                            anchor_elem.style.visibility = "hidden";
                    });
                }

                //coloring;

                var cur_id = m_scenes.get_object_by_name(temp_data.area_id);

                if (temp_data.area_status == "3") {
                    var obj_red = m_scenes.get_object_by_name("Cube_red");
                    var col_red = m_mat.get_materials_names(obj_red);
                    m_mat.inherit_material(obj_red, "Uch_Sold", cur_id, "Uch_Swap");
                } else if (temp_data.area_status == "2") {
                    var obj_yell = m_scenes.get_object_by_name("Cube_yellow");
                    var col_yell = m_mat.get_materials_names(obj_yell);
                    m_mat.inherit_material(obj_yell, "Uch_Reserved", cur_id, "Uch_Swap");
                } else if (temp_data.area_status == "1") {
                    var obj_white = m_scenes.get_object_by_name("Cube_white");
                    var col_white = m_mat.get_materials_names(obj_white);
                    m_mat.inherit_material(obj_white, "Uch_Free", cur_id, "Uch_Swap");

                }


            }


        }
		});
				var selAnch = "z01e";

				var eID = m_scenes.get_object_by_name(selAnch);

                
                    var anchor_text = document.createElement("div");

                    anchor_text.id = selAnch;
                    anchor_text.style.position = "absolute";
                   // anchor_text.style.alignItems = "center";
					 anchor_text.style.textAlign = "center";
                    //anchor_text.style.backgroundColor = "#F7F7F7";
					//anchor_text.style.background = "url('tabl.png')";
					//anchor_text.style.backgroundSize = "60px 120px";
					//anchor_text.style.marginTop = "px";
					//anchor_text.style.marginBottom = "0px";
                    anchor_text.style.color = "#444";
                    anchor_text.style.padding = "8px";
                  //  anchor_text.style.border = "thin solid black";
                  //  anchor_text.style.borderTopLeftRadius = "10px";
                  //  anchor_text.style.borderTopRightRadius = "10px";
                  //  anchor_text.style.borderBottomRightRadius = "10px";
				//	anchor_text.style.opacity = "0.8";
					//document.getElementById("myP").style.font = "italic bold 20px arial,serif";
					anchor_text.style.fontSize = "12px";
					anchor_text.style.whiteSpace = "nowrap";
					anchor_text.style.height = "35px"
					anchor_text.style.width = "80px";
					anchor_text.style.backgroundImage = "url('/uchastki-izhs/img/tabl_z01e.svg')";
					anchor_text.style.backgroundSize = "100% 100%";
					
                    anchor_text.innerHTML ="<b>Таунхаусы</b>";

                   // anchor_text.style.visibility = "hidden";

                    document.getElementById('main_canvas_container').appendChild(anchor_text);

                    
                    m_anchors.attach_move_cb(eID, function (x, y, appearance, obj, elem) {

                        var anchor_elem = document.getElementById("z01e");
                        anchor_elem.style.userSelect = "none";
                        anchor_elem.style.left = x + 5 + "px";
                        anchor_elem.style.top = y - 60 + "px";

                        if (appearance == "visible")
                            anchor_elem.style.visibility = "visible";
                        else
                            anchor_elem.style.visibility = "hidden";
                    });

				var selAnch = "z02e";

				var eID = m_scenes.get_object_by_name(selAnch);

                
                    var anchor_text = document.createElement("div");

                    anchor_text.id = selAnch;
                    anchor_text.style.position = "absolute";
                    //anchor_text.style.alignItems = "center";
					anchor_text.style.textAlign = "center";
                   	//anchor_text.style.marginTop = "10px";
					//anchor_text.style.marginBottom = "30px";
                    anchor_text.style.color = "#444";
                    anchor_text.style.padding = "8px";
                   
                    anchor_text.style.whiteSpace = "nowrap";
					anchor_text.style.fontSize = "12px";
					anchor_text.style.height = "35px"
					anchor_text.style.width = "138px";
					anchor_text.style.backgroundImage = "url('/uchastki-izhs/img/tabl_z02e.svg')";
					anchor_text.style.backgroundSize = "100% 100%";
					
					anchor_text.innerHTML ="<b>Петергофские дачи</b>";					
                   // anchor_text.style.visibility = "hidden";

                    document.getElementById('main_canvas_container').appendChild(anchor_text);

                    
                    m_anchors.attach_move_cb(eID, function (x, y, appearance, obj, elem) {

                        var anchor_elem = document.getElementById("z02e");
                        anchor_elem.style.userSelect = "none";
                        anchor_elem.style.left = x + 5 + "px";
                        anchor_elem.style.top = y - 60 + "px";

                        if (appearance == "visible")
                            anchor_elem.style.visibility = "visible";
                        else
                            anchor_elem.style.visibility = "hidden";
                    });
var selAnch = "z03e";

				var eID = m_scenes.get_object_by_name(selAnch);

                
                    var anchor_text = document.createElement("div");

                    anchor_text.id = selAnch;
                    anchor_text.style.position = "absolute";
                   
					anchor_text.style.textAlign = "center";
                    //anchor_text.style.backgroundColor = "#F7F7F7";
					
					
                    anchor_text.style.color = "#444";
                    anchor_text.style.padding = "5px";
                    
					
                    anchor_text.style.whiteSpace = "nowrap";
					anchor_text.style.fontSize = "12px";
					anchor_text.style.height = "50px"
					anchor_text.style.width = "180px";
					anchor_text.style.backgroundImage = "url('/uchastki-izhs/img/tabl_z03e.svg')";
					anchor_text.style.backgroundSize = "100% 100%";
					
					anchor_text.innerHTML ="<b>ж/д станция<br>Новый Петергоф</b>";					

                   // anchor_text.style.visibility = "hidden";

                    document.getElementById('main_canvas_container').appendChild(anchor_text);

                    
                    m_anchors.attach_move_cb(eID, function (x, y, appearance, obj, elem) {

                        var anchor_elem = document.getElementById("z03e");
                        anchor_elem.style.userSelect = "none";
                        anchor_elem.style.left = x + 5 + "px";
                        anchor_elem.style.top = y - 50 + "px";

                        if (appearance == "visible")
                            anchor_elem.style.visibility = "visible";
                        else
                            anchor_elem.style.visibility = "hidden";
                    });
var selAnch = "z04e";

				var eID = m_scenes.get_object_by_name(selAnch);

                
                    var anchor_text = document.createElement("div");

                    anchor_text.id = selAnch;
                    anchor_text.style.position = "absolute";
                    
					anchor_text.style.textAlign = "center";
                  
					//anchor_text.style.background = "url('tabl.png')";
					//anchor_text.style.backgroundSize = "60px 120px";
				
                    anchor_text.style.color = "#444";
                    anchor_text.style.padding = "5px";
           
                    anchor_text.style.whiteSpace = "nowrap";
					anchor_text.style.fontSize = "12px";
					anchor_text.style.height = "50px"
					anchor_text.style.width = "190px";
					anchor_text.style.backgroundImage = "url('/uchastki-izhs/img/tabl_z04e.svg')";
					anchor_text.style.backgroundSize = "100% 100%";
					
					anchor_text.innerHTML ="<b>Музей-заповедник<br>Петергоф</b>";					

                   // anchor_text.style.visibility = "hidden";

                    document.getElementById('main_canvas_container').appendChild(anchor_text);

                    
                    m_anchors.attach_move_cb(eID, function (x, y, appearance, obj, elem) {

                        var anchor_elem = document.getElementById("z04e");
                        anchor_elem.style.userSelect = "none";
                        anchor_elem.style.left = x + 5 + "px";
                        anchor_elem.style.top = y - 50 + "px";

                        if (appearance == "visible")
                            anchor_elem.style.visibility = "visible";
                        else
                            anchor_elem.style.visibility = "hidden";
                    });

var selAnch = "z05e";

				var eID = m_scenes.get_object_by_name(selAnch);

                
                    var anchor_text = document.createElement("div");

                    anchor_text.id = selAnch;
                    anchor_text.style.position = "absolute";
                   
					anchor_text.style.textAlign = "center";
					//anchor_text.style.background = "url('tabl.png')";
					//anchor_text.style.backgroundSize = "60px 120px";
					
                    anchor_text.style.color = "#444";
                    anchor_text.style.padding = "5px";
                   
                    anchor_text.style.whiteSpace = "nowrap";
					anchor_text.style.fontSize = "12px";
					anchor_text.style.height = "38px"
					anchor_text.style.width = "125px";
					anchor_text.style.backgroundImage = "url('/uchastki-izhs/img/tabl_z05e.svg')";
					anchor_text.style.backgroundSize = "100% 100%";
					anchor_text.innerHTML ="<b>Санкт-Петербург</b>";					

                   // anchor_text.style.visibility = "hidden";

                    document.getElementById('main_canvas_container').appendChild(anchor_text);

                    
                    m_anchors.attach_move_cb(eID, function (x, y, appearance, obj, elem) {

                        var anchor_elem = document.getElementById("z05e");
                        anchor_elem.style.userSelect = "none";
                        anchor_elem.style.left = x + 5 + "px";
                        anchor_elem.style.top = y - 50 + "px";

                        if (appearance == "visible")
                            anchor_elem.style.visibility = "visible";
                        else
                            anchor_elem.style.visibility = "hidden";
                    });

var selAnch = "z06e";

				var eID = m_scenes.get_object_by_name(selAnch);

                
                    var anchor_text = document.createElement("div");

                    anchor_text.id = selAnch;
                    anchor_text.style.position = "absolute";
                    
					anchor_text.style.textAlign = "center";
                  
					//anchor_text.style.background = "url('tabl.png')";
					//anchor_text.style.backgroundSize = "60px 120px";
				
                    anchor_text.style.color = "#444";
                    anchor_text.style.padding = "5px";
             
					anchor_text.style.whiteSpace = "nowrap";
					anchor_text.style.fontSize = "12px";
					anchor_text.style.height = "39px"
					anchor_text.style.width = "170px";
					anchor_text.style.backgroundImage = "url('/uchastki-izhs/img/tabl_z06e.svg')";
					anchor_text.style.backgroundSize = "100% 100%";					
					anchor_text.innerHTML ="<b>ш.Санкт-Петербургское</b>";
                   // anchor_text.style.visibility = "hidden";

                    document.getElementById('main_canvas_container').appendChild(anchor_text);

                    
                    m_anchors.attach_move_cb(eID, function (x, y, appearance, obj, elem) {

                        var anchor_elem = document.getElementById("z06e");
                        anchor_elem.style.userSelect = "none";
                        anchor_elem.style.left = x + 5 + "px";
                        anchor_elem.style.top = y - 50 + "px";

                        if (appearance == "visible")
                            anchor_elem.style.visibility = "visible";
                        else
                            anchor_elem.style.visibility = "hidden";
                    });


var selAnch = "z07e";

				var eID = m_scenes.get_object_by_name(selAnch);

                
                    var anchor_text = document.createElement("div");

                    anchor_text.id = selAnch;
                    anchor_text.style.position = "absolute";
                   
					anchor_text.style.textAlign = "center";
                   
					//anchor_text.style.background = "url('tabl.png')";
					//anchor_text.style.backgroundSize = "60px 120px";
					
                    anchor_text.style.color = "#444";
                    anchor_text.style.padding = "8px";
                   
					anchor_text.style.whiteSpace = "nowrap";
					anchor_text.style.fontSize = "12px";
					anchor_text.style.height = "35px"
					anchor_text.style.width = "110px";
					anchor_text.style.backgroundImage = "url('/uchastki-izhs/img/tabl_z05e.svg')";
					anchor_text.style.backgroundSize = "100% 100%";		
					
                    anchor_text.innerHTML ="<b>ш.Ропшинское</b>";
						

                   // anchor_text.style.visibility = "hidden";

                    document.getElementById('main_canvas_container').appendChild(anchor_text);

                    
                    m_anchors.attach_move_cb(eID, function (x, y, appearance, obj, elem) {

                        var anchor_elem = document.getElementById("z07e");
                        anchor_elem.style.userSelect = "none";
                        anchor_elem.style.left = x + 5 + "px";
                        anchor_elem.style.top = y - 50 + "px";

                        if (appearance == "visible")
                            anchor_elem.style.visibility = "visible";
                        else
                            anchor_elem.style.visibility = "hidden";
                    });

var selAnch = "z08e";

				var eID = m_scenes.get_object_by_name(selAnch);

                
                    var anchor_text = document.createElement("div");

                    anchor_text.id = selAnch;
                    anchor_text.style.position = "absolute";
                   
					anchor_text.style.textAlign = "center";
                   
                    anchor_text.style.color = "#444";
                    anchor_text.style.padding = "8px";
                    
					anchor_text.style.whiteSpace = "nowrap";
					
					anchor_text.style.fontSize = "12px";
					anchor_text.style.height = "35px"
					anchor_text.style.width = "40px";
					anchor_text.style.backgroundImage = "url('/uchastki-izhs/img/tabl_z08e.svg')";
					anchor_text.style.backgroundSize = "100% 100%";
					
                    anchor_text.innerHTML ="<b>КАД</b>";
						

                   // anchor_text.style.visibility = "hidden";

                    document.getElementById('main_canvas_container').appendChild(anchor_text);

                    
                    m_anchors.attach_move_cb(eID, function (x, y, appearance, obj, elem) {

                        var anchor_elem = document.getElementById("z08e");
                        anchor_elem.style.userSelect = "none";
                        anchor_elem.style.left = x + 5 + "px";
                        anchor_elem.style.top = y - 50 + "px";

                        if (appearance == "visible")
                            anchor_elem.style.visibility = "visible";
                        else
                            anchor_elem.style.visibility = "hidden";
                    });


		var canvas_elem = m_cont.get_canvas();
		canvas_elem.addEventListener("mousedown", main_canvas_click, false);
		canvas_elem.addEventListener("touchstart", main_canvas_click, false);


		// var camera = m_scenes.get_active_camera();
		var camera = m_scenes.get_object_by_name("Camera");
		
		//m_cam.set_fov(camera, fov);

		// var main_canvas = m_cont.get_canvas();
		// main_canvas.addEventListener("mouse", main_canvas_up);
		// main_canvas.addEventListener("mousedown", main_canvas_down);
		var elem = document.getElementById('main_canvas_container');


		if (elem.addEventListener) {
			if ('onwheel' in document) {
				// IE9+, FF17+, Ch31+
				elem.addEventListener("wheel", onWheel);
			} else if ('onmousewheel' in document) {
				// устаревший вариант события
				elem.addEventListener("mousewheel", onWheel);
			} else {
				// Firefox < 17
				elem.addEventListener("MozMousePixelScroll", onWheel);
			}
		} else { // IE8-
			elem.attachEvent("onmousewheel", onWheel);
		}

		function onWheel(e) {
			e = e || window.event;
		var fov;
		fov = m_cam.get_fov(camera);
			// wheelDelta не дает возможность узнать количество пикселей
			var delta = e.deltaY || e.detail || e.wheelDelta;
			if (delta < 0) {
				if (fov <= 1.5) {
					fov = fov + 0.1;
					m_cam.set_fov(camera, fov);
				}
			} else if (delta > 0)

			{
				if (fov >= 0.48) {
					fov = fov - 0.1;
					m_cam.set_fov(camera, fov);
				}
			}


			e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		}
		
{	
	var inf_img = document.getElementById("inf_img");
    var butt_container1 = document.getElementById("butt_container1");
	var butt_container2 = document.getElementById("butt_container2");
    var left_button = document.getElementById("left_button");
    var right_button = document.getElementById("right_button");
    var up_button = document.getElementById("up_button");
	var down_button = document.getElementById("down_button");
	var zoomin_button = document.getElementById("zoomin_button");
	var zoomout_button = document.getElementById("zoomout_button");

    /* var icons = document.getElementById("icons");
    icons.style.visibility = "visible"; */

    left_button.addEventListener("click", function() {
		var camera = m_scenes.get_active_camera();
		
		m_cam.rotate_camera(camera, Math.PI/10, 0);
		
        
    }, false);

    right_button.addEventListener("click", function() {
        var camera = m_scenes.get_active_camera();
		
		m_cam.rotate_camera(camera, -Math.PI/10, 0);

            }, false);
	
	up_button.addEventListener("click", function() {
        var camera = m_scenes.get_active_camera();
		
		m_cam.rotate_camera(camera, 0, Math.PI/12);
    }, false);
	
	down_button.addEventListener("click", function() {
		var camera = m_scenes.get_active_camera();
		
		m_cam.rotate_camera(camera, 0, -Math.PI/12);
        
    }, false);
	
	zoomout_button.addEventListener("click", function() {
        if (fov <= 1.5) {
					fov = fov + 0.1;
		m_cam.set_fov(camera, fov);}
    }, false);
	zoomin_button.addEventListener("click", function() {
        if (fov >= 0.48) {
					fov = fov - 0.1;
		m_cam.set_fov(camera, fov);}
    }, false);
    butt_container1.style.visibility = "visible";
	butt_container2.style.visibility = "visible";
	inf_img.style.visibility = "visible";
}


		reset_cam();
	
	}

			

});

// import the app module and start the app by calling the init method
b4w.require("Teorema_pano_1_main").init();