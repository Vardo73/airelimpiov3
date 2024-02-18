export interface ErrorResponse {
    message: string;
    errorCode: number;
}
  
export interface SensorData {
    api_version: string;
    time_stamp: number;
    data_time_stamp: number;
    sensor: {
      sensor_index: number;
      last_modified: number;
      date_created: number;
      last_seen: number;
      private: number;
      is_owner: number;
      name: string;
      icon: number;
      location_type: number;
      model: string;
      hardware: string;
      led_brightness: number;
      firmware_version: string;
      rssi: number;
      uptime: number;
      pa_latency: number;
      memory: number;
      position_rating: number;
      latitude: number;
      longitude: number;
      altitude: number;
      channel_state: number;
      channel_flags: number;
      channel_flags_manual: number;
      channel_flags_auto: number;
      confidence: number;
      confidence_auto: number;
      confidence_manual: number;
      humidity: number;
      humidity_a: number;
      temperature: number;
      temperature_a: number;
      pressure: number;
      pressure_a: number;
      analog_input: number;
      pm1_0: number;
      pm1_0_a: number;
      pm1_0_b: number;
      pm2_5: number;
      pm2_5_a: number;
      pm2_5_b: number;
      pm2_5_alt: number;
      pm2_5_alt_a: number;
      pm2_5_alt_b: number;
      pm10_0: number;
      pm10_0_a: number;
      pm10_0_b: number;
      scattering_coefficient: number;
      scattering_coefficient_a: number;
      scattering_coefficient_b: number;
      deciviews: number;
      deciviews_a: number;
      deciviews_b: number;
      visual_range: number;
      visual_range_a: number;
      visual_range_b: number;
      '0.3_um_count': number;
      '0.3_um_count_a': number;
      '0.3_um_count_b': number;
      '0.5_um_count': number;
      '0.5_um_count_a': number;
      '0.5_um_count_b': number;
      '1.0_um_count': number;
      '1.0_um_count_a': number;
      '1.0_um_count_b': number;
      '2.5_um_count': number;
      '2.5_um_count_a': number;
      '2.5_um_count_b': number;
      '5.0_um_count': number;
      '5.0_um_count_a': number;
      '5.0_um_count_b': number;
      '10.0_um_count': number;
      '10.0_um_count_a': number;
      '10.0_um_count_b': number;
      pm1_0_cf_1: number;
      pm1_0_cf_1_a: number;
      pm1_0_cf_1_b: number;
      pm1_0_atm: number;
      pm1_0_atm_a: number;
      pm1_0_atm_b: number;
      'pm2.5_atm': number;
      pm2_5_atm_a: number;
      pm2_5_atm_b: number;
      pm2_5_cf_1: number;
      pm2_5_cf_1_a: number;
      pm2_5_cf_1_b: number;
      'pm10.0_atm': number;
      pm10_0_atm_a: number;
      pm10_0_atm_b: number;
      pm10_0_cf_1: number;
      pm10_0_cf_1_a: number;
      pm10_0_cf_1_b: number;
      primary_id_a: number;
      primary_key_a: string;
      primary_id_b: number;
      primary_key_b: string;
      secondary_id_a: number;
      secondary_key_a: string;
      secondary_id_b: number;
      secondary_key_b: string;
      stats: {
        "pm2.5": number;
        "pm2.5_10minute": number;
        "pm2.5_30minute": number;
        "pm2.5_60minute": number;
        "pm2.5_6hour": number;
        "pm2.5_24hour": number;
        "pm2.5_1week": number;
        time_stamp: number;
      };
      stats_a: {
        "pm2.5": number;
        "pm2.5_10minute": number;
        "pm2.5_30minute": number;
        "pm2.5_60minute": number;
        "pm2.5_6hour": number;
        "pm2.5_24hour": number;
        "pm2.5_1week": number;
        time_stamp: number;
      };
      stats_b: {
        "pm2.5": number;
        "pm2.5_10minute": number;
        "pm2.5_30minute": number;
        "pm2.5_60minute": number;
        "pm2.5_6hour": number;
        "pm2.5_24hour": number;
        "pm2.5_1week": number;
        time_stamp: number;
      };
    };
}


export interface StationData {
  message: string;
  errorCode: number;
}

export interface ReportEmail {
  monitor: string,
  neighborhood:string,
  pm2_average:number,
  pm10_average:number,
  percentage:number,
}