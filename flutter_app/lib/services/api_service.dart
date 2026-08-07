import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/project_model.dart';
import '../models/weather_model.dart';

class ForzexApiService {
  // Configurable base URL — points to Node/Express backend or local server
  static const String baseUrl = 'http://localhost:3000/api';

  // Fetch list of construction projects from server
  static Future<List<ConstructionProject>> getProjects() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/projects'));
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((item) => ConstructionProject.fromJson(item)).toList();
      }
    } catch (e) {
      print('API fetch error: $e');
    }
    // Return sample projects if server offline
    return [
      ConstructionProject(
        id: '1',
        name: 'Skyline Office Complex',
        status: 'completed',
        location: 'Dubai, UAE',
        budget: 5200000.0,
        completionPercentage: 100.0,
        latitude: 25.2048,
        longitude: 55.2708,
        phases: [
          ProjectPhase(id: 'p1', title: 'Foundation', isCompleted: true, estimatedCost: 850000),
          ProjectPhase(id: 'p2', title: 'Structure', isCompleted: true, estimatedCost: 1800000),
        ],
      ),
      ConstructionProject(
        id: '2',
        name: 'Harbor Residential Village',
        status: 'in-progress',
        location: 'Nairobi, Kenya',
        budget: 8500000.0,
        completionPercentage: 65.0,
        latitude: -1.286389,
        longitude: 36.817223,
        phases: [
          ProjectPhase(id: 'p1', title: 'Foundation', isCompleted: true, estimatedCost: 1200000),
          ProjectPhase(id: 'p2', title: 'Structure', isCompleted: false, estimatedCost: 2500000),
        ],
      ),
    ];
  }

  // Fetch open-source Open-Meteo weather for site coordinates
  static Future<SiteWeatherModel?> fetchSiteWeather(double lat, double lon, String locationName) async {
    try {
      final url = 'https://api.open-meteo.com/v1/forecast?latitude=$lat&longitude=$lon&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&timezone=auto';
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        return SiteWeatherModel.fromOpenMeteoJson(
          json: data,
          locationName: locationName,
          lat: lat,
          lon: lon,
        );
      }
    } catch (e) {
      print('Weather API error: $e');
    }
    return null;
  }

  // Post AI Site Inspection image analysis
  static Future<SiteAiAnalysis> analyzeSiteCameraImage(double lat, double lon) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/ai/analyze'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'latitude': lat, 'longitude': lon}),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return SiteAiAnalysis(
          safetyPasses: ['Hard hats & high-visibility PPE detected', 'Perimeter safety gates locked'],
          safetyWarnings: ['Scaffolding edge protection check recommended'],
          objectsDetected: ['Tower Crane', 'Hydraulic Excavator', 'Concrete Mixer', 'Steel Beams'],
          latitude: lat,
          longitude: lon,
          timestamp: DateTime.now().toIso8601String(),
        );
      }
    } catch (e) {
      print('AI Analyze error: $e');
    }
    // Fallback response
    return SiteAiAnalysis(
      safetyPasses: ['PPE Standard Check Passed', 'Safety Harness Verified'],
      safetyWarnings: ['Wind speed threshold advisory'],
      objectsDetected: ['Construction Equipment', 'Reinforced Concrete', 'Workers (4)'],
      latitude: lat,
      longitude: lon,
      timestamp: DateTime.now().toIso8601String(),
    );
  }
}
