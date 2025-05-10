export interface WeatherData {
  temperature: { current: string; temp_max: string }; // °C
  description: string;
  city: string;
  humidity: number;
}