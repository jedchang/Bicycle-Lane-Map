<template>
  <div id="app">
    <loading
      loader="bars"
      color="#3986f7"
      :active.sync="isLoading"
      transition
      name="fade"
    >
      <template slot="default">
        <img
          class="loading-logo"
          src="@/assets/images/loading_logo_bike.svg"
          alt="loading"
        >
        <div class="sky">
          <div class="cloud-1" />
          <div class="cloud-2" />
          <div class="cloud-3" />
          <div class="cloud-4" />
          <div class="cloud-5" />
          <div class="cloud-6" />
          <div class="cloud-7" />
          <div class="cloud-8" />
          <div class="cloud-9" />
        </div>
      </template>
    </loading>

    <div class="main-wrapper">
      <div class="main">
        <div id="map" />
        <div class="inner-container">
          <nav class="nav-logo">
            <img
              src="~@/assets/images/logo_bike.svg"
              class="logo"
              alt="logo"
            >
          </nav>
          <div class="content">
            <el-tabs
              v-model="activeName"
              @tab-click="handlerClick"
            >
              <el-tab-pane name="route-map">
                <span
                  slot="label"
                  class="label"
                >
                  <img
                    v-if="activeName === 'route-map'"
                    src="@/assets/images/icon_route_map_active.svg"
                    alt="route map icon"
                  >
                  <img
                    v-else
                    src="@/assets/images/icon_route_map.svg"
                    alt="route map icon"
                  >
                  自行車道路網圖
                </span>
                <ScrollTop />
                <div class="select-group">
                  <select
                    v-model="cityName"
                    class="form-control city-name"
                    @change="getBikeRouteData(),bikeRouteName = null"
                  >
                    <option
                      value=""
                      disabled
                      selected
                    >
                      -- 請選擇地區 --
                    </option>
                    <option
                      v-for="city in cityData"
                      :key="city.CityID"
                      :value="city.City"
                    >
                      {{ city.CityName }}
                    </option>
                  </select>
                  <div class="selected-route">
                    <div
                      v-if="!bikeRouteName"
                      class="is-selected"
                    >
                      尚未選擇車道路線 (請由下方選取)
                    </div>
                    <div
                      v-else
                      class="is-selected active"
                    >
                      {{ bikeRouteName }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="bikeRouteData.length > 0"
                  class="view"
                >
                  <div
                    v-for="(r,index) in bikeRouteData"
                    :key="index"
                    class="list-box route-list"
                    :class="{selected : bikeRouteName === r.RouteName}"
                    @click.prevent="clickBikeRoute(r)"
                  >
                    <div class="inner">
                      <div class="name">
                        <h3>{{ r.RouteName }}</h3>
                      </div>
                      <div class="content">
                        <div
                          v-if="r.Direction"
                          class="direction"
                        >
                          {{ r.Direction }}
                        </div>
                        <div class="info-wrap">
                          <div class="road-info">
                            <div
                              v-if="r.RoadSectionStart"
                              class="start"
                            >
                              <span class="material-icons">
                                place
                              </span>
                              <span>
                                {{ r.RoadSectionStart }}
                              </span>
                            </div>
                            <div
                              v-else
                              class="start no-data"
                            >
                              <span class="material-icons">
                                place
                              </span>
                              <span>
                                ----
                              </span>
                            </div>
                            <div
                              v-if="r.RoadSectionEnd"
                              class="end"
                            >
                              <span class="material-icons">
                                flag
                              </span>
                              <span>
                                {{ r.RoadSectionEnd }}
                              </span>
                            </div>
                            <div
                              v-else
                              class="end no-data"
                            >
                              <span class="material-icons">
                                flag
                              </span>
                              <span>
                                ----
                              </span>
                            </div>
                          </div>
                          <div
                            class="length-info"
                          >
                            <p class="txt">
                              車道長度
                            </p>
                            <div class="length">
                              <p class="distance">
                                {{ r.CyclingLength | distance }}
                              </p>
                              <span class="unit">m</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="view loading"
                >
                  <div class="loading-item">
                    <p class="loading-txt">
                      LOADING
                    </p>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane name="station-map">
                <span
                  slot="label"
                  class="label"
                >
                  <img
                    v-if="activeName === 'station-map'"
                    src="@/assets/images/icon_bike_station_active.svg"
                    alt="bike station icon"
                  >
                  <img
                    v-else
                    src="@/assets/images/icon_bike_station.svg"
                    alt="bike station icon"
                  >
                  即時車位租借
                </span>
                <ScrollTop />
                <div class="select-group">
                  <select
                    v-model="cityNameFew"
                    class="form-control city-name"
                    @change="getBikeStationData()"
                  >
                    <option
                      value=""
                      disabled
                      selected
                    >
                      -- 請選擇地區 --
                    </option>
                    <option
                      v-for="c in cityDataFew"
                      :key="c.CityID"
                      :value="c.City"
                    >
                      {{ c.CityName }}
                    </option>
                  </select>
                  <a
                    href="#"
                    class="location-btn"
                    @click.prevent="getCurrentLocation()"
                  >
                    <span class="material-icons">
                      near_me
                    </span>
                    <span class="txt">
                      開啟定位功能
                    </span>
                  </a>
                </div>
                <div
                  v-if="filterBikeData.length > 0"
                  class="view"
                >
                  <div
                    v-for="(f,index) in filterBikeData"
                    :key="index"
                    class="list-box station-list"
                    :class="{selected : bikeStationName === f.StationName}"
                    @click.prevent="clickBikeStation(f)"
                  >
                    <div class="inner">
                      <div class="header">
                        <div class="top">
                          <div class="service-status">
                            <div
                              v-if="f.ServiceStatus === 0"
                              class="status status-0"
                            >
                              停止營運
                            </div>
                            <div
                              v-if="f.ServiceStatus === 1"
                              class="status status-1"
                            >
                              正常營運
                            </div>
                            <div
                              v-if="f.ServiceStatus === 2"
                              class="status status-2"
                            >
                              暫停營運
                            </div>
                          </div>
                          <div class="bike-status">
                            <div class="service-type">
                              <div
                                v-if="f.ServiceType === 1"
                                class="type type-1"
                              >
                                YouBike 1.0
                              </div>
                              <div
                                v-if="f.ServiceType === 2"
                                class="type type-2"
                              >
                                YouBike 2.0
                              </div>
                            </div>
                            <div class="bike-capacity">
                              <div class="txt">
                                <p>可容納</p>
                              </div>
                              <div class="qty">
                                <div class="capacity">
                                  {{ f.BikesCapacity }}
                                </div>
                                <div class="unit">
                                  輛
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="name">
                          <h3>{{ f.StationName }}</h3>
                        </div>
                        <p class="address">
                          {{ f.StationAddress.Zh_tw }}
                        </p>
                      </div>
                      <div class="content">
                        <div class="info-wrap">
                          <div class="bike-info">
                            <div
                              class="bike-style bike-rent"
                            >
                              <p class="txt">
                                可租借
                              </p>
                              <div class="style-unit rent">
                                <p class="bike">
                                  {{ f.AvailableRentBikes }}
                                </p>
                                <span class="unit">輛</span>
                              </div>
                            </div>
                            <div
                              class="bike-style bike-return"
                            >
                              <p class="txt">
                                可歸還
                              </p>
                              <div class="style-unit return">
                                <p class="bike">
                                  {{ f.AvailableReturnBikes }}
                                </p>
                                <span class="unit">輛</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="view loading"
                >
                  <div class="loading-item">
                    <p class="loading-txt">
                      LOADING
                    </p>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="copyright">
            © 2021 All rights reserved. Design & Code with
            <span class="material-icons">
              favorite
            </span>
            by
            <a
              href="https://github.com/jedchang"
              target="_blank"
            >Jed Chang</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { antPath } from 'leaflet-ant-path'
import jsSHA from 'jssha'
import Wkt from 'wicket'
import city from './utils/city.json'
import cityFew from './utils/cityStation.json'
import ScrollTop from '@/components/ScrollTop'

// 客製 icon
const bikeIcon = new L.icon({
  iconUrl: require('@/assets/images/icon_marker_bike.png'),
  iconSize: [49, 63],
  iconAnchor: [24.5, 0],
  popupAnchor: [1, 0]
})

const locateIcon = new L.icon({
  iconUrl: require('@/assets/images/icon_marker_locate.png'),
  iconSize: [49, 63],
  iconAnchor: [24.5, 0],
  popupAnchor: [1, 0]
})

const bikeStartIcon = new L.icon({
  iconUrl: require('@/assets/images/icon_marker_start.png'),
  iconSize: [49, 63],
  iconAnchor: [24.5, 63],
  popupAnchor: [1, -60]
})

const bikeEndIcon = new L.icon({
  iconUrl: require('@/assets/images/icon_marker_end.png'),
  iconSize: [49, 63],
  iconAnchor: [24.5, 63],
  popupAnchor: [1, -60]
})

const createMarker = function(coordinate, options = {}) {
  const marker = L.marker(coordinate, options)
  return marker
}

const createPopup = function(options) {
  const popup = L.popup(options)
  return popup
}

const createMarkerCluster = function() {
  return new L.markerClusterGroup({
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    zoomToBoundsOnClick: true,
    argumentsspiderfyOnMaxZoom: false,
    maxClusterRadius: 120,
    iconCreateFunction: function (cluster) {
      const markers = cluster.getAllChildMarkers()
      const html = `
        <div class="circle">
          ${markers.length}
        </div>
        .
      `
      return L.divIcon({ html: html, className: 'clusterBikeIcon', iconSize: L.point(49, 49) })
    }
  })
}

export default {
  name: 'App',
  components: {
    ScrollTop
  },
  data () {
    return {
      isLoading: false,
      activeName: 'route-map',
      screenWidth: document.body.clientWidth,
      map: null,
      mapOptions: {
        center: [23.92275, 120.98979],
        zoom: 8,
        zoomControl: true
      },
      longitude: null,
      latitude: null,
      distance: 500,
      bikeRouteData: [],
      bikeAvailabilityData: [],
      bikeStationData: [],
      filterBikeData: [],
      cityData: city,
      cityName: 'Taipei',
      cityDataFew: cityFew,
      cityNameFew: 'Taipei',
      bikeRouteName: null,
      bikeStationName: null,
      GEO: null,
      geojsonFeature: null,
      myLayer: null,
      routeStart: [],
      routeEnd: [],
      roadStartName: '',
      roadEndName: '',
      startMarker: [],
      endMarker: [],
      serviceType: '',
      serviceStatus: '',
      bikesCapacity: '',
      statusCode: null
    }
  },
  watch: {
    screenWidth (val) {
      this.screenWidth = val
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handlerScroll)
    this.initMap()
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        this.screenWidth = window.screenWidth
      })()
    }
    this.$nextTick(() => {
      this.getBikeRouteData()
      this.getBikeStationData()
    })
  },
  methods: {
    initMap() {
      this.map = new L.map('map', this.mapOptions).setView(this.mapOptions.center, this.mapOptions.zoom)
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: process.env.VUE_APP_ACCESSTOKEN
      }).addTo(this.map)
    },
    handlerClick(tab, event) {
      if (this.activeName === 'station-map') {
        if (this.myLayer) {
          this.removeExistingLayers()
        }
        this.bikeRouteData = []
        this.cityName = 'Taipei'
        this.cityNameFew = 'Taipei'
        this.removeMarkers()
        this.getBikeStationData()
        if (this.screenWidth < 766) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } else {
        if (this.myLayer) {
          this.removeExistingLayers()
        }
        this.filterBikeData = []
        this.bikeStationData = []
        this.cityName = 'Taipei'
        this.cityNameFew = 'Taipei'
        this.removeMarkers()
        this.getBikeRouteData()
        if (this.screenWidth < 766) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
      this.map.setView(this.mapOptions.center, this.mapOptions.zoom)
      this.GEO = null
      this.bikeRouteName = null
      this.bikeStationName = null
      this.startMarker = []
      this.endMarker = []
      this.geojsonFeature = null
      this.myLayer = null
      this.routeStart = []
      this.routeEnd = []
    },
    handlerScroll() {
      const routeMapScrollTop = document.querySelector('#pane-route-map .scroll-top')
      const stationMapScrollTop = document.querySelector('#pane-station-map .scroll-top')
      if (this.activeName === 'route-map' && window.scrollY > 500) {
        routeMapScrollTop.classList.add('fixed')
      } else if (this.activeName === 'station-map' && window.scrollY > 500) {
        stationMapScrollTop.classList.add('fixed')
      } else {
        stationMapScrollTop.classList.remove('fixed')
        routeMapScrollTop.classList.remove('fixed')
      }
    },
    removeExistingLayers() {
      this.map.removeLayer(this.myLayer)
      this.map.removeLayer(this.startMarker)
      this.map.removeLayer(this.endMarker)
    },
    clickBikeRoute(item) {
      if (this.myLayer) {
        this.removeExistingLayers()
      }
      this.bikeRouteName = item.RouteName
      this.createPolyLine(item.RouteName)
      if (this.screenWidth < 766) {
        this.map.setZoom(17)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    clickBikeStation(item) {
      this.bikeStationName = item.StationName
      this.longitude = item.StationPosition.PositionLon
      this.latitude = item.StationPosition.PositionLat
      this.serviceStatus = item.ServiceStatus
      this.serviceType = item.ServiceType
      this.bikesCapacity = item.BikesCapacity
      if (this.screenWidth < 766) {
        const popup = createPopup({
          minWidth: 270,
          className: 'leaflet-popup'
        })
        popup.setLatLng([this.latitude, this.longitude]).setContent(this.popupContent(item))
        this.map.openPopup(popup)
        this.map.panTo([this.latitude, this.longitude], 8)
        this.map.setView([this.latitude, this.longitude], 17)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const popup = createPopup({
          minWidth: 340,
          className: 'leaflet-popup'
        })
        popup.setLatLng([this.latitude, this.longitude]).setContent(this.popupContent(item))
        this.map.openPopup(popup)
        this.map.panTo([this.latitude, this.longitude], 18)
        this.map.setView([this.latitude, this.longitude], 18)
      }
    },
    getCurrentLocation () {
      navigator.geolocation.getCurrentPosition(position => {
        this.longitude = position.coords.longitude
        this.latitude = position.coords.latitude
        this.map.setView([this.latitude, this.longitude], 18)
        L.marker([this.latitude, this.longitude], { icon: locateIcon }).addTo(this.map)
      })
    },
    getAuthorizationHeader () {
      const AppID = process.env.VUE_APP_APPID
      const AppKey = process.env.VUE_APP_APPKEY
      const GMTString = new Date().toGMTString()
      const ShaObj = new jsSHA('SHA-1', 'TEXT')
      ShaObj.setHMACKey(AppKey, 'TEXT')
      ShaObj.update('x-date: ' + GMTString)
      const HMAC = ShaObj.getHMAC('B64')
      const Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"'
      return { Authorization: Authorization, 'X-Date': GMTString }
    },
    getBikeRouteData () {
      this.isLoading = true
      const currentCity = this.cityName
      if (this.screenWidth < 766) {
        this.mapOptions.center = [23.7072015, 121.0082785]
        this.mapOptions.zoom = 7
        this.map.setView(this.mapOptions.center, this.mapOptions.zoom)
      } else {
        this.mapOptions.center = [23.92275, 120.98979]
        this.mapOptions.zoom = 8
        this.map.setView(this.mapOptions.center, this.mapOptions.zoom)
      }
      if (this.myLayer) {
        this.removeExistingLayers()
      }
      this.removeMarkers()
      this.axios({
        methods: 'get',
        url: `https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/${currentCity}?$format=JSON`,
        headers: this.getAuthorizationHeader()
      })
        .then(res => {
          this.bikeRouteData = res.data
          this.isLoading = false
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    getBikeStationData () {
      this.isLoading = true
      const cityNameFew = this.cityNameFew
      this.mapOptions.center = [23.92275, 120.98979]
      this.mapOptions.zoom = 8
      this.map.setView(this.mapOptions.center, this.mapOptions.zoom)
      this.axios({
        methods: 'get',
        url: `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/${cityNameFew}?$format=JSON`,
        headers: this.getAuthorizationHeader()
      })
        .then(res => {
          this.bikeStationData = res.data
          this.bikeStationData.forEach(item => {
            item.StationName.Zh_tw = item.StationName.Zh_tw.replace(/_|ˍ/g, ' ')
          })
          this.isLoading = false
          if (this.activeName === 'station-map') {
            this.bikeRouteData = []
            this.removeMarkers()
            this.getBikeAvailableData()
          }
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    getBikeAvailableData () {
      this.isLoading = true
      const currentCityFew = this.cityNameFew
      if (this.screenWidth < 766) {
        this.mapOptions.center = [23.7072015, 121.0082785]
        this.mapOptions.zoom = 7
        this.map.setView(this.mapOptions.center, this.mapOptions.zoom)
      } else {
        this.mapOptions.center = [23.92275, 120.98979]
        this.mapOptions.zoom = 8
        this.map.setView(this.mapOptions.center, this.mapOptions.zoom)
      }
      this.axios({
        methods: 'get',
        url: `https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/${currentCityFew}?$format=JSON`,
        headers: this.getAuthorizationHeader()
      })
        .then(res => {
          this.bikeAvailabilityData = res.data
          this.filterBikeData.length = 0
          this.bikeAvailabilityData.forEach(bikeAvailabilityItem => {
            this.bikeStationData.forEach(bikeStationItem => {
              if (bikeAvailabilityItem.StationUID === bikeStationItem.StationUID) {
                bikeAvailabilityItem.StationName = bikeStationItem.StationName.Zh_tw.replace(/_|ˍ/g, '').replace(/YouBike1.0 |YouBike2.0 |iBike1.0 /g, '')
                bikeAvailabilityItem.StationAddress = bikeStationItem.StationAddress
                bikeAvailabilityItem.StationPosition = bikeStationItem.StationPosition
                bikeAvailabilityItem.BikesCapacity = bikeStationItem.BikesCapacity
                this.filterBikeData.push(bikeAvailabilityItem)
              }
            })
          })
          this.map.addLayer(this.setMarkers(this.filterBikeData))
          this.isLoading = false
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    createPolyLine() {
      this.bikeRouteData.forEach(item => {
        if (item.RouteName === this.bikeRouteName) {
          this.GEO = item.Geometry
          const wkt = new Wkt.Wkt()
          this.geojsonFeature = wkt.read(this.GEO).toJson()
          const reverseLatlngs = this.geojsonFeature.coordinates[0]
          reverseLatlngs.forEach(item => item.reverse())
          const options = {
            paused: false,
            reverse: false,
            delay: 2000,
            dashArray: [10, 20],
            weight: 6,
            opacity: 0.5
          }
          this.myLayer = antPath(reverseLatlngs, options).addTo(this.map)
          this.map.fitBounds(this.myLayer.getBounds())
        }
      })
      this.routeStart = this.geojsonFeature.coordinates[0][0]
      this.routeEnd = this.geojsonFeature.coordinates[0][this.geojsonFeature.coordinates[0].length - 1]
      this.bikeRouteData.forEach(item => {
        if (item.RouteName === this.bikeRouteName) {
          this.roadStartName = item.RoadSectionStart
          this.roadEndName = item.RoadSectionEnd
        }
      })
      this.setStartMarker()
      this.setEndMarker()
    },
    setStartMarker() {
      this.startMarker = new L.marker(this.routeStart, { icon: bikeStartIcon }).bindPopup(
        `<div class="start-popup route-popup">
            <h2>${this.bikeRouteName}</h2>
            <div class="info">
              <span>起點</span>
              <p>${this.roadStartName}</p>
            </div>
          </div>
        `
      ).addTo(this.map)
    },
    setEndMarker() {
      this.endMarker = new L.marker(this.routeEnd, { icon: bikeEndIcon }).bindPopup(
        `<div class="end-popup route-popup">
            <h2>${this.bikeRouteName}</h2>
            <div class="info">
              <span>終點</span>
              <p>${this.roadEndName}</p>
            </div>
          </div>
        `
      ).addTo(this.map)
    },
    removeMarkers() {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer)
        }
      })
    },
    setMarkers(data) {
      const markerCluster = createMarkerCluster()
      data.forEach(item => {
        const marker = createMarker(
          [item.StationPosition.PositionLat, item.StationPosition.PositionLon],
          { icon: bikeIcon }
        )
        if (this.screenWidth < 766) {
          const popup = createPopup({
            minWidth: 270,
            className: 'leaflet-popup'
          })
          popup.setContent(this.popupContent(item))
          marker.bindPopup(popup)
          markerCluster.addLayer(marker)
        } else {
          const popup = createPopup({
            minWidth: 340,
            className: 'leaflet-popup'
          })
          popup.setContent(this.popupContent(item))
          marker.bindPopup(popup)
          markerCluster.addLayer(marker)
        }
      })
      return markerCluster
    },
    popupContent(item) {
      if (item.ServiceType === 1) {
        this.serviceType = 'YouBike 1.0'
      } else if (item.ServiceType === 2) {
        this.serviceType = 'YouBike 2.0'
      }
      if (item.ServiceStatus === 0) {
        this.serviceStatus = '停止營運'
        this.statusCode = 'status-0'
      } else if (item.ServiceStatus === 1) {
        this.serviceStatus = '正常營運'
        this.statusCode = 'status-1'
      } else if (item.ServiceStatus === 2) {
        this.serviceStatus = '暫停營運'
        this.statusCode = 'status-2'
      }
      return `
        <div class="station-popup">
          <h2>${item.StationName}</h2>
          <div class="top">
            <div class="service-status">
            <div class="status ${this.statusCode}">
                ${this.serviceStatus}
            </div>
          </div>
          <div class="bike-status">
            <div class="service-type">
              <div class="type type-${item.ServiceType}">
                ${this.serviceType}
              </div>
            </div>
            <div class="bike-capacity">
              <div class="txt">
                <p>可容納</p>
              </div>
              <div class="qty">
                <div class="capacity">${this.bikesCapacity}</div>
                <div class="unit">輛</div>
              </div>
            </div>
          </div>
          </div>
          <div class="station-info">
            <div class="station-item">
              <p class="title rent">可租借</p>
              <p class="quantity rent-qty">${item.AvailableRentBikes}</p>
            </div>
            <div class="station-item">
              <p class="title return">可歸還</p>
              <p class="quantity return-qty">${item.AvailableReturnBikes}</p>
            </div>
          </div>
          </div>
        `
    }
  }
}
</script>

<style lang="scss">
@import url('https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css');
@import url('https://fonts.googleapis.com/css2?family=Material+Icons');
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap');
@import url("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.1.3/css/bootstrap-grid.min.css");
@import './assets/scss/main.scss';
</style>
