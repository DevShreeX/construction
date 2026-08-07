// Dart Model Class for Weather Prediction & Construction Safety Risk Assessment

class SiteWeatherModel {
  final double temperature;
  final double feelsLike;
  final double windSpeedKm;
  final double precipitationMm;
  final int humidity;
  final String conditionLabel;
  final String locationName;
  final double latitude;
  final double longitude;
  final bool isHighWindRisk;
  final bool isRainRisk;
  final String safetyAdvisory;

  SiteWeatherModel({
    required this.temperature,
    required this.feelsLike,
    required this.windSpeedKm,
    required this.precipitationMm,
    required this.humidity,
    required this.conditionLabel,
    required this.locationName,
    required this.latitude,
    required this.longitude,
    required this.isHighWindRisk,
    required this.isRainRisk,
    required this.safetyAdvisory,
  });

  factory SiteWeatherModel.fromOpenMeteoJson({
    required Map<String, dynamic> json,
    required String locationName,
    required double lat,
    required double lon,
  }) {
    final current = json['current'] ?? {};
    final temp = (current['temperature_2m'] ?? 0.0).toDouble();
    final feels = (current['apparent_temperature'] ?? temp).toDouble();
    final wind = (current['wind_speed_10m'] ?? 0.0).toDouble();
    final precip = (current['precipitation'] ?? 0.0).toDouble();
    final hum = (current['relative_humidity_2m'] ?? 0).toInt();
    final wmoCode = (current['weather_code'] ?? 0).toInt();

    final isWindAlert = wind > 35.0;
    final isRainAlert = precip > 0.0;

    String advisory = "Optimal Construction Conditions: Site operations permitted.";
    if (isWindAlert) {
      advisory = "HIGH WIND WARNING (${wind.round()} km/h): Halt crane and elevated scaffolding work!";
    } else if (isRainAlert) {
      advisory = "RAIN ALERT (${precip} mm): Delay exterior concrete pouring & earth excavation.";
    }

    return SiteWeatherModel(
      temperature: temp,
      feelsLike: feels,
      windSpeedKm: wind,
      precipitationMm: precip,
      humidity: hum,
      conditionLabel: _parseWmoCode(wmoCode),
      locationName: locationName,
      latitude: lat,
      longitude: lon,
      isHighWindRisk: isWindAlert,
      isRainRisk: isRainAlert,
      safetyAdvisory: advisory,
    );
  }

  static String _parseWmoCode(int code) {
    if (code == 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy / Hazy';
    if (code >= 51 && code <= 65) return 'Rain Showers';
    if (code >= 71 && code <= 77) return 'Snow Flurries';
    if (code >= 95) return 'Thunderstorm Warning';
    return 'Overcast';
  }
}
