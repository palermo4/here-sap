sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var self = null;
	return Controller.extend("com.demo.SAPHEREApp.controller.Main", {
		
		
		onInit : function() {
			self = this;
		},
		
		demoMap: function() {
			var oView = this.getView();
			this._hidePanels(oView);
			oView.setBusy(true);
			this._demoMap(oView);
		},
		_demoMap: function(oView) {
			// called for dynamic map connected to user input
			
			// create JSONModel
			var oAPIModel = new sap.ui.model.json.JSONModel();
			
			// construct API URL with /geo as base to obtain geolocation based on user input
			var url = "/geo/6.2/geocode.json?searchtext=" + 
				this._getInputValue(oView) + 
				"&app_id=" + self._getAppId(oView) + "&app_code=" + self._getAppCode(oView); 
			
			// invoke URL
			oAPIModel.loadData(url, null, true, "GET", null, false, self._headers);
			
			// attach function to handle when data load is complete
			oAPIModel.attachRequestCompleted(function(oEvent){
				
				// set view to loaded model
				oView.setModel(oAPIModel);
			
				var oImage = oView.byId("imageDynamic");
				
				// programmatically obtain the values of latitude and longitude from model
				var lat = oAPIModel.getProperty("/Response/View/0/Result/0/Location/DisplayPosition/Latitude");
				var lng = oAPIModel.getProperty("/Response/View/0/Result/0/Location/DisplayPosition/Longitude");
				
				// construct image source url to use HERE Map API with base of /map --- do not urlencode
				var imageUrl = "/map/mia/1.6/mapview?" + "c=" + lat.toString() + "," + lng.toString() + 
				"&app_id=" + self._getAppId(oView) + "&app_code=" + self._getAppCode(oView);
				
				sap.m.MessageToast.show(imageUrl);
				
				// set the image source to constructed API URL
				oImage.setSrc(imageUrl);
				var oPanel = oView.byId("panelMap");
				oPanel.setVisible(true);
				oView.setBusy(false);
			});
		},
		
		demoGeocoder: function() {
			var oView = this.getView();
			this._hidePanels(oView);
			oView.setBusy(true);
			this._demoGeocoder(oView);
		},
		_demoGeocoder: function(oView) {
			// called for geocoder demo to display geolocation values
			
			// create JSONModel
			var oAPIModel = new sap.ui.model.json.JSONModel();

			// construct API URL with /geo as base to obtain geolocation based on user input
			var url = "/geo/6.2/geocode.json?searchtext=" + this._getInputValue(oView) + 
			"&app_id=" + self._getAppId(oView) + "&app_code=" + self._getAppCode(oView);	
			
			// invoke URL
			oAPIModel.loadData(url, null, true, "GET", null, false, self._headers);
			
			// attach function to handle when data load is complete
			oAPIModel.attachRequestCompleted(function(oEvent){
				
				// set view to loaded model --- databinding is declarative (see Main.view.xml)
				oView.setModel(oAPIModel);
				
				sap.m.MessageToast.show(oAPIModel.getJSON());
				var oPanel = oView.byId("panelGeocoder");
				oPanel.setVisible(true);
				oView.setBusy(false);
			});
		},
		
		demoWeather: function() {
			var oView = this.getView();
			oView.setBusy(true);
			this._hidePanels(oView);
			this._demoWeather(oView);
		},
		_demoWeather: function(oView) {
			// called for geocoder demo to display geolocation values
			
			// create JSONModel
			var oAPIModel = new sap.ui.model.json.JSONModel();
			
			// construct API URL with /weather as base to obtain severe weather info based on user input
			var url = "/weather/weather/1.0/report.json?product=alerts&name=" + 
			this._getInputValue(oView) + "&app_id=" + self._getAppId(oView) + "&app_code=" + self._getAppCode(oView);
			
			// invoke URL
			oAPIModel.loadData(url, null, true, "GET", null, false, self._headers);
			
			// attach function to handle when data load is complete
			oAPIModel.attachRequestCompleted(function(oEvent){
				
				// set view to loaded model --- databinding is declarative (see Main.view.xml)
				oView.setModel(oAPIModel);
				
				// obtain severe weather alert description from model
				var description = oAPIModel.getProperty("/alerts/alerts/0/description");
				
				// if no description exists, that means there is currently no severe alert for that area
				if (description === null || description === undefined || description === "") {
					// create a modification to model to provide a description
					var alterJSON = {"alerts":{"alerts":[{"type":"0","description":"No severe weather warnings"}]}};
					// add the modification to model
					oAPIModel.setData(alterJSON, true);
					sap.m.MessageToast.show(oAPIModel.getJSON());
				}
				
				sap.m.MessageToast.show(oAPIModel.getJSON());
				var oPanel = oView.byId("panelWeather");
				oPanel.setVisible(true);
				oView.setBusy(false);
			});

		},

		demoRouting: function() {
			var oView = this.getView();
			this._hidePanels(oView);
			oView.setBusy(true);
			this._demoRouting(oView);
		},
		_demoRouting: function(oView) {
			// called for routing demo to show route from Chicago to location specified by user input
			
			// create JSONModel
			var oAPIModel = new sap.ui.model.json.JSONModel();
			var url = "/geo/6.2/geocode.json?searchtext=" + this._getInputValue(oView) +
			"&app_id=" + self._getAppId(oView) + "&app_code=" + self._getAppCode(oView);
			
			// invoke URL
			oAPIModel.loadData(url, null, true, "GET", null, false, self._headers);
			
			// attach function to handle when data load is complete
			oAPIModel.attachRequestCompleted(function(oEvent){
				
				// set view to loaded model
				oView.setModel(oAPIModel);
				var oImage = oView.byId("imageMapRouting");
				
				// programmatically obtain the values of latitude and longitude from model
				var lat = oAPIModel.getProperty("/Response/View/0/Result/0/Location/DisplayPosition/Latitude");
				var lng = oAPIModel.getProperty("/Response/View/0/Result/0/Location/DisplayPosition/Longitude");
				
				// construct HERE API URL with /map as base, with Chicago as waypoint0 and user input as waypoint1
				var waypoints = "waypoint0=41.88425,-87.63245&waypoint1=" + lat.toString() + "," + lng.toString();
				var imageUrl = "/map/mia/1.6/routing?w=600&h=600&" + waypoints + 
				"&app_id=" + self._getAppId(oView) + "&app_code=" + self._getAppCode(oView);
				
				// set image source to constructed URL
				oImage.setSrc(imageUrl);
				
				sap.m.MessageToast.show(imageUrl);
				var oPanel = oView.byId("panelRouting");
				oPanel.setVisible(true);
				oView.setBusy(false);
			});
		},
		
		// support functions and properties
		_hidePanels: function(oView) {
			var oPanelGeocoder = oView.byId("panelGeocoder");
			oPanelGeocoder.setVisible(false);
			var oPanelMap = oView.byId("panelMap");
			oPanelMap.setVisible(false);
			var oPanelWeather = oView.byId("panelWeather");
			oPanelWeather.setVisible(false);
			var oPanel = oView.byId("panelRouting");
			oPanel.setVisible(false);
		},
		_getInputValue: function(oView) {
			var oInputValue = oView.byId("inputPlace");
			return oInputValue.getValue();
		},
		_getAppId: function(oView) {
			var appId =	oView.getModel("here").getResourceBundle().getText("appId");
			return appId;
		},
		_getAppCode: function(oView) {
			var appCode = oView.getModel("here").getResourceBundle().getText("appCode");
			return appCode;
		},
		_headers : {"Content-Type":"application/json","Accept":"application/json, text/html;charset=utf-8"}
	});
});
