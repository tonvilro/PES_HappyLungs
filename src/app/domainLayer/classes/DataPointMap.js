const DadesObertes = require("../services/DadesObertes");
const MeasureStation = require("./MeasureStation.js");

const dadesObertes = new DadesObertes();

class DataPointMap {

    constructor (latitude, longitud) {
       this.latitude = latitude;
       this.longitud = longitud;
    }

        /**
     * 
     * @param {Date} date 
     * @param {Integer} hour 
     * @returns {Integer} pollution level at the date "date" and hour "hour" of the nearer Measure Station.
     */
    async  getHourLevel(date, hour) {
        let nearPoints = await this.nearerPoints();

        let nearPoint = new MeasureStation(nearPoints[0][1].codi_eoi);
            return await nearPoint.getHourLevel(date, hour);
    }
    
   /**
     * Calculates the pollution level at every hour of the day
     * @param {Date} date date
     * @returns {Array<Integer>} pollution level at every hour of a day of the nearer Measure Station.
     */ 
    async getDayLevel (date) {
        let nearPoints = await this.nearerPoints(date);

        let nearPoint = new MeasureStation(nearPoints[0][1].codi_eoi);
       return await nearPoint.getDayLevel(date);
    }
    
   /**
     * Calculates the pollution level at every day of a week
     * @param {Date} date date
     * @returns {Array<Integer>} pollution level of the latest 7 days from date of the nearer Measure Station.
     */
    async getWeekLevel (date) {
        let nearPoints = await this.nearerPoints(date);

        let nearPoint = new MeasureStation(nearPoints[0][1].codi_eoi);
       return await nearPoint.getWeekLevel(date);
    }
 /**
     * Calculates the pollution level at every day of a month
     * @param {Date} date date
     * @returns {Array<Integer>} pollution level of the latest 30 days from date of the nearer Measure Station.
     */ 
    async getMonthLevel (date) {
        let nearPoints = await this.nearerPoints(date);

        let nearPoint = new MeasureStation(nearPoints[0][1].codi_eoi);
     return await nearPoint.getMonthLevel(date);
    }

    async getYearLevel (date) {
        let puntos_cercanos = await this.nearerPoints(date);

        let punto_cercano = new MeasureStation(puntos_cercanos[0][1].codi_eoi);
        return await punto_cercano.getYearLevel(date);
    }
    
    //PIE CHART GETTERS
        
   /**
     * Calculates the quantities of each pollutant on a date.
     * @param {Date} date
     * @returns Returns the quantities of each pollutant on a date of the nearer Measure Station.
     */
    async getPollutantsQuantDay (date) {
        let nearPoints = await this.nearerPoints(date);

        let nearPoint = new MeasureStation(nearPoints[0][1].codi_eoi);
       return await nearPoint.getQuantityOfEachPollutantDay(date);
    }
   /**
     * Calculates the quantities of each pollutant on a week.
     * @param {Date} date
     * @returns Returns the quantities of each pollutant on a week of the nearer Measure Station.
     */
    async getPollutantsQuantWeek (date) {
        let nearPoints = await this.nearerPoints(date);

        let nearPoint = new MeasureStation(nearPoints[0][1].codi_eoi);
       return await nearPoint.getQuantityOfEachPollutantWeek(date);
    }
 /**
     * Calculates the quantities of each pollutant on a month.
     * @param {*} date
     * @returns Returns the quantities of each pollutant on a month of the nearer Measure Station.
     */
    async getPollutantsQuantMonth (date) {
        let nearPoints = await this.nearerPoints(date);

        let nearPoint = new MeasureStation(nearPoints[0][1].codi_eoi);
     return await nearPoint.getQuantityOfEachPollutantMonth(date);
    }
         /**
     * Calculates the quantities of each pollutant on a Year.
     * @param {*} date
     * @returns Returns the quantities of each pollutant on a Year of the nearer Measure Station..
     */
    async getPollutantsQuantYear (date) {
        let nearPoints = await this.nearerPoints(date);

        let nearPoint = new MeasureStation(nearPoints[0][1].codi_eoi);
             return await nearPoint.getQuantityOfEachPollutantYear(date);
    }

    //Getters
  /**
   * Get the nearest Measure Stations ordered.
   * @returns {[distance1, Point1], [distance2, Point2]} Starting from a point (this) selected by the user, the function will return all the points sorted ascending by
   distance in an Array of Arrays data structure.
   * @param date
   */
   async nearerPoints(date) {
        //let mas_prox = 6371000;
        let points = [];
        //let point1 = new MeasureStation("08015001", "Franciaa", "urbana" , 41.443584, 2.23889, null );
        //let distancia = point1.distance(this.latitude,this.longitud);
        let distanciaTotal = 0;
        let all_points = await dadesObertes.getMeasuresDate(date);
        all_points.forEach(c_point => {
            let m_s = new MeasureStation(c_point.eoiCode, c_point.stationName, c_point.stationType, c_point.latitud, c_point.longitud, null)
            let d = m_s.distance(this.latitude,this.longitud);
            distanciaTotal += d;
            points.push([d,c_point]);
        });

      return points.sort(function (a, b) {
            return a[0] - b[0];
        });
    }

}

module.exports = DataPointMap;
